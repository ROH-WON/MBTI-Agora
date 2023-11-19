import { useState, useEffect } from 'react';
import useUserStore, { useUserActions } from '../../store/useUserStore';
import PropTypes from 'prop-types';
import { putApi } from '../../services/api';
import toast from 'react-hot-toast';

const ProfileImgUploadModal = ({ isVisible, closeModal }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const { setProfileImg } = useUserStore();
	const [preview, setPreview] = useState('');
	const { infoChange } = useUserActions();

	const handleImgUpload = async (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		setSelectedFile(file);
		setPreview(URL.createObjectURL(file));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (selectedFile) {
			setProfileImg(selectedFile);
		} else {
			console.log('No file selected');
		}

		const formData = new FormData();
		formData.append('profileImg', selectedFile);

		try {
			const res = await putApi(`auth/update`, formData);
			if (res.status === 200) {
				toast.success('프로필 사진을 수정하였습니다.');
				setProfileImg(res.data.profileImg?.path);
				infoChange({ profileImg: res.data.profileImg?.path, mbtiImg: null });
				closeModal();
			} else {
				toast.error('프로필 사진 수정에 실패했습니다.');
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (!isVisible) {
			setSelectedFile(null);
			setPreview('');
		}
	}, [isVisible]);

	return (
		<div className={`${isVisible ? 'block' : 'hidden'}`}>
			<div
				className={`${
					isVisible ? 'block' : 'hidden'
				} fixed inset-0 bg-gray-600 opacity-70 z-20`}
				onClick={closeModal}
			></div>
			<div
				id="small-modal"
				tabIndex="-1"
				className="fixed inset-0 z-30 flex items-center justify-center"
			>
				<div className="w-full max-w-md p-4 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
					<div className="bg-white rounded-lg shadow dark:bg-gray-700">
						<div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">
								프로필 이미지 직접 업로드
							</h3>
							<button
								type="button"
								onClick={closeModal}
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
								data-modal-hide="small-modal"
							>
								×
							</button>
						</div>

						<div className="p-4">
							<div className="flex items-center justify-center w-full">
								<label
									htmlFor="dropzone-file"
									className="flex flex-col items-center justify-center w-full h-26 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<svg
											className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 20 16"
										>
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
											/>
										</svg>
										<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
											클릭하거나 파일을 드래그 앤 드롭해주세요.
										</p>
									</div>
									<input
										id="dropzone-file"
										type="file"
										className="hidden"
										onChange={handleImgUpload}
									/>
								</label>
							</div>
							{preview && (
								<>
									<p className="mt-5 text-sm text-gray-500">미리 보기:</p>
									<img
										className="max-w-xs"
										src={preview}
										alt="Selected Thumbnail"
									/>
								</>
							)}
						</div>
						<div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
							<button
								data-modal-hide="small-modal"
								type="button"
								className="text-white bg-blue-700 disabled:bg-gray-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								onClick={handleSubmit}
								disabled={!selectedFile}
							>
								수정하기
							</button>
							<button
								data-modal-hide="small-modal"
								type="button"
								className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-sm border border-gray-200 text-sm font-medium px-5 py-2 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
								onClick={closeModal}
							>
								취소
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

ProfileImgUploadModal.propTypes = {
	isVisible: PropTypes.bool,
	closeModal: PropTypes.func,
};

export default ProfileImgUploadModal;
