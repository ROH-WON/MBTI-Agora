import Pagination from '../Global/Pagination';
import usePagination from '../../hooks/usePagination';
import { getApi } from '../../services/api';
import { useState, useEffect } from 'react';
import { formatCreatedAt } from '../Util/Util';
import { Link } from 'react-router-dom';

const MyComments = () => {
	const [comments, setComments] = useState([]);
	const [isDataLoading, setIsDataLoading] = useState(false);
	const [totalPage, setTotalPage] = useState(0);
	const [commentCount, setCommentCount] = useState(0);

	const fetchComments = async (page = 1) => {
		try {
			const res = await getApi(`my/allComments?page=${page}`);
			setComments(res.data.myComments);
			setCommentCount(res.data.totalCommentsCount);
			setTotalPage(res.data.totalPage);
			setIsDataLoading(true);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchComments(currentPage);
	}, []);

	const { currentPage, prev, next, go } = usePagination(
		isDataLoading ? comments : [],
		totalPage,
		{ onChange: ({ targetPage }) => fetchComments(targetPage) },
	);

	useEffect(() => {
		if (isDataLoading) {
			fetchComments(currentPage);
		}
	}, [currentPage]);

	return (
		<div>
			<h3 className="text-2xl text-gray-700 font-semibold">내가 쓴 댓글</h3>
			<div className="mt-1">
				총 <span className="text-blue-600 font-semibold">{commentCount}</span>{' '}
				건
			</div>
			<div className="text-base mt-4 mb-4 text-gray-700">
				스토리와 대나무숲에 단 댓글 모두를 확인할 수 있어요.
			</div>

			<div className="flex justify-center mt-10">
				{comments.length > 0 ? (
					<ul className="w-full max-w-6xl text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200">
						{comments.map((comment, index) => (
							<li
								key={index}
								className="text-gray-700 w-full px-6 py-3 border-b border-gray-200 bg-slate-100"
							>
								<span className="font-bold text-gray-900">댓글</span>{' '}
								{comment.comment}{' '}
								<span className="text-xs text-gray-400">
									{formatCreatedAt(comment.createdAt)}
								</span>
								<div className="mt-2" />
								<span className="font-bold text-gray-900">본문</span>{' '}
								<div className="underline underline-offset-2 text-blue-900 inline">
									<Link
										to={
											comment.forestId
												? `/daenamus/${
														comment.forestId ? comment.forestId._id : ''
												  }`
												: `/stories/${
														comment.storyId ? comment.storyId._id : ''
												  }`
										}
									>
										{comment.forestId
											? comment.forestId
												? comment.forestId.title
												: '삭제된 글입니다.'
											: comment.storyId
											? comment.storyId.title
											: '삭제된 글입니다.'}
									</Link>
								</div>
							</li>
						))}
					</ul>
				) : null}
			</div>
			{comments.length > 0 ? (
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

export default MyComments;
