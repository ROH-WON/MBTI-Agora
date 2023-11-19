import PropTypes from 'prop-types';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { textToColor } from '../Util/Util';
import { removeTag, truncateString } from '../Util/Util';
import { Link } from 'react-router-dom';
const MyDaenamuCard = ({
	forest: { mood, title, content, _id, commentCount },
}) => {
	const moodColor = textToColor[mood];
	return (
		<div
			className="h-full block max-w-sm p-6 bg-white border border-gray-200 rounded-2xl hover:bg-gray-100"
			style={{ borderColor: moodColor }}
		>
			<Link to={`/daenamus/${_id}`}>
				<div className="flex flex-col h-full">
					<h5 className="mb-2 text-md font-bold tracking-tight text-gray-900">
						{truncateString(title, 50)}
						{commentCount ? (
							<span className="text-blue-600 text-sm"> ({commentCount})</span>
						) : (
							''
						)}
					</h5>
					<p className="text-sm font-normal text-gray-700 flex-grow">
						{truncateString(removeTag(content), 40)}
					</p>
					<div className="flex w-16 items-center text-xs font-medium text-center text-black focus:ring-4 focus:outline-none focus:ring-blue-300 mt-auto self-end pt-4">
						<ChevronRightIcon className="w-4 mt-1" />
						<span className="ml-1">더보기</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default MyDaenamuCard;
