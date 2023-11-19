import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { textToIcon, calendarDateToString } from '../Util/Util';
import { useNavigate } from 'react-router-dom';
import { getApi } from '../../services/api';

function MyCalendar() {
	const [posts, setPosts] = useState([]);
	const navigate = useNavigate();

	const fetchData = async (year, month) => {
		try {
			const response = await getApi(
				`stories/my/calendar?year=${year}&month=${month}`,
			);
			setPosts(response.data.posts);
		} catch (error) {
			console.log(error);
		}
	};

	const simplePost = (posts || []).map(({ koreaCreatedAt, mood, _id }) => ({
		date: new Date(koreaCreatedAt).toISOString().split('T')[0],
		mood: textToIcon[mood],
		_id,
	}));

	const getDataFromDate = (date) => {
		const dateString = calendarDateToString(date);
		const data = simplePost.find((item) => item.date === dateString);
		return data;
	};

	const renderTileContent = ({ date, view, activeStartDate }) => {
		const currentMonthInView = activeStartDate.getMonth();
		const dateMonth = date.getMonth();
		const data = getDataFromDate(date);

		if (view === 'month' && currentMonthInView === dateMonth) {
			return (
				<div className="tileContentWrapper">
					<span className="text-3xl">{data ? data.mood : '⚪'}</span>
				</div>
			);
		} else {
			return (
				<div className="tileContentWrapper">
					<span className="text-4xl">{'　'}</span>
				</div>
			);
		}
	};

	const handleDateClick = (date) => {
		const data = getDataFromDate(date);
		if (data) {
			navigate(`/stories/${data._id}`);
		}
	};

	const handleActiveStartDateChange = ({ activeStartDate }) => {
		const year = activeStartDate.getFullYear();
		const month = activeStartDate.getMonth() + 1;
		fetchData(year, month); // Call the fetchData function when the active month changes
	};

	useEffect(() => {
		// Get current year and month on first render
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth() + 1;

		// Fetch data for current year and month
		fetchData(currentYear, currentMonth);
	}, []);

	return (
		<div>
			<Calendar
				className="mt-5 px-5 md:px-1.5"
				tileContent={renderTileContent}
				formatDay={(locale, date) =>
					date.toLocaleString('en', { day: 'numeric' })
				}
				formatShortWeekday={(locale, date) =>
					date.toLocaleString('en', { weekday: 'short' })
				}
				onClickDay={handleDateClick}
				onActiveStartDateChange={handleActiveStartDateChange}
			/>
		</div>
	);
}

export default MyCalendar;
