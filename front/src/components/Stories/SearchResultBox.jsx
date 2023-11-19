import PropTypes from 'prop-types';
import {
	removeTag,
	truncateString,
	colorQueryText,
	formatRelativeTime,
	textToKorean,
} from '../Util/Util';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SearchResultBox = ({ data, searchCategory }) => {
	if (searchCategory === 'forest') {
		searchCategory = 'daenamus';
	}
	const params = useParams();
	const { commentCount, content, createdAt, mood, title, userInfo, _id } = data;

	return (
		<>
			<div className="text-gray-500 dark:text-gray-400">
				<p className="mb-3 text-lg md:text-xl hover:underline">
					{' '}
					<Link to={`/${searchCategory}/${_id}`}>
						{colorQueryText({
							text: truncateString(removeTag(title), 30),
							query: params.searchQuery,
						})}
						{commentCount && commentCount > 0 ? (
							<span className="text-sm text-blue-700"> ({commentCount})</span>
						) : null}
					</Link>
				</p>
				<p className="my-3">
					{colorQueryText({
						text: truncateString(removeTag(content), 100),
						query: params.searchQuery,
					})}
				</p>
				<span>{userInfo ? userInfo.nickname : '알 수 없음'}</span> |{' '}
				<span>{formatRelativeTime(createdAt)}</span> |{' '}
				<span>{mood ? textToKorean[mood] : ''}</span>
				<hr className="my-5" />
			</div>
		</>
	);
};

SearchResultBox.propTypes = {
	data: PropTypes.shape({
		commentCount: PropTypes.number,
		content: PropTypes.string,
		createdAt: PropTypes.string,
		mood: PropTypes.string,
		title: PropTypes.string,
		userInfo: PropTypes.shape({
			nickname: PropTypes.string,
		}),
		_id: PropTypes.string,
	}),
	searchCategory: PropTypes.string,
};
export default SearchResultBox;
