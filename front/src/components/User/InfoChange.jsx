import { useCallback, useMemo, useState, useEffect } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

import {
	mbtiList,
	defaultUser,
	passwordRegex,
	nicknameRegex,
} from '../Util/Util';
import { getApi, putApi } from '../../services/api';
import Select from 'react-select';
import useUserStore, { useUserActions } from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProfilePicker from '../User/ProfilePicker';
import ProfileImgUploadModal from './ProfileImgUploadModal';

const InfoChange = () => {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const { logout, infoChange } = useUserActions();
	const {
		id,
		email,
		nickname,
		mbti,
		isGoogleLogin,
		profileImg,
		mbtiImg,
		tempMbtiImg,

		setNickname,
		setMbti,
		setProfileImg,
		setMbtiImg,
		setTempMbtiImg,
	} = useUserStore();

	const [preview, setPreview] = useState(profileImg ? profileImg : mbtiImg);
	const [passwordToChange, setPasswordToChange] = useState('');
	const [nicknameToChange, setNicknameToChange] = useState(nickname);
	const [mbtiToChange, setMbtiToChange] = useState(
		mbtiList.find((item) => item.value === mbti),
	);
	const [profileImgToChange, setProfileImgToChange] = useState(
		profileImg || defaultUser,
	);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [nicknameCheck, setNicknameCheck] = useState(true);

	const isPasswordValid = useMemo(() => {
		return passwordToChange ? passwordRegex.test(passwordToChange) : true;
	}, [passwordToChange]);

	const isNicknameValid = useMemo(() => {
		return nicknameRegex.test(nicknameToChange);
	}, [nicknameToChange]);
	const isPasswordSame = useMemo(
		() => passwordToChange == confirmPassword,

		[passwordToChange, confirmPassword],
	);

	const isFormValid = useMemo(
		() =>
			isPasswordValid &&
			isPasswordSame &&
			isNicknameValid &&
			nicknameCheck &&
			Boolean(mbti),
		[isPasswordValid, isPasswordSame, isNicknameValid, nicknameCheck, mbti],
	);

	const handleChangeInput = useCallback(({ target }) => {
		const { name, value } = target;
		switch (name) {
			case 'password':
				setPasswordToChange(value);
				break;
			case 'nickname':
				setNicknameToChange(value);
				setNicknameCheck(false);
				break;
			case 'confirmPassword':
				setConfirmPassword(value);
				break;
		}
	}, []);

	const handleMbtiChange = (selectedOption) => {
		setMbtiToChange(selectedOption);
		setMbti(selectedOption.value);
	};

	const handleNicknameCheck = useCallback(async () => {
		try {
			const response = await getApi(
				`auth/checkNickname?nickname=${nicknameToChange}`,
			);

			if (response.data.nicknameState == 'usableNickname') {
				toast.success(response.data.usableNickname);
				setNicknameCheck(true);
			}
			if (response.data.nicknameState == 'unusableNickname') {
				toast.error(response.data.unusableNickname);
				setNicknameCheck(false);
			}
		} catch (error) {
			console.log(error.response.data.message);
		}
	}, [nicknameToChange]);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			const toUpdate = {
				email,
				...(passwordToChange !== '' && { password: passwordToChange }),
				profileImg: tempMbtiImg ? null : profileImgToChange,
				mbtiImg: tempMbtiImg,
				nickname: nicknameToChange,
				mbti: mbtiToChange.value,
				isGoogleLogin: isGoogleLogin,
			};
			const formData = new FormData();
			for (const key in toUpdate) {
				formData.append(key, toUpdate[key]);
			}

			try {
				const res = await putApi(`auth/update`, formData);
				if (res.status === 200) {
					toast.success('정보를 수정하였습니다.');
					setNickname(toUpdate.nickname);
					setMbti(toUpdate.mbti);
					setProfileImg(res.data.profileImg);
					setMbtiImg(res.data.mbtiImg);
					infoChange(toUpdate);
				} else {
					toast.error('정보 수정에 실패하였습니다.');
				}
			} catch (err) {
				console.log(err);
			}
		},
		[
			email,
			id,
			mbtiToChange,
			nicknameToChange,
			passwordToChange,
			profileImgToChange,
			tempMbtiImg,
		],
	);

	const handleConfirm = () => {
		toast((t) => (
			<div className="rounded p-8">
				<div>정말로 탈퇴하시겠습니까?</div>
				<div className="mt-5 flex justify-center">
					<button
						onClick={() => {
							handleOut();
							toast.dismiss(t.id);
						}}
						className="text-white w-16 px-2 py-1 rounded mr-2 bg-green-500 hover:bg-green-600 text-sm"
					>
						예
					</button>
					<button
						onClick={() => {
							toast.dismiss(t.id);
						}}
						className="text-white w-16 px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-sm"
					>
						아니오
					</button>
				</div>
			</div>
		));
	};

	const handleOut = async () => {
		try {
			const response = await putApi(`auth/out`, { userId: id });
			if (response.status === 200) {
				toast.success('정상적으로 회원탈퇴가 완료되었습니다.');
				logout();
				navigate('/');
			}
		} catch (error) {
			console.error('회원탈퇴 오류:', error);
		}
	};

	useEffect(() => {
		setProfileImgToChange(profileImg);
	}, [profileImg]);

	useEffect(() => {
		if (profileImg) {
			if (typeof profileImg === 'string') {
				setPreview(profileImg);
			} else if (profileImg instanceof File) {
				const imageUrl = URL.createObjectURL(profileImg);
				setPreview(imageUrl);

				return () => {
					URL.revokeObjectURL(imageUrl);
				};
			}
		} else {
			setPreview('');
		}
	}, [profileImg]);

	useEffect(() => {
		let imageUrl;

		if (tempMbtiImg) {
			imageUrl = tempMbtiImg;
		} else if (profileImg) {
			imageUrl = profileImg;
		} else if (mbtiImg) {
			imageUrl = mbtiImg;
		} else {
			imageUrl = defaultUser;
		}

		setPreview(imageUrl);
	}, [profileImg, mbtiImg, tempMbtiImg]);

	useEffect(() => {
		return () => {
			setTempMbtiImg('');
		};
	}, []);
	return (
		<>
			<section className="">
				<div className="flex justify-center px-6 py-8 mx-auto lg:py-0 my-20">
					<div className="w-full bg-white rounded-sm shadow-xl dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700 ">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<h1 className="mb-10 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
								회원정보 수정
							</h1>
							{mbti === '미설정' && (
								<div
									className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
									role="alert"
								>
									<InformationCircleIcon className="w-5 mr-2" />
									<span className="sr-only"></span>
									<div>
										즐거운 커뮤니티 이용을 위해 MBTI 설정을 완료해주세요.
									</div>
								</div>
							)}

							<form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
								<div className="flex justify-center">
									<img
										className="w-32 h-32 rounded-full border -mb-2 cursor-pointer"
										src={preview ? preview : defaultUser}
										alt="Rounded avatar"
										onClick={() => setShowModal(true)}
									/>
								</div>

								<div>
									<button
										type="button"
										onClick={() => setShowModal(true)}
										className="relative top-8 left-32 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-1 mx-1 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
									>
										직접 업로드
									</button>

									<ProfilePicker />
								</div>
								<div className="flex flex-col">
									<label
										htmlFor="email"
										className="block mb-2 font-semibold text-gray-900 dark:text-white"
									>
										이메일
									</label>
									<div className="flex space-x-2">
										<div>{email}</div>
									</div>
								</div>

								<div>
									<label
										htmlFor="password"
										className="mt-3 block mb-2 font-semibold text-gray-900 dark:text-white"
									>
										비밀번호
									</label>
									<input
										disabled={isGoogleLogin}
										value={passwordToChange}
										onChange={handleChangeInput}
										autoComplete=""
										type="password"
										name="password"
										id="password"
										placeholder={
											isGoogleLogin
												? '구글로 가입한 경우 비밀번호 수정이 불가합니다.'
												: ''
										}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required=""
									/>
									<p
										className={`text-xs ${
											!isPasswordValid && passwordToChange
												? 'text-red-500'
												: 'text-transparent'
										}`}
									>
										{!isPasswordValid && passwordToChange
											? '비밀번호는 8~20자 영문, 숫자, 특수문자 조합으로 설정해주세요.'
											: '　'}
									</p>
								</div>
								<div>
									<label
										htmlFor="confirm-password"
										className="block mb-2 font-semibold text-gray-900 dark:text-white"
									>
										비밀번호 재확인
									</label>
									<input
										disabled={isGoogleLogin}
										value={confirmPassword}
										onChange={handleChangeInput}
										autoComplete=""
										type="password"
										name="confirmPassword"
										id="confirm-password"
										placeholder={
											isGoogleLogin
												? '구글로 가입한 경우 비밀번호 수정이 불가합니다.'
												: ''
										}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required=""
									/>
									<p
										className={`text-xs ${
											!isPasswordSame && confirmPassword
												? 'text-red-500'
												: 'text-transparent'
										}`}
									>
										{!isPasswordSame && confirmPassword
											? '비밀번호가 일치하지 않습니다.'
											: '　'}
									</p>
								</div>

								<div className="flex flex-col">
									<label
										htmlFor="nickname"
										className="block mb-2 font-semibold text-gray-900 dark:text-white"
									>
										닉네임
									</label>

									<div className="flex flex-row space-x-2 justify-end">
										<input
											onChange={handleChangeInput}
											value={nicknameToChange}
											type="text"
											name="nickname"
											id="nickname"
											className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										/>

										<button
											type="button"
											onClick={handleNicknameCheck}
											disabled={
												!isNicknameValid || nickname == nicknameToChange
											}
											className="flex items-center justify-center self-end bg-blue-500 text-white font-bold py-2 px-4 h-full rounded-sm focus:outline-none focus:shadow-outline disabled:bg-blue-200 hover:bg-blue-600 w-1/3 text-sm"
											style={{ height: '45px' }}
										>
											중복 확인
										</button>
									</div>

									<p
										className={`text-xs ${
											!isNicknameValid && nicknameToChange
												? 'text-red-500'
												: 'text-transparent'
										}`}
									>
										{!isNicknameValid && nicknameToChange
											? '닉네임은 2~16자 사이로 설정해주세요.'
											: ''}{' '}
										<span
											className={`text-xs ${
												isNicknameValid && !nicknameCheck
													? 'text-red-500'
													: 'text-transparent'
											}`}
										>
											{isNicknameValid && !nicknameCheck
												? '중복 확인버튼을 눌러 주세요.'
												: '　'}
										</span>
									</p>
								</div>
								<div>
									<label
										htmlFor="mbti"
										className="block mb-2 font-semibold text-gray-900 dark:text-white"
									>
										MBTI 선택
									</label>
									<Select
										defaultValue={mbtiToChange}
										onChange={handleMbtiChange} // Update this line
										options={mbtiList}
										placeholder="MBTI "
										classNamePrefix="react-select"
									/>
								</div>
								<div className="flex flex-col">
									<button
										disabled={!isFormValid}
										className="my-4 w-full flex items-center justify-center self-end bg-blue-500 text-white font-bold py-2 px-4 h-full rounded-sm focus:outline-none focus:shadow-outline disabled:bg-blue-200 hover:bg-blue-600 w-1/3 text-sm"
										onClick={handleSubmit}
									>
										수정하기
									</button>
									<hr className="mt-8" />
								</div>
							</form>
							<button
								onClick={handleConfirm}
								className="text-sm text-red-600 underline flex ml-auto"
							>
								회원 탈퇴
							</button>
						</div>
					</div>
				</div>
			</section>

			<ProfileImgUploadModal
				isVisible={showModal}
				closeModal={() => setShowModal(false)}
			/>
		</>
	);
};

export default InfoChange;
