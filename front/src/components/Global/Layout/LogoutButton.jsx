import { useUserActions } from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const LogoutButton = () => {
	const { logout } = useUserActions();
	const navigate = useNavigate();
	return (
		<>
			<button
				onClick={() => {
					logout();
					toast.success('로그아웃 하였습니다.');
					navigate('/');
				}}
				type="button"
				className="xs:hidden sm:hidden md:flex text-white pt-2.5 pb-2.5 pl-4 pr-3 mr-2 text-sm font-medium text-gray-900 focus:outline-none rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
			>
				로그아웃
				<ArrowLeftOnRectangleIcon className="ml-1 mt-0.5 h-5" />
			</button>
		</>
	);
};

export default LogoutButton;
