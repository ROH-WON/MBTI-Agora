import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import {
	EyeIcon,
	ChatBubbleLeftEllipsisIcon,
	HandThumbDownIcon,
	HandThumbUpIcon,
} from '@heroicons/react/24/outline';

import {
	textToIcon,
	textToBorderColor,
	truncateString,
	formatRelativeTime,
	removeTag,
} from '../Util/Util';

const DaenamuCard = ({
	data: {
		content,
		updatedAt,
		mood,
		title,
		_id,
		views,
		commentCount,
		likeCount,
		dislikeCount,
		userInfo,
	},
}) => {
	return (
		<div className="rounded-xl h-full">
			<Link to={`/daenamus/${_id}`}>
				<div
					className={`h-full flex flex-col max-w-sm p-4 lg:p-6 ${textToBorderColor[mood]} border-[0.2rem] rounded-lg `}
				>
					<span className="-ml-3 text-6xl">{textToIcon[mood]}</span>

					<h5 className="mt-5 mb-2 text-xl font-semibold tracking-tight text-gray-900 ">
						{truncateString(title, 50)}
					</h5>

					<p className="mb-3 h-full font-normal text-gray-600  text-sm">
						{truncateString(removeTag(content), 63)}
					</p>
					<div className="text-sm text-gray-600 mb-5 mt-3">
						{userInfo ? userInfo.nickname : '알 수 없음'}
						<span className="text-xs ml-2">
							{formatRelativeTime(updatedAt)}
						</span>
					</div>

					<div className=" text-gray-600 w-full flex justify-between text-sm font-medium text-center text-black focus:ring-4 focus:outline-none focus:ring-blue-300 ">
						<div className="flex flex-row items-center">
							<ChevronRightIcon className="w-3 mt-1 " />
							<span>더보기</span>
						</div>
						<div className="items-center flex flex-row space-x-2">
							<EyeIcon className="w-4 mt-1" />
							<p>{views}</p>
							<HandThumbUpIcon className="w-4 mt-1" />
							<p>{likeCount}</p>
							<HandThumbDownIcon className="w-4 mt-1" />
							<p>{dislikeCount}</p>
							<ChatBubbleLeftEllipsisIcon className="w-4 mt-1" />
							<p>{commentCount}</p>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default DaenamuCard;
