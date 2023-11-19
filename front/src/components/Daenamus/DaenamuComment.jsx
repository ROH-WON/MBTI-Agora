import { useState, useEffect } from 'react';
import { postApi, getApi, delApi, putApi } from '../../services/api';
import CommentBox from '../Global/CommentBox';
import PropTypes from 'prop-types';
import usePagination from '../../hooks/usePagination';
import Pagination from '../Global/Pagination';
import toast from 'react-hot-toast';
import useForestStore from '../../store/useForestStore';

const DaenamuComment = ({ forestId }) => {
	const { commentList, setCommentList } = useForestStore();
	const [comment, setComment] = useState('');
	const [isDataLoading, setIsDataLoading] = useState(false);

	const [totalPage, setTotalPage] = useState(0);
	const [commentCount, setCommentCount] = useState(0);

	const fetchComment = async (page = 1) => {
		try {
			const res = await getApi(`forest/${forestId}/comments?page=${page}`);

			setCommentList(res.data.comments);
			setCommentCount(res.data.totalCommentsCount);
			setTotalPage(res.data.totalPage);
			setIsDataLoading(true);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchComment(currentPage);
	}, []);

	const { currentPage, prev, next, go } = usePagination(
		isDataLoading ? commentList : [],
		totalPage,
		{ onChange: ({ targetPage }) => fetchComment(targetPage) },
	);

	const deleteComment = async (commentId) => {
		try {
			await delApi(`forest/${forestId}/comments/${commentId}`);
			fetchComment();
		} catch (error) {
			console.log(error);
		}
	};

	const editComment = async (commentId, editedComment) => {
		try {
			await putApi(`forest/comments/${commentId}`, {
				updatedComment: editedComment,
			});
			fetchComment();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isDataLoading) {
			fetchComment(currentPage);
		}
	}, [currentPage]);

	const handleSubmit = async () => {
		try {
			await postApi(`forest/${forestId}/comments`, {
				comment,
			});

			setComment('');
			fetchComment();
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};
	return (
		<div className="p-6 flex flex-col">
			<h3 className="font-semibold">
				<span className="text-blue-600 text-2xl">{commentCount}</span> 개의 댓글
			</h3>
			<div className="flex flex-row space-x-2">
				<textarea
					className="p-3 my-5 w-[90%] border text-sm rounded-md"
					onChange={(e) => {
						setComment(e.target.value);
					}}
					id="comment"
					maxLength={200}
					value={comment}
					placeholder="댓글을 입력하세요."
				/>

				<button
					disabled={!comment}
					className="whitespace-nowrap h-16 w-[10%] my-5 text-sm font-medium text-gray-900 focus:outline-none bg-blue-500 disabled:bg-neutral-300 rounded-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200  "
					onClick={handleSubmit}
				>
					등록
				</button>
			</div>

			<div>
				{commentCount === 0 ? (
					<p className="text-center text-sm">등록된 댓글이 없습니다.</p>
				) : (
					commentList?.map((commentData) => (
						<div key={commentData._id}>
							<CommentBox
								commentData={commentData}
								onDelete={deleteComment}
								onEdit={editComment}
							/>
						</div>
					))
				)}
			</div>

			{commentCount !== 0 ? (
				<div className="flex justify-center mt-10">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPage}
						prev={prev}
						next={next}
						go={go}
					/>
				</div>
			) : null}
		</div>
	);
};

export default DaenamuComment;

DaenamuComment.propTypes = {
	forestId: PropTypes.string.isRequired,
};
