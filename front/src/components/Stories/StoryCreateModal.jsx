import moment from 'moment';
import StoryEditor from './StoryEditor';
import MusicVideo from './MusicVideo';

import useStoryStore from '../../store/useStoryStore';
import { useEffect, useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { postApi } from '../../services/api';
import './StoryCreateModal.css';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StoryCreateModal = ({ onClose }) => {
	const { title, content, thumbnail, mood, music, phrase } = useStoryStore();

	const [isPublic, setIsPublic] = useState(false);

	const dimmedRef = useRef(null);

	const navigate = useNavigate();

	useEffect(() => {
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	const currentDate = moment().format('YYYY년 M월 D일');

	const postStory = async () => {
		try {
			const post = { title, content, thumbnail, isPublic, mood, music };

			const formData = new FormData();
			for (const key in post) {
				formData.append(key, post[key]);
			}

			const res = await postApi('stories', formData);

			onClose();
			navigate(`/stories/${res.data._id}`);
		} catch (e) {
			console.error(e);
		}
	};
	const handleConfirm = () => {
		toast((t) => (
			<div className="rounded p-4">
				<div>
					📒스토리는 수정이 불가합니다.
					<br />
					등록하시겠습니까?
				</div>
				<div className="flex justify-end">
					<button
						onClick={() => {
							toast.dismiss(t.id);
							postStory();
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

	const isFormValid = useMemo(
		() => title && content && mood && music,
		[title, content, mood, music],
	);

	return (
		<div className="fixed inset-0 flex justify-center items-center">
			<div
				ref={dimmedRef}
				className={`fixed inset-0 flex justify-center z-50 backdrop-filter backdrop-blur `}
				onClick={(e) => {
					if (!e.target.closest('#staticModal')) {
						onClose();
					}
				}}
			>
				<div
					id="staticModal"
					data-modal-backdrop="static"
					tabIndex="-1"
					aria-hidden="true"
					className="relative w-full max-w-2xl p-4 overflow-x-hidden overflow-y-auto max-h-screen modal-content"
				>
					<div className="relative bg-white rounded-lg shadow">
						<div className="flex flex-col items-start justify-between p-4 border-b rounded-t">
							<h3 className="text-xl font-semibold text-gray-900">
								{currentDate}의 스토리 작성하기
							</h3>

							<button
								type="button"
								onClick={onClose}
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
								data-modal-hide="staticModal"
							>
								<svg
									className="w-3 h-3"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>

						<div className="flex flex-col p-6 space-y-6">
							<StoryEditor />

							<label className="self-end relative inline-flex items-center cursor-pointer">
								<input
									onChange={() => {
										setIsPublic(!isPublic);
									}}
									type="checkbox"
									value={isPublic}
									className="sr-only peer"
								/>
								<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
								<span className="ml-3 text-sm font-medium text-gray-900">
									공개 스토리
								</span>
							</label>
						</div>

						{music && (
							<div className="px-3 border-t border-gray-200">
								<MusicVideo music={music} phrase={phrase} mood={mood} />
							</div>
						)}

						<div className="flex-row p-6 border-t border-gray-200 rounded-b">
							<div className="flex flex-col">
								<div className="justify-end flex flex-row">
									{!isFormValid && (
										<div className="mr-3 items-center">
											<p className="self-end text-red-500 text-sm mt-2">
												글 작성 후 감정분석이 완료되어야 업로드가 가능합니다.
											</p>
										</div>
									)}
									<button
										disabled={!isFormValid}
										onClick={handleConfirm}
										type="button"
										className="bg-blue-700 disabled:bg-neutral-300 text-white font-medium rounded-md text-sm px-5 py-2.5 text-center"
									>
										작성 완료
									</button>
									<button
										onClick={onClose}
										data-modal-hide="staticModal"
										type="button"
										className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
									>
										닫기
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

StoryCreateModal.propTypes = {
	onClose: PropTypes.func.isRequired,
};

export default StoryCreateModal;
