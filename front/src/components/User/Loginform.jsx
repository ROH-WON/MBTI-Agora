import { useState, useMemo } from 'react';
import useUserStore, { useUserActions } from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import GoogleButton from '../Global/Layout/GoogleButton';
import toast from 'react-hot-toast';

const LoginForm = () => {
	const navigate = useNavigate();
	const { email, setEmail } = useUserStore();

	const { login } = useUserActions();
	const [errMsg, setErrMsg] = useState('');
	const [password, setPassword] = useState('');

	const [focusedMap, setFocusedMap] = useState({
		email: false,
		password: false,
	});

	const handleFocus = (name, value) => {
		setFocusedMap({ ...focusedMap, [name]: value });
	};

	const user = { email, password };

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await login(user);
			navigate('/');
		} catch (error) {
			console.log(error.response)
			setErrMsg(error.response?.data?.message);
			if (error.response.data.error) {
				toast.error(error.response?.data?.error);
			}
		}
	};

	const validateEmail = () => {
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,255}$/;
		return emailRegex.test(email);
	};

	const isEmailValid = useMemo(validateEmail, [email]);

	const isPasswordValid = useMemo(() => password.length > 0, [password]);

	const isFormValid = useMemo(
		() => isEmailValid && isPasswordValid,
		[isEmailValid, isPasswordValid],
	);

	const handleChangeInput = (e) => {
		if (e.target.name === 'email') setEmail(e.target.value);
		if (e.target.name === 'password') setPassword(e.target.value);
	};

	return (
		<div>
			<div className="bg-white">
				<div className="flex justify-center h-screen">
					<div
						className="hidden bg-cover bg-no-repeat lg:block lg:w-full"
						style={{
							backgroundImage: 'url(/images/loginimg.jpg)',
						}}
					></div>

					<div className="flex items-center w-full max-w-md px-6 lg:mx-20 lg:w-2/5">
						<div className="flex-1">
							<div className="text-center cursor-pointer">
								<img
									onClick={() => navigate('/')}
									src="/images/loginlogo.png"
									alt="Login"
								/>
							</div>

							<div className="mt-8">
								<form onSubmit={handleSubmit}>
									<div className="relative">
										<label
											htmlFor="email"
											className="block mb-2 text-xl text-gray-600"
										>
											이메일
										</label>
										<input
											type="email"
											name="email"
											id="email"
											placeholder="elice@gmail.com"
											autoComplete="false"
											value={email}
											onChange={handleChangeInput}
											onFocus={() => {
												if (!isFormValid && email === '') {
													handleFocus('email', true);
												}
											}}
											onBlur={() => {
												handleFocus('email', false);
											}}
											className={`block w-full px-4 py-2 my-2 text-gray-700 placeholder-gray-400 bg-white border rounded-md focus:ring-gray-400 focus:outline-none focus:ring focus:ring-opacity-40`}
										/>
										{!isEmailValid && email !== '' && focusedMap.email && (
											<p className="text-red-500 text-xs">
												이메일 형식이 올바르지 않습니다.
											</p>
										)}
										{!isFormValid && email === '' && focusedMap.email && (
											<p className="text-red-500 text-xs">
												이메일을 입력해주세요.
											</p>
										)}
									</div>

									<div className="mt-6">
										<div className="flex justify-between mb-2">
											<label
												htmlFor="password"
												className="text-lg text-gray-600"
											>
												비밀번호
											</label>
										</div>

										<input
											type="password"
											name="password"
											id="password"
											placeholder="********"
											autoComplete="false"
											value={password}
											onChange={handleChangeInput}
											onFocus={() => {
												if (!isFormValid && password === '') {
													handleFocus('password', true);
												}
											}}
											onBlur={() => {
												handleFocus('password', false);
											}}
											className="block w-full px-4 py-2 my-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:ring-gray-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
										/>
										{!isFormValid && password === '' && focusedMap.password && (
											<p className="text-red-500 text-xs">
												비밀번호를 입력해주세요.
											</p>
										)}
									</div>

									<div className="mt-6">
										<button
											type="submit"
											disabled={!isFormValid}
											className="rounded-xl w-full text-lg px-4 py-2 mb-4 tracking-wide text-white transition-colors duration-200 transform bg-[#4687a2] rounded-sm disabled:bg-[#BBDCE8] hover:bg-[#3B82A0] focus:outline-none focus:bg-[#85B7CC] focus:ring focus:ring-blue-300 focus:ring-opacity-50"
										>
											로그인
										</button>
										{errMsg && (
											<p className="text-red-500 text-xs mb-3">{errMsg}</p>
										)}
										<GoogleButton />
									</div>
								</form>

								<p className="mt-4 text-md text-center text-gray-400">
									계정이 없으신가요?{' '}
									<a
										className="text-[#5DA1BE] focus:outline-none focus:underline hover:underline cursor-pointer"
										onClick={() => navigate('/register')}
									>
										가입하기
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
