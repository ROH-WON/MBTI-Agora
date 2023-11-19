import { useState } from 'react';
import StoryCreateModal from './StoryCreateModal';
import StoryCardMap from '../Global/StoryCardMap';
import useStoryStore from '../../store/useStoryStore';
import { useIsLoggedIn } from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { postApi } from '../../services/api';
import toast from 'react-hot-toast';

const MyStories = () => {
	const navigate = useNavigate();
	const isLoggedIn = useIsLoggedIn();

	const { reset } = useStoryStore();
	const [storyModal, setStoryModal] = useState(false);

	const onClose = () => {
		setStoryModal(false);
		reset();
	};

	const renderModal = () => {
		if (!storyModal) return null;

		return createPortal(
			<StoryCreateModal onClose={onClose} />,
			document.getElementById('modal-root'), // Add a div with id="modal-root" in your index.html file
		);
	};

	const handleCheckLog = async () => {
		const res = await postApi('stories/isAlreadyWrote');

		if (res.data.result) {
			return true;
		}
		return false;
	};

	return (
		<>
			<div className="p-10 container mx-auto px-4">
				<div
					data-aos="fade-right"
					className="font-bold md:p-10 block p-6 bg-white rounded-lg"
				>
					<div className="flex justify-between items-center mb-4 text-2xl md:text-3xl font-semibold text-zinc-700">
						<div>내 스토리</div>
						<button
							onClick={
								isLoggedIn
									? async () => {
											const isWritten = await handleCheckLog();

											if (!isWritten) {
												setStoryModal(true);
											} else {
												toast.error(
													'스토리는 하루에 한번만 작성이 가능합니다.',
												);
											}
									  }
									: () => navigate('/login')
							}
							type="button"
							className="rounded-xl w-36 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-sm text-sm px-5 py-2.5 mr-2 mb-2"
						>
							스토리 쓰기
						</button>
					</div>
					<div className="mb-20 text-sm font-medium text-zinc-600">
						내가 쓴 스토리를 확인할 수 있어요.
					</div>

					<div>{renderModal()}</div>
					<div style={{ overflow: storyModal ? 'hidden' : 'auto' }}>
						<StoryCardMap endpoint={`stories/my`} />
					</div>
				</div>
			</div>
		</>
	);
};

export default MyStories;
