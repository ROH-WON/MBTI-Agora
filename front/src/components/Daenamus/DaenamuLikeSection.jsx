import { useEffect, useState } from 'react';
import {
	HandThumbDownIcon,
	HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { postApi, delApi, getApi } from '../../services/api';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
const LIKE_TYPES = {
	LIKED: 'liked',
	DISLIKED: 'disliked',
	NONE: 'none',
};

const DaenamuLikeSection = ({ forestId, userId }) => {
	const [likeType, setLikeType] = useState(LIKE_TYPES.NONE);
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);

	useEffect(() => {
		const fetchLike = async () => {
			const [likes, dislikes] = await Promise.all([
				getApi(`forest/${forestId}/getLikes`),
				getApi(`forest/${forestId}/getDislikes`),
			]);
			setLikes(likes.data.likes.length);
			setDislikes(dislikes.data.dislikes.length);

			const userLikedHistory = likes.data.likes.some(
				(like) => like.userId === userId,
			);
			if (userLikedHistory) {
				setLikeType(LIKE_TYPES.LIKED);
			}

			const userDislikedHistory = dislikes.data.dislikes.some(
				(dislike) => dislike.userId === userId,
			);
			if (userDislikedHistory) {
				setLikeType(LIKE_TYPES.DISLIKED);
			}
		};

		if (forestId) {
			fetchLike();
		}
	}, [forestId]);

	const toggleLike = async (type) => {
		try {
			let upUrl, unUrl;
			let updateFunc, updateCount, oppositeTypeCount;

			if (type === LIKE_TYPES.LIKED) {
				upUrl = `forest/${forestId}/upLike`;
				unUrl = `forest/${forestId}/unLike`;
				updateFunc = setLikes;
				updateCount = likeType === type ? likes - 1 : likes + 1;
				oppositeTypeCount = setDislikes;
			} else {
				upUrl = `forest/${forestId}/upDislike`;
				unUrl = `forest/${forestId}/unDislike`;
				updateFunc = setDislikes;
				updateCount = likeType === type ? dislikes - 1 : dislikes + 1;
				oppositeTypeCount = setLikes;
			}

			const response = await (likeType === type
				? delApi(unUrl)
				: postApi(upUrl, {}));

			if (response.error) {
				toast.error(response.error.response.data.message);
			} else {
				updateFunc(updateCount);
			}

			if (likeType === LIKE_TYPES.NONE) {
				oppositeTypeCount(type === LIKE_TYPES.LIKED ? dislikes : likes);
			} else if (likeType !== type) {
				const target = type === LIKE_TYPES.LIKED ? dislikes : likes;
				if (target > 0) {
					type === LIKE_TYPES.LIKED
						? setDislikes(target - 1)
						: setLikes(target - 1);
				}
			}

			setLikeType(likeType === type ? LIKE_TYPES.NONE : type);
			const likeToast =
				type === LIKE_TYPES.LIKED
					? likeType === type
						? '좋아요를 취소했습니다.'
						: '좋아요를 선택했습니다.'
					: likeType === type
					? '싫어요를 취소했습니다.'
					: '싫어요를 선택했습니다.';
			toast(likeToast);
		} catch (err) {
			toast.error(err.response.data.message);
		}
	};

	return (
		<>
			<div className="text-gray-700 m-5 mb-12 flex flex-row justify-center space-x-2 p-5 md:mx-52">
				<div className="flex items-center">
					<span className="mr-3 font-bold">{likes}</span>
					<HandThumbUpIcon
						className={`cursor-pointer w-7 h-7 ${
							likeType === LIKE_TYPES.LIKED ? 'text-blue-500' : 'text-gray-400'
						}`}
						onClick={() => toggleLike(LIKE_TYPES.LIKED)}
					/>
				</div>
				<div className="pl-6 flex items-center">
					<HandThumbDownIcon
						className={`cursor-pointer w-7 h-7 ${
							likeType === LIKE_TYPES.DISLIKED
								? 'text-red-500'
								: 'text-gray-400'
						}`}
						onClick={() => toggleLike(LIKE_TYPES.DISLIKED)}
					/>
					<span className="ml-3 font-bold">{dislikes}</span>
				</div>
			</div>
		</>
	);
};

DaenamuLikeSection.propTypes = {
	forestId: PropTypes.string,
	userId: PropTypes.string,
};

export default DaenamuLikeSection;
