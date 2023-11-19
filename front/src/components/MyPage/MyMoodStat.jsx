import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';
import {
	Chart,
	DoughnutController,
	ArcElement,
	Tooltip,
	Legend,
} from 'chart.js';
import { getApi } from '../../services/api';
import { objectToKorean, textToDeepColor } from '../Util/Util';
const MyMoodStat = () => {
	const chartRef = useRef(null);

	const [moods, setMoods] = useState({});

	const [isDataLoading, setIsDataLoading] = useState(false);

	const fetchMoodStat = async () => {
		try {
			const response = await getApi('stories/my/moodStat');
			setIsDataLoading(true);

			setMoods(objectToKorean(response.data.valuePercentage));
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchMoodStat();
	}, []);

	useEffect(() => {
		if (isDataLoading) {
			Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

			const chart = new Chart(chartRef.current, {
				type: 'doughnut',
				data: {
					labels: Object.keys(moods),
					datasets: [
						{
							data: Object.values(moods),
							backgroundColor: Object.keys(moods).map(
								(key) => textToDeepColor[key],
							),
							hoverOffset: 4,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: 'right',
							labels: {
								usePointStyle: true,
								pointStyle: 'circle',
							},
						},
					},
				},
			});

			return () => {
				chart.destroy();
			};
		}
	}, [moods]);

	return (
		<div className="relative block pt-4 bg-slate-50 border border-gray-200 rounded-lg hover:bg-gray-100 flex flex-col items-center justify-center">
			<InformationCircleIcon
				data-tooltip-id="tooltip"
				data-tooltip-content="나의 모든 스토리를 바탕으로 집계됩니다."
				className="absolute top-3 right-3 h-5 w-5 text-slate-400"
			/>{' '}
			<h5 className="text-xl font-bold tracking-tight text-gray-900">
				나의 감정 통계
			</h5>
			<div>
				{isDataLoading && Object.keys(moods).length === 0 ? (
					<p className="px-14 py-8 text-center text-sm text-gray-600">
						아직 스토리를 쓰지 않았습니다. <br />
						스토리를 쓰고 나의 감정 통계를 확인해보세요.
					</p>
				) : (
					<canvas
						ref={chartRef}
						style={{ height: '200px', width: '200px' }}
					></canvas>
				)}
			</div>
		</div>
	);
};

export default MyMoodStat;
