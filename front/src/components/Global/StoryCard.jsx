/* eslint-disable react/prop-types */
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import {
	EyeIcon,
	ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { truncateString, removeTag } from '../Util/Util';
import { textToIcon, formatRelativeTime } from '../Util/Util';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const StoryCard = ({
	data: {
		content,
		createdAt,
		mood,
		thumbnail,
		isPublic,
		title,
		_id,
		userInfo,
		views,
		commentCount,
	},
}) => {
	const moodIcon = textToIcon[mood.toLowerCase()] || '❓'; // fallback to question mark for unknown text

	const imageSrc = thumbnail ? `${thumbnail.path}` : '';

	return (
		<>
			<div
				className={`bg-[#ECF2FF] border border-[0.1rem] border-neutral-200 border-solid rounded-2xl pt-5 px-5 pb-6 my-3 mx-2 relative h-full`}
			>
				<Link to={`/stories/${_id}`}>
					<div className="flex items-center justify-center">
						<figure className="max-w-lg w-[21rem] h-[12rem] overflow-hidden">
							<img
								className="w-full h-full object-cover object-center rounded-2xl"
								src={imageSrc}
								alt="스토리 이미지"
								onError={(e) => {
									e.target.src = '/images/default-image.jpg';
								}}
							/>
						</figure>
						<span className="absolute top-36 right-2 text-8xl">{moodIcon}</span>
					</div>

					<div className="h-[55%] pl-2 pt-10 flex flex-col justify-between">
						<div>
							<h5 className="mt-2 mb-2 text-xl font-bold tracking-tight text-gray-900">
								{truncateString(title, 32)}
								{!isPublic ? (
									<LockClosedIcon
										data-tooltip-id="tooltip"
										data-tooltip-content="나만 볼 수 있는 스토리입니다."
										className="ml-1 w-4 inline mb-0.5"
									/>
								) : (
									''
								)}
							</h5>
							<div className="text-sm text-gray-500">
								{userInfo ? userInfo.nickname : '알 수 없음'}
								<span className="text-xs ml-2">
									{formatRelativeTime(createdAt)}
								</span>
							</div>
							<p className="text-sm my-3 font-normal text-gray-700">
								{truncateString(removeTag(content), 100)}
							</p>
						</div>

						<div className="space-y-2 mt-8">
							<div className="whitespace-nowrap w-full bottom-8 flex justify-between text-sm font-medium text-center text-black focus:ring-4 focus:outline-none focus:ring-blue-300">
								<div className="flex items-center">
									<ChevronRightIcon className="w-4 mt-1" />
									<span className="ml-1">더보기</span>
								</div>
								<div className="flex flex-row space-x-2">
									<EyeIcon className="w-4 mt-1" />
									<p>{views}</p>
									<ChatBubbleLeftEllipsisIcon className="w-4 mt-1" />
									<p>{commentCount}</p>
								</div>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</>
	);
};

export default StoryCard;
