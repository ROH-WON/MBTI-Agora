import { useState, useEffect } from 'react';
import usePagination from '../../hooks/usePagination';
import StoryCard from './StoryCard';
import Pagination from './Pagination';
import { getApi } from '../../services/api';
import PropTypes from 'prop-types';

const StoryCardMap = ({ endpoint }) => {
	const [stories, setStories] = useState([]);
	const [isDataLoading, setIsDataLoading] = useState(false);
	const [totalPage, setTotalPage] = useState(0);
	const fetchStories = async (page = 1) => {
		try {
			const response = await getApi(`${endpoint}?page=${page}`);
			setStories(response.data.stories);
			setTotalPage(response.data.totalPage);
			setIsDataLoading(true);
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	};

	const { currentPage, prev, next, go } = usePagination(
		isDataLoading ? stories : [],
		totalPage,
		{ onChange: ({ targetPage }) => fetchStories(targetPage) },
	);

	useEffect(() => {
		fetchStories(currentPage);
	}, [currentPage]);

	return (
		<>
			<div className="font-bold mb-8 md:p-10 block bg-white rounded-lg ">
				{isDataLoading ? (
					<>
						{stories && stories.length > 0 ? ( // Check if stories is not empty
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 text-base font-medium">
								{stories?.map((story) => (
									<div key={story._id}>
										<StoryCard data={story} />
									</div>
								))}
							</div>
						) : (
							<div className="h-44 text-center">등록된 게시글이 없습니다.</div> // Display this message when stories is empty
						)}
					</>
				) : (
					<div>Loading...</div>
				)}
				<div className="flex justify-center mt-20">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPage}
						prev={prev}
						next={next}
						go={go}
					/>
				</div>
			</div>
		</>
	);
};

StoryCardMap.propTypes = {
	endpoint: PropTypes.string.isRequired, // endpoint는 문자열이고 필수
};

export default StoryCardMap;
