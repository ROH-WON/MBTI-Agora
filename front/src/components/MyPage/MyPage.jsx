import MyCalendar from './MyCalendar';
import MyMainMood from './MyMainMood';
import MyMoodStat from './MyMoodStat';
import MyDaenamus from './MyDaenamus';
import MyLikedDaenamus from './MyLikedDaenamus';
import MyComments from './MyComments';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { getApi } from '../../services/api';

const MyPage = () => {
	const dummyData = [
		{ date: '2023-07-18', mood: '😊' },
		{ date: '2023-07-19', mood: '😢' },
	];

	const [posts, setPosts] = useState([]);
	const fetchData = async () => {
		try {
			const response = await getApi('stories/my/calendar');
			setPosts(response.data.posts);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="2xl:px-52">
			<h3 className="mt-16 text-3xl text-gray-700 font-semibold">나의 활동</h3>

			<hr className="my-16" />
			<div>
				<h3 className="text-2xl text-gray-700 font-semibold">내가 쓴 스토리</h3>
				<div className="text-base mt-4 mb-4 text-gray-700">
					달력의 날짜를 클릭하면 그 날의 스토리를 볼 수 있어요.
				</div>
				<div className="text-base mt-4 mb-4 text-gray-700">
					<ChevronRightIcon className="w-4 inline mb-1" />
					<span className="inline">
						<Link to="/stories">&nbsp;전체보기</Link>
					</span>
				</div>
			</div>

			<div className="flex justify-center flex-wrap">
				<div className="flex flex-col md:flex-row">
					<div className="md:w-1/2 lg:w-1/2 px-3 ">
						<MyCalendar posts={posts} dateMoodData={dummyData} />
					</div>
					<div className="md:w-1/2 lg:w-1/2 px-3">
						<div className="md:flex md:flex-col md:h-full">
							<div className="pt-5">
								<MyMainMood posts={posts} />
							</div>
							<div className="pt-4">
								<MyMoodStat />
							</div>
						</div>
					</div>
				</div>
			</div>

			<hr className="my-8" />

			<MyDaenamus />

			<hr className="my-8" />
			<MyLikedDaenamus />

			<hr className="my-8" />
			<MyComments />
		</div>
	);
};

export default MyPage;
