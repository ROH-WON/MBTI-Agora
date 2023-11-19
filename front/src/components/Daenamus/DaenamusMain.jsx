import { useState, useEffect } from 'react';
import Search from '../Global/Search';
import DaenamuCardMap from './DaenamuCardMap';
import { mbtiList } from '../Util/Util';
import { useNavigate } from 'react-router-dom';
import { useIsLoggedIn } from '../../store/useUserStore';
import useForestStore from '../../store/useForestStore';

const DaenamusMain = () => {
	const {
		reset,
		fetchFilteredForests,
		fetchForests,
		fetchPopularFilteredForests,
		fetchPopularForests,
	} = useForestStore();

	const isLoggedIn = useIsLoggedIn();
	const [selectedMBTI, setSelectedMBTI] = useState([]);

	const [selectedTab, setSelectedTab] = useState('전체글');

	const [isDataLoading, setIsDataLoading] = useState(false);
	const navigate = useNavigate();

	const fetchData = (page = 1) => {
		const mbtiFilter = selectedMBTI.join(',');
		if (selectedTab === '전체글') {
			if (selectedMBTI.length > 0) {
				fetchFilteredForests(mbtiFilter, page);
			} else {
				fetchForests(page);
			}
		} else if (selectedTab === '인기글') {
			if (selectedMBTI.length > 0) {
				fetchPopularFilteredForests(mbtiFilter, page);
			} else {
				fetchPopularForests(page);
			}
		}
	};

	useEffect(() => {
		fetchData();
		setIsDataLoading(true);
	}, []);

	useEffect(() => {
		fetchData();
	}, [selectedMBTI, selectedTab]);

	const select = (value) => {
		setSelectedMBTI([...selectedMBTI, value]);
	};

	const deselect = (value) => {
		setSelectedMBTI(selectedMBTI.filter((item) => item !== value));
	};

	const toggleMBTI = (value) => {
		if (selectedMBTI.includes(value)) {
			deselect(value);
		} else {
			select(value);
		}
	};

	const handleTabClick = (tab) => {
		setSelectedTab(tab);
		//tab이 인기글이라면 인기글 요청, 전체글(최신순)이라면 전체글 요청하는 API 연결
	};

	return (
		<>
			<div className="p-10 container mx-auto px-4">
				<div
					data-aos="fade-right"
					className="font-bold md:p-10 block bg-white rounded-lg "
				>
					<div className="flex justify-between items-center mb-4 text-2xl md:text-3xl font-semibold text-zinc-700">
						<div>대나무숲</div>
						<button
							onClick={
								isLoggedIn
									? () => {
											navigate('/daenamus/write');
											reset();
									  }
									: () => navigate('/login')
							}
							type="button"
							className="rounded-xl w-36 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-sm text-sm px-5 py-2.5 mr-2 mb-2"
						>
							글쓰기
						</button>
					</div>
					<div className="text-sm font-medium text-zinc-600">
						다양한 주제의 토론에 참가하고 다양한 유형의 사람들이 어떻게
						반응하는지 알아보아요.
					</div>
				</div>
				<div className="mt-8 mb-4">
					<Search endpoint="daenamus" />
				</div>

				<div className="mb-8 text-sm font-medium text-center text-gray-500 border-b border-gray-200">
					<ul className="flex flex-wrap -mb-px">
						{['전체글', '인기글'].map((tab) => (
							<li key={tab} className="mr-2">
								<button
									onClick={() => handleTabClick(tab)}
									className={`inline-block p-4 rounded-t-lg focus:outline-none ${
										selectedTab === tab
											? 'text-blue-600 border-b-2 border-blue-600'
											: 'hover:text-gray-600 hover:border-gray-300 '
									}`}
								>
									{tab}
								</button>
							</li>
						))}
					</ul>
				</div>
				<div>
					<div className="text-sm text-gray-500 my-2">작성자 유형별로 조회</div>
					{mbtiList.map((item, index) => {
						const isSelected = selectedMBTI.includes(item.value);

						return (
							<span
								key={index}
								onClick={() => toggleMBTI(item.value)}
								className={`leading-9 cursor-pointer border bg-white text-xs font-medium mr-2 pl-2 pr-1.5 py-0.5 rounded-full ${
									isSelected
										? 'border-blue-600 text-blue-600'
										: 'border-gray-400 text-gray-400'
								} ${isSelected ? 'dark:text-blue-300' : 'dark:text-gray-400'}`}
							>
								{item.label} {isSelected && <span>×</span>}
							</span>
						);
					})}
				</div>

				<DaenamuCardMap fetchData={fetchData} isDataLoading={isDataLoading} />
			</div>
		</>
	);
};

export default DaenamusMain;
