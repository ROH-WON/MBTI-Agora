import { textToIcon, textToColor, formatDate } from '../Util/Util';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import { useNavigate, useParams } from 'react-router-dom';
import { delApi, getApi } from '../../services/api';
import { useEffect, useState } from 'react';
import { useUserId } from '../../store/useUserStore';
import StoryComment from './StoryComment';
import BackButton from '../Global/BackButton';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import MusicVideo from './MusicVideo';

const StoryRead = () => {
	const { storyId } = useParams();
	const [story, setStory] = useState([]);
	const [isDataLoading, setIsDataLoading] = useState(false);
	const [isPublicStory, setIsPublicStory] = useState(true);

	const navigate = useNavigate();

	const id = useUserId();
	const fetchStory = async () => {
		try {
			const res = await getApi(`stories/${storyId}`);

			setStory(res.data);
			setIsDataLoading(true);
			setIsPublicStory(res.data.userInfo?._id === id || res.data.isPublic);
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
							// 필요한 후속 동작 수행
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
			await delApi(`stories/${storyId}`);
			navigate(-1);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchStory();
	}, []);

	const [showMusicVideo, setShowMusicVideo] = useState(false);

	const handleMusicClick = () => {
		setShowMusicVideo(!showMusicVideo);
	};

	return (
		<div className={`w-4/5 max-w-2xl mx-auto dark:bg-gray-800`}>
			<BackButton />
			{!isPublicStory ? (
				<div
					className={`flex items-center w-full h-80 max-w-2xl border border-gray-200 rounded-lg shadow mx-auto bg-white dark:bg-gray-800`}
					style={{
						backgroundColor: isDataLoading
							? textToColor[story.mood]
							: '#FFFFFF',
					}}
				>
					<p className="p-10">비공개 글입니다.</p>
				</div>
			) : (
				<div
					className={`w-full max-w-2xl border border-gray-200 rounded-lg shadow mx-auto bg-white dark:bg-gray-800`}
					style={{
						backgroundColor: isDataLoading
							? textToColor[story.mood]
							: '#FFFFFF',
					}}
				>
					<div className="relative h-52 overflow-hidden rounded-t-lg">
						<img
							className="w-full h-full object-cover"
							src={
								story.thumbnail
									? `${story.thumbnail.path}`
									: '/images/default-image.jpg'
							}
							alt=""
						/>
						<div className="absolute inset-0 bg-black opacity-50"></div>

						<div className="ms-4 mt-4 absolute top-1 left-1 p-4 z-10 max-w-md">
							<p className="text-white mb-1">
								{isDataLoading && formatDate(story.createdAt)}
							</p>
							<h5 className="leading-loose text-white text-2xl font-bold">
								{story.title}
							</h5>
						</div>
						<div className="text-sm text-end absolute top-1 right-1 mt-4 me-4">
							<p className="text-white mb-1">
								{isDataLoading && story.isPublic && <>조회 {story.views}</>}
								{isDataLoading && !story.isPublic && (
									<LockClosedIcon
										data-tooltip-id="tooltip"
										data-tooltip-content="나만 볼 수 있는 스토리입니다."
										className="w-4 inline mb-0.5"
									/>
								)}
							</p>
							{isDataLoading && story.userInfo?._id == id && (
								<>
									<button
										onClick={handleConfirm}
										className="py-1 px-3 mt-2 text-sm font-medium text-gray-900 focus:outline-none bg-red-300 rounded-full  hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
									>
										삭제
									</button>
								</>
							)}
						</div>
					</div>

					<div className="flex flex-col">
						<div className="relative -top-16 left-6 max-w-md">
							<div className="text-7xl md:text-9xl">
								{isDataLoading && textToIcon[story.mood]}
							</div>
						</div>

						<div className="relative -top-20 p-6 md:p-10 my-8">
							{isDataLoading && <Viewer initialValue={story.content} />}
						</div>

						<div>
							<div className="w-12 h-12 mx-auto -mt-24 rounded-full overflow-hidden">
								<img
									className="w-full h-full object-cover bg-white"
									src={
										isDataLoading && story.userInfo?.profileImg
											? story.userInfo?.profileImg?.path
											: isDataLoading && story.userInfo?.mbtiImg
											? story.userInfo?.mbtiImg
											: '/images/default-image.jpg'
									}
									alt="작성자 프로필 이미지"
								/>
							</div>
							<h5 className="text-center text-gray-700 mx-auto mt-2">
								{isDataLoading && story.userInfo.nickname ? story.userInfo.nickname : '알 수 없음'}
							</h5>
							<p className="text-gray-400 text-xs text-center mt-1 mb-5">
								{isDataLoading && story.userInfo?.mbti}
							</p>
						</div>
						<hr className="h-px bg-gray-300 border-0 dark:bg-gray-700 mx-6" />
						<button onClick={handleMusicClick} className="w-full">
							<div className="p-5 flex flex-row">
								<img className="w-10 " src="/images/MusicIcon2.png" />
								<p className="rounded-lg p-2 bg-white ml-2 mt-2">▶️ BGM ON</p>
							</div>
						</button>
						{showMusicVideo && <MusicVideo music={story.music} />}

						<hr className="h-px bg-gray-300 border-0 dark:bg-gray-700 mx-6" />
						<div>
							<StoryComment storyId={storyId} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default StoryRead;
