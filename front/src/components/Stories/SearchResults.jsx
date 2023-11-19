import { useEffect, useState } from 'react';
import { getApi } from '../../services/api';
import { useParams, useLocation } from 'react-router-dom';
import Search from '../Global/Search';
import SearchResultBox from './SearchResultBox';
import Pagination from '../Global/Pagination';
import usePagination from '../../hooks/usePagination';

const SearchResults = () => {
	const searchQuery = useParams();
	let searchCategory = useLocation().pathname.split('/')[1];
	if (searchCategory === 'daenamus') {
		searchCategory = 'forest';
	}

	const [errorMessage, setErrorMessage] = useState('');
	const [results, setResults] = useState([]);
	const [isDataLoading, setIsDataLoading] = useState(false);
	const [totalPage, setTotalPage] = useState(0);

	const fetchData = async (searchWord, page = 1) => {
		try {
			const response = await getApi(
				`${searchCategory}?option=title_content&searchword=${
					searchWord || searchQuery.searchQuery
				}&page=${page}`,
			);
			setResults(response.data);
			setTotalPage(response.data.totalPage);

			setErrorMessage('');
			setIsDataLoading(true);
		} catch (err) {
			setErrorMessage(err.response.data.message);
			setResults([]);
		}
	};

	const { currentPage, prev, next, go } = usePagination(
		isDataLoading ? results : [],
		totalPage,
		{
			onChange: ({ targetPage }) =>
				fetchData(searchQuery.searchQuery, targetPage),
		},
	);

	useEffect(() => {
		fetchData(searchQuery.searchQuery, currentPage);
	}, [searchQuery, currentPage]);

	const handleSearch = (newSearchQuery) => {
		fetchData(newSearchQuery, 1);
	};

	const displayResult = () => {
		const resultsArray =
			searchCategory === 'stories' ? results.stories : results.forests;

		if (resultsArray && resultsArray.length > 0) {
			return resultsArray.map((result) => (
				<SearchResultBox
					key={result._id}
					data={result}
					searchCategory={searchCategory}
				/>
			));
		}
		return null;
	};

	return (
		<div className="text-gray-500 dark:text-gray-400">
			<Search
				endpoint={searchCategory === 'forest' ? 'daenamus' : 'stories'}
				onSearch={handleSearch}
			/>
			<h1 className="mt-10 mb-12 text-2xl">
				<span className="text-blue-600 font-semibold">
					{searchQuery.searchQuery}
				</span>{' '}
				에 대한 {searchCategory === 'forest' ? <>대나무숲</> : <>스토리</>} 검색
				결과{' '}
				<span className="text-lg">
					{results.totalCount ? results.totalCount : '0'}건
				</span>
			</h1>
			{displayResult()}
			<div className="flex justify-center mt-10">
				{errorMessage === '' && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPage}
						prev={prev}
						next={next}
						go={go}
					/>
				)}
			</div>
		</div>
	);
};

export default SearchResults;
