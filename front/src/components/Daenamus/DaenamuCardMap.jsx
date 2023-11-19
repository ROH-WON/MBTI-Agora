import { useEffect } from 'react';
import PropTypes from 'prop-types';
import usePagination from '../../hooks/usePagination';
import DaenamuCard from '../Global/DaenamuCard';
import Pagination from '../Global/Pagination';

import useForestStore from '../../store/useForestStore';

const DaenamuCardMap = ({ fetchData, isDataLoading }) => {
	const { forests, totalPage } = useForestStore();
	const { currentPage, prev, next, go } = usePagination(
		isDataLoading ? forests : [],
		totalPage,
		{ onChange: ({ targetPage }) => fetchData(targetPage) },
	);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		fetchData(currentPage);
	}, [currentPage]);

	return (
		<>
			<div className="font-bold mb-8 md:p-10 block bg-white rounded-lg ">
				{isDataLoading ? (
					<>
						{forests && forests.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 text-base font-medium">
								{forests?.map((forest) => (
									<div key={forest._id}>
										<DaenamuCard data={forest} />
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
			</div>

			<div className="flex justify-center mt-10">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPage}
					prev={prev}
					next={next}
					go={go}
				/>
			</div>
		</>
	);
};

DaenamuCardMap.propTypes = {
	fetchData: PropTypes.func.isRequired,
	isDataLoading: PropTypes.bool.isRequired,
};

export default DaenamuCardMap;
