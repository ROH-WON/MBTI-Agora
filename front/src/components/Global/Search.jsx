import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Search = ({ endpoint, onSearch }) => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const handleSubmit = async (event) => {
		event.preventDefault();
		navigate(`/${endpoint}/search/${searchQuery}`);
	};

	const handleSearchClick = () => {
		onSearch && onSearch(searchQuery);
	};

	const isSearchQueryValid = () => {
		const validation =
			searchQuery !== '' && searchQuery.trim() !== '' && searchQuery !== '.';
		return validation;
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label
					htmlFor="default-search"
					className="mb-2 text-sm font-medium text-gray-900 sr-only"
				>
					Search
				</label>
				<div className="flex justify-center">
					<div className="relative w-3/4 max-w-3xl">
						<div className="absolute inset-y-0 left-3 flex items-center pl-3 pointer-events-none">
							<svg
								className="w-4 h-4 text-gray-500"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
								/>
							</svg>
						</div>
						<input
							type="search"
							id="default-search"
							className="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
							placeholder="검색어를 입력하세요."
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
						/>
						<button
							onClick={handleSearchClick}
							disabled={!isSearchQueryValid()}
							type="submit"
							className="text-white absolute right-2.5 bottom-2.5 bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2"
						>
							검색
						</button>
					</div>
				</div>
			</form>
		</>
	);
};

Search.propTypes = {
	onSearch: PropTypes.func,
	onSearchClick: PropTypes.func,
};
export default Search;
