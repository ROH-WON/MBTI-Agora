import { useState } from 'react';
import useUserStore from '../store/useUserStore';

const useRegisterStore = () => {
	const {
		email,
		nickname,
		mbti,
		isLoggedIn,
		mbtiImg,
		tempMbtiImg,

		setEmail,
		setNickname,
		setMbti,
		setIsLoggedIn,
		setMbtiImg,
		setTempMbtiImg,
	} = useUserStore();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [code, setCode] = useState('');
	const [checkMsg, setCheckMsg] = useState('');
	const [nicknameCheck, setNicknameCheck] = useState(false);
	const [errMsg, setErrMsg] = useState('');

	return {
		email,
		password,
		nickname,
		mbti,
		isLoggedIn,
		confirmPassword,
		code,
		checkMsg,
		nicknameCheck,
		errMsg,
		mbtiImg,
		tempMbtiImg,

		setEmail,
		setPassword,
		setNickname,
		setMbti,
		setIsLoggedIn,
		setConfirmPassword,
		setCode,
		setCheckMsg,
		setNicknameCheck,
		setErrMsg,
		setMbtiImg,
		setTempMbtiImg
	};
};

export default useRegisterStore;
