import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import ProfileButton from './ProfileButton';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useIsLoggedIn } from '@/store/useUserStore';
import { scroller } from 'react-scroll';

const Header = () => {
	const navigate = useNavigate();
	const isLoggedIn = useIsLoggedIn();

	const handleGuestClick = () => {
		if (isLoggedIn) {
			navigate('/stories');
		} else {
			navigate('/login');
		}
	};
	const navigateAndScroll = () => {
		navigate('/');

		setTimeout(() => {
			scroller.scrollTo('scrollToThisDiv', {
				spy: true,
				smooth: true,
				offset: -70, // 헤더의 높이에 맞게 조절
				duration: 500,
			});
		}, 100); // 타이머를 사용하여 다음 프레임에서 스크롤 이벤트 발생
	};

	return (
		<nav className="bg-blue-400 border-gray-200">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
				<Link
					to="/"
					className="self-center text-2xl text-white font-semibold whitespace-nowrap"
				>
					<img
						className="self-end w-46 h-16 object-cover"
						src="/images/logo1.png"
					/>
				</Link>

				<div className="flex justify-end md:order-2 gap-1">
					{isLoggedIn ? (
						<>
							<div className="flex justify-between">
								<div className="flex items-center gap-2">
									<ProfileButton />
									<LogoutButton />
								</div>
							</div>
						</>
					) : (
						<LoginButton />
					)}
					<MobileHeader />
				</div>
				<div
					className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
					id="navbar-sticky"
				>
					<ul className="self-center flex flex-col p-4 md:p-0 mt-4 font-medium border md:flex-row md:space-x-8 md:mt-0 md:border-0">
						<li>
							<button
								onClick={navigateAndScroll}
								className="font-bold text-lg text-white block py-2 pl-3 mr-4 pr-4 text-gray-900 rounded md:hover:text-blue-700 md:p-0"
							>
								우리들의 스토리
							</button>
						</li>

						<li>
							<button
								onClick={() => {
									navigate('/daenamus');
								}}
								className="font-bold text-lg text-white block py-2 pl-3 mr-4 pr-4 text-gray-900 rounded md:hover:text-blue-700 md:p-0"
							>
								대나무숲
							</button>
						</li>
						<li>
							<button
								onClick={handleGuestClick}
								className="font-bold text-lg text-white block py-2 pl-3 pr-4 text-gray-900 rounded md:hover:text-blue-700 md:p-0"
							>
								내 스토리
							</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Header;
