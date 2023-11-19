import { InformationCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { textToIcon } from '../Util/Util';
import PropTypes from 'prop-types';

const MyMainMood = ({ posts }) => {
	const [mainMood, setMainMood] = useState('');
	useEffect(() => {
		const moodFrequency = {};

		posts?.forEach((post) => {
			if (post.mood in moodFrequency) {
				moodFrequency[post.mood] += 1;
			} else {
				moodFrequency[post.mood] = 1;
			}
		});

		const mostFrequentMood = Object.keys(moodFrequency).reduce(
			(a, b) => (moodFrequency[a] > moodFrequency[b] ? a : b),
			'',
		);

		setMainMood(mostFrequentMood);
	}, [posts]);

	const currentMonth = moment().format('M');
	return (
		<div className="relative block p-4 pb-5 bg-slate-50 border border-gray-200 rounded-lg hover:bg-gray-100flex flex-col items-center justify-center">
			<InformationCircleIcon
				data-tooltip-id="tooltip"
				data-tooltip-content="이번 달에 가장 많이 느낀 감정이에요."
				className="absolute top-3 right-3 h-5 w-5 text-slate-400"
			/>{' '}
			<h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 text-center">
				{currentMonth}월의 주요 감정
			</h5>
			{!posts ? (
				<p className="px-10 py-12 text-center text-sm text-gray-600">
					아직 스토리를 쓰지 않았습니다. <br />
					스토리를 쓰고 나의 주요 감정을 확인해보세요.
				</p>
			) : (
				<p className="text-7xl text-gray-700 text-center">
					{textToIcon[mainMood]}
				</p>
			)}
		</div>
	);
};

MyMainMood.propTypes = {
	posts: PropTypes.array.isRequired,
};

export default MyMainMood;
