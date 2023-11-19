import { createPortal } from 'react-dom';
import StoryCreateModal from './StoryCreateModal';
import PropTypes from 'prop-types';

const ModalPortal = ({ storyModal, onClose }) => {
	if (!storyModal) return null;

	return createPortal(
		<div className="overlay">
			<StoryCreateModal onClose={onClose} />
		</div>,
		document.getElementById('modal-root'), // Add a div with id="modal-root" in your index.html file
	);
};

export default ModalPortal;

ModalPortal.propTypes = {
	storyModal: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};
