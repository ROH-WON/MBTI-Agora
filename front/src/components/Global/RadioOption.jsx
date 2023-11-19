import useStoryStore from '../../store/useStoryStore';

const RadioOption = ({
	id,
	value,
	name,
	label,
	selectedOption,
	setSelectedOption,
}) => {
	const { setThumbnail, localThumbnail, stableThumbnail } = useStoryStore();

	const handleOptionChange = () => {
		setSelectedOption(value);

		// 선택된 값을 기준으로 setThumbnail 함수 호출
		if (value === 'local-thumbnail') {
			setThumbnail(localThumbnail);
		} else if (value === 'stable-thumbnail') {
			setThumbnail(stableThumbnail._id);
		}
	};

	return (
		<div className="mb-5 flex items-center pl-1">
			<input
				id={id}
				value={value}
				name={name}
				onChange={handleOptionChange}
				type="radio"
				className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
			/>
			<label
				htmlFor="bordered-radio-1"
				className="w-full py-4 ml-2 text-sm font-medium text-gray-900"
			>
				{label}
			</label>
		</div>
	);
};

export default RadioOption;
