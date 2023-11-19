import { useNavigate } from 'react-router-dom';

export const BackButton = () => {
	const navigate = useNavigate();
	const onClickButton = () => {
		navigate(-1);
	};
	return (
		<button
			onClick={onClickButton}
			type="button"
			className="text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-1 text-center mr-2 mb-2"
		>
			목록으로
		</button>
	);
};

export default BackButton;
