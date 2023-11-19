import {
	textToIcon,
	textToColor,
	formatRelativeTime,
	textToKorean,
} from '../Util/Util';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import BackButton from '../Global/BackButton';
import { useNavigate, useParams } from 'react-router-dom';
import { delApi, getApi, putApi } from '../../services/api';
import { useEffect, useState } from 'react';
import { useUserId } from '../../store/useUserStore';
import { toast } from 'react-hot-toast';

import ReactionChart from './Reaction';
import DaenamuLikeSection from './DaenamuLikeSection';
import DaenamuTextEditor from './DaenamuTextEditor';
import useForestStore from '../../store/useForestStore';
import DaenamuComment from './DaenamuComment';

const DaenamuRead = () => {
	const { title, content, mood, setTitle, setContent, setMood, commentList } =
		useForestStore();
	const { forestId } = useParams();
	const [forest, setForest] = useState([]);
	const [isDataLoading, setIsDataLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [viewerKey, setViewerKey] = useState(0);
	const navigate = useNavigate();
	const id = useUserId();
	const fetchForest = async () => {
		try {
			const res = await getApi(`forest/${forestId}`);
			setForest(res.data);

			setIsDataLoading(true);
		} catch (error) {
			console.log(error);
		}
	};

	const handleConfirm = () => {
		toast((t) => (
			<div className="rounded p-4">
				<div>정말로 삭제하시겠습니까?</div>
				<div className="mt-3 flex justify-end">
					<button
						onClick={() => {
							handleDelete();
							toast.dismiss(t.id);
						}}
						className="text-white px-2 py-1 rounded mr-2 bg-green-500 hover:bg-green-600"
					>
						예
					</button>
					<button
						onClick={() => {
							toast.dismiss(t.id);
						}}
						className="text-white px-2 py-1 rounded bg-red-500 hover:bg-red-600"
					>
						아니오
					</button>
				</div>
			</div>
		));
	};

	const handleDelete = async () => {
		try {
			await delApi(`forest/${forestId}`);
			navigate('/daenamus');
		} catch (error) {
			console.log(error);
		}
	};

	const handleEdit = () => {
		setEditMode(true);
		setTitle(forest.title);
		setContent(forest.content);
		setMood('');
	};

	const handleCancelEdit = () => {
		setTitle(forest.title);
		setContent(forest.content);
		setMood('');
		setEditMode(false);
	};

	const handleSaveEdit = async () => {
		try {
			await putApi(`forest/${forestId}`, {
				title,
				content,
				mood,
			});
			fetchForest();

			setEditMode(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchForest();
	}, []);

	useEffect(() => {
		setViewerKey((prevKey) => prevKey + 1);
	}, [forest.content]);

	return (
		<div className={`w-4/5 max-w-2xl mx-auto `}>
			<BackButton />
			<div
				className={`w-full max-w-2xl border border-gray-400 rounded-lg shadow mx-auto bg-white pt-4 `}
				style={{
					backgroundColor: isDataLoading ? textToColor[forest.mood] : '#FFFFFF',
				}}
			>
				{' '}
				<div className="justify-end">
					{isDataLoading && forest.userInfo?._id == id && (
						<>
							{editMode ? (
								<div className="mr-4 mt-4 flex flex-row justify-end">
									<button
										onClick={handleCancelEdit}
										className="py-1 px-3 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-red-300 rounded-full  hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
									>
										취소
									</button>
									<button
										onClick={
											mood
												? () => handleSaveEdit()
												: () =>
														toast.error(
															'글 수정 후 감정분석을 마쳐야 저장할 수 있습니다.',
														)
										}
										className="disabled:bg-gray-100 py-1 px-3 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-blue-200 rounded-full hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
									>
										저장
									</button>
								</div>
							) : (
								<div className="mr-4 mt-4 flex flex-row justify-end">
									<button
										onClick={handleEdit}
										className="py-1 px-3 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-blue-200 rounded-full  hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
									>
										수정
									</button>
									<button
										onClick={handleConfirm}
										className="py-1 px-3 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-red-300 rounded-full  hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
									>
										삭제
									</button>
								</div>
							)}
						</>
					)}
				</div>
				<div className="relative top-0 md:px-10">
					{editMode ? (
						<DaenamuTextEditor />
					) : (
						<div className="view-mode">
							<div className="relative h-40 rounded-t-lg">
								<div className="flex flex-col absolute h-full w-full p-4">
									<div className="flex flex-row items-center">
										<div
											className="text-3xl mr-1"
											data-tooltip-id="tooltip"
											data-tooltip-content={
												isDataLoading
													? `AI가 분석한 주요감정 : ${
															textToKorean[forest.mood]
													  }`
													: ''
											}
										>
											{isDataLoading && textToIcon[forest.mood]}
										</div>
										<h5 className="py-2 leading-loose text-lg md:text-2xl font-bold">
											{forest.title}
										</h5>
									</div>

									<div className="w-full justify-between space-x-2 items-center inline-flex mr-3 text-sm text-gray-900 ">
										<div className="flex flex-row space-x-2 mt-5">
											<img
												className="rounded-full w-10 h-10 object-cover bg-white"
												src={
													isDataLoading && forest.userInfo?.profileImg
														? forest.userInfo?.profileImg?.path
														: isDataLoading && forest.userInfo?.mbtiImg
														? forest.userInfo?.mbtiImg
														: '/images/default-image.jpg'
												}
												alt=""
											/>
											<div className="flex flex-col ">
												<p className="w-20 text-sm ">
													{isDataLoading && forest.userInfo.nickname ? forest.userInfo.nickname : '알 수 없음' }
												</p>
												<p className="text-xs text-gray-500">
													{isDataLoading && forest.userInfo?.mbti}
												</p>
											</div>
										</div>
										<div className="justify-end flex flex-col">
											<p className="mb-1">
												조회{' '}
												<span className="text-blue-600 font-semibold">
													{isDataLoading && forest.views}
												</span>
											</p>
											<p className="self-end text-xs mb-1">
												{isDataLoading && formatRelativeTime(forest.updatedAt)}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div>
								<hr className="border-gray-300 my-3" />
								<div className="relative p-6 md:p-10">
									{isDataLoading && (
										<Viewer key={viewerKey} initialValue={forest.content} />
									)}
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="flex flex-col">
					<DaenamuLikeSection forestId={forest._id} userId={id} />
					<hr className="h-px bg-gray-300 border-0 mx-6" />
					{commentList && commentList.length > 0 ? (
						<div>
							<ReactionChart commentList={commentList} forestId={forestId} />
						</div>
					) : (
						<div></div>
					)}
					<hr className="h-px bg-gray-300 border-0 mx-6" />
					<div>
						<DaenamuComment forestId={forestId} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DaenamuRead;
