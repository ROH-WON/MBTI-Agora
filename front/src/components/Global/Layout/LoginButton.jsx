import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => navigate('/login')}
			type="button"
			className="text-white pt-2.5 pb-2.5 px-4 mr-2 text-sm font-medium text-gray-900 focus:outline-none rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
			>
			로그인
		</button>
	);
};

export default LoginButton;
