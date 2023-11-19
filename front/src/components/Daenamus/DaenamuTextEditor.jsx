import { useRef, useEffect, useMemo, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { postApi } from '../../services/api';
import useImageUpload from '../../hooks/useImageUpload';
import useForestStore from '../../store/useForestStore';
import { textToIcon, textToKorean } from '../Util/Util';
import './Modal.css';
const DaenamuTextEditor = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showEmojis, setShowEmojis] = useState(false);

	const emojis = ['📄', '🔜', '🖥️', '🔜', '😊'];
	const {
		title,
		content,
		mood,

		setTitle,
		setMood,

		setContent,
	} = useForestStore();

	const handleSubmit = async () => {
		try {
			const response = await postApi('forest/senti-predict', { content });

			setMood(response.data.mood);
		} catch (error) {
			console.log(error);
		}
	};

	const editorRef = useRef();

	const onChange = () => {
		const body = editorRef.current.getInstance().getHTML();
		setContent(body);
	};

	const { handleImageUpload, loading } = useImageUpload();

	useEffect(() => {
		if (isModalOpen) {
			setTimeout(() => {
				setIsModalOpen(false);
				handleSubmit();
			}, 3000);
		}
	}, [isModalOpen]);
	return (
		<>
			<h3 className="font-semibold">제목</h3>
			<input
				className="mb-12 mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				onChange={(e) => {
					setTitle(e.target.value);
				}}
				type="text"
				id="title"
				value={title}
				maxLength={50}
			/>

			<h3 className="font-semibold">본문</h3>
			<div className="text-editor">
				<div className="mt-3">
					<Editor
						initialValue={content}
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
				</div>

				{loading && <div>이미지 업로드 중...</div>}
				<div className="flex flex-col space-y-2">
					<div className="items-end justify-end flex flex-row space-x-2">
						{mood && (
							<div className="mb-2 text-sm md:text-lg">
								게시글 분석 결과 : {textToKorean[mood]}
								{textToIcon[mood]}
							</div>
						)}
						<div className="flex flex-col">
							<button
								onClick={() => {
									setIsModalOpen(true);
									setShowEmojis(true);
								}}
								disabled={content?.length <= 16}
								className="mt-3 w-40 bg-blue-400 disabled:bg-neutral-300 text-white font-medium rounded-md text-sm px-5 py-2.5 text-center"
							>
								감정 분석하기
							</button>
							{content?.length <= 16 && (
								<p className="text-right text-red-400 text-sm mb-2">
									10자 이상 입력해주세요.
								</p>
							)}

							{isModalOpen && (
								<div className="modal-overlay">
									<div className="modal-content">
										<div className="emoji-container">
											{emojis.map((emoji, index) => (
												<span key={index} className={`emoji delay-${index}`}>
													{emoji}
												</span>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DaenamuTextEditor;
