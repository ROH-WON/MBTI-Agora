import { useState } from 'react';
import { textToIcon, formatRelativeTime } from '../Util/Util';
import { useUserId } from '../../store/useUserStore';
import PropTypes from 'prop-types';

const CommentBox = ({ commentData, onDelete, onEdit }) => {
	// console.log(
	// 	'이미지소스',
	// 	commentData.writerId?.profileImg && commentData.writerId?.profileImg.path
	// 		? commentData.writerId?.profileImg.path
	// 		: commentData.writerId?.mbtiImg,
	// );
	const id = useUserId();
	const [editMode, setEditMode] = useState(false);
	const [editedComment, setEditedComment] = useState(commentData.comment);

	const handleEdit = async () => {
		try {
			setEditMode((prevEditMode) => !prevEditMode);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDelete = async () => {
		try {
			await onDelete(commentData._id);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSaveEdit = async () => {
		try {
			await onEdit(commentData._id, editedComment);
			setEditMode(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancelEdit = () => {
		setEditedComment(commentData.comment);
		setEditMode(false);
	};

	return (
		<article className="p-3 md:p-5 mb-6 text-sm bg-white rounded-lg">
			<footer className="flex justify-between mb-2">
				<div className="whitespace-nowrap space-x-2 items-center inline-flex mr-3 text-sm text-gray-900">
					<div className="hidden md:block relative">
						{' '}
						<img
							src={
								commentData.writerId?.profileImg &&
								commentData.writerId?.profileImg?.path
									? commentData.writerId?.profileImg?.path
									: commentData.writerId?.mbtiImg
							}
							className="w-11 h-11 rounded-full bg-white border"
						/>
						<p className="text-xl absolute top-5 left-6">
							{textToIcon[commentData.mood]}
						</p>
					</div>
					<div></div>
					<p className="font-gray-800">{commentData.writerId.nickname ? commentData.writerId.nickname : '알 수 없음'}</p>
					<p className="text-sm text-gray-600">{commentData.writerId.mbti}</p>
					<p className="text-xs text-gray-600">
						{formatRelativeTime(commentData.updatedAt)}
					</p>
				</div>

				{commentData.writerId?._id === id && (
					<div className="flex flex-col md:flex-row justify-end">
						{editMode ? (
							<>
								<button
									onClick={handleCancelEdit}
									type="button"
									className="whitespace-nowrap py-1 px-3 mr-2 mb-2 text-xs md:text-sm font-medium text-gray-900 focus:outline-none bg-red-300 rounded-full hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
								>
									취소
								</button>
								<button
									onClick={handleSaveEdit}
									type="button"
									className="whitespace-nowrap py-1 px-3 mr-2 mb-2 text-xs md:text-sm font-medium text-gray-900 focus:outline-none bg-blue-200 rounded-full hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
								>
									저장
								</button>
							</>
						) : (
							<>
								<button
									onClick={handleEdit}
									type="button"
									className="whitespace-nowrap py-1 px-3 mr-2 mb-2 text-xs md:text-sm font-medium text-gray-900 focus:outline-none bg-blue-200 rounded-full hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
								>
									수정
								</button>
								<button
									onClick={handleDelete}
									type="button"
									className="whitespace-nowrap py-1 px-3 mr-2 mb-2 text-xs md:text-sm font-medium text-gray-900 focus:outline-none bg-red-300 rounded-full hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
								>
									삭제
								</button>
							</>
						)}
					</div>
				)}
			</footer>
			{editMode ? (
				<input
					type="text"
					value={editedComment}
					onChange={(e) => {
						setEditedComment(e.target.value);
					}}
					className="w-full h-10 p-2 mt-2 text-base text-gray-900 placeholder-gray-500 border rounded-lg appearance-none focus:outline-none focus:ring focus:ring-blue-200"
				/>
			) : (
				<p className="text-sm md:text-md m-3 text-gray-500">
					{commentData.comment}
				</p>
			)}
		</article>
	);
};

CommentBox.propTypes = {
	commentData: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		mood: PropTypes.string.isRequired,
		comment: PropTypes.string.isRequired,
		updatedAt: PropTypes.string.isRequired,
	}).isRequired,

	onDelete: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
};

export default CommentBox;
