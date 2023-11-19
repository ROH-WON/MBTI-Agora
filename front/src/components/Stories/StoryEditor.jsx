import { useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import useStoryStore from '../../store/useStoryStore';
import { postApi } from '../../services/api';
import RadioOption from '../Global/RadioOption';
import useImageUpload from '../../hooks/useImageUpload';
import toast from 'react-hot-toast';

const StoryEditor = () => {
	const {
		title,
		content,
		stableThumbnail,

		setTitle,
		setMood,
		setMusic,
		setPhrase,
		setContent,
		setThumbnail,
		setLocalThumbnail,
		setStableThumbnail,
	} = useStoryStore();

	const [preview, setPreview] = useState('');
	const [selectedOption, setSelectedOption] = useState('');

	const handleThumbnailUpload = async (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		setLocalThumbnail(file);
		setPreview(URL.createObjectURL(file));
	};

	const recommend = async () => {
		try {
			const response = await postApi('stories/recommend', { content });

			setMood(response.data.mood);
			setMusic(response.data.music);
			setPhrase(response.data.phrase);
		} catch (error) {
			console.log(error.response.data.errorMessage);
		}
	};

	const generateImage = async () => {
		const body = editorRef.current?.getInstance().getHTML() || '';
		setContent(body);
		try {
			const response = await toast.promise(
				postApi('image/stable', { content }),
				{
					loading: <b>이미지를 생성하고 있습니다.</b>,
					success: <b>이미지 생성이 완료되었습니다.</b>,
					error: <b>이미지 생성에 실패하였습니다.</b>,
				},
			);

			setStableThumbnail(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const editorRef = useRef();
	const fileRef = useRef();

	const onChange = () => {
		const body = editorRef.current.getInstance().getHTML();
		setContent(body);
	};

	const { handleImageUpload, loading } = useImageUpload();

	return (
		<>
			<label className="block font-semibold text-gray-900 -mb-3">제목</label>
			<input
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				onChange={(e) => {
					setTitle(e.target.value);
				}}
				type="text"
				id="title"
				value={title}
				maxLength={50}
			/>

			<label className="block font-semibold text-gray-900">본문</label>

			<div>
				<Editor
					initialValue=" "
					placeholder="내용을 입력하세요."
					previewStyle="vertical"
					previewHighlight={false}
					height="400px"
					initialEditType="wysiwyg"
					language="ko-KR"
					toolbarItems={[
						// 툴바 옵션 설정
						['bold', 'italic', 'strike'],
						['hr', 'quote'],
						['ul', 'ol', 'task', 'indent', 'outdent'],
						['table', 'image', 'link'],
					]}
					ref={editorRef}
					onChange={onChange}
					hooks={{
						addImageBlobHook: handleImageUpload,
					}}
				/>
				<div className="justify-end">
					{content?.length <= 16 && (
						<div className="self-end text-right text-red-400 text-sm mt-2">
							<p>10자 이상 입력해주세요.</p>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-col space-y-2">
				<label className="block font-semibold text-gray-900">썸네일 선택</label>
				<div className="flex flex-row space-x-2 mb-5">
					<div className="w-1/2 px-3 pr-5 border-r">
						<h3 className="text-center mb-2 text-sm">
							{' '}
							<span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
								직접 업로드
							</span>
						</h3>

						<div className="h-1/5 items-end">
							<input
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5"
								id="file_input"
								type="file"
								ref={fileRef}
								onChange={handleThumbnailUpload}
							/>
						</div>
						{preview && (
							<div>
								<div>
									<div className="flex flex-row justify-between mb-2">
										<p className="text-sm text-gray-500">미리보기</p>
										<button
											onClick={() => {
												setPreview('');
												setLocalThumbnail('');
												setThumbnail('');
												fileRef.current.value = '';
											}}
											className="text-sm text-gray-500"
										>
											×
										</button>
									</div>
									<img
										className={`h-40 ${
											selectedOption === 'local-thumbnail'
												? 'border-2 border-blue-600 rounded'
												: ''
										}`}
										src={preview}
										alt="Selected Thumbnail"
									/>
								</div>
								<RadioOption
									id="local-thumbnail"
									value="local-thumbnail"
									name="hosting"
									label="직접 업로드한 이미지 선택"
									selectedOption={selectedOption}
									setSelectedOption={setSelectedOption}
								/>
							</div>
						)}
					</div>
					<div className="w-1/2 px-3">
						<h3 className="text-center mb-2 text-sm">
							{' '}
							<span className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
								AI로 이미지 생성
							</span>
						</h3>
						<div className="h-1/5 flex">
							<button
								onClick={generateImage}
								disabled={content?.length <= 16}
								className="w-full h-10 bg-blue-400 hover:bg-blue-700 disabled:bg-neutral-300 text-white font-medium rounded-full text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
							>
								이미지 생성하기
							</button>
						</div>
						{stableThumbnail && (
							<div>
								<div>
									<div className="flex flex-row justify-between mb-2">
										<p className="text-sm text-gray-500">미리보기</p>
										<button
											onClick={() => {
												setStableThumbnail('');
												setThumbnail('');
											}}
											className="text-sm text-gray-500"
										>
											×
										</button>
									</div>

									<img
										className={`h-full ${
											selectedOption === 'stable-thumbnail'
												? 'border-2 border-blue-600 rounded'
												: ''
										}`}
										src={stableThumbnail.path}
										alt="AI로 생성된 이미지"
									/>
								</div>
								<RadioOption
									id="stable-thumbnail"
									value="stable-thumbnail"
									name="hosting"
									label="AI로 생성된 이미지 선택"
									selectedOption={selectedOption}
									setSelectedOption={setSelectedOption}
								/>
							</div>
						)}
					</div>
				</div>
				{loading && <div>이미지 업로드 중...</div>}
				<label className="block font-semibold text-gray-900 pt-3">
					감정 분석
				</label>
				<div className="relative">
					<button
						onClick={recommend}
						disabled={content?.length <= 16}
						className="w-full h-10 bg-blue-400 hover:bg-blue-700 disabled:bg-neutral-300 text-white font-medium rounded-full text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
					>
						감정 분석하고 음악 추천받기
					</button>
				</div>
			</div>
		</>
	);
};

export default StoryEditor;
