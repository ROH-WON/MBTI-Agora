import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { textToIcon } from '../Util/Util';

const MusicVideo = ({ music, phrase, mood }) => {
	const [videoWidth, setVideoWidth] = useState('560');

	const updateVideoWidth = () => {
		if (window.innerWidth >= 680) {
			setVideoWidth('560');
		} else {
			setVideoWidth(window.innerWidth * 0.65);
		}
	};

	const handleResize = debounce(updateVideoWidth, 200);

	useEffect(() => {
		updateVideoWidth();
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [handleResize]);

	const opts = {
		width: videoWidth,
		height: '315',
		playerVars: {
			controls: 0,
			disablekb: 0,
			autoplay: 1,
			rel: 0,
			modestbranding: 1,
		},
	};

	return (
		<div className="space-y-3 p-6 border-gray-200 dark:border-gray-600">
			{/* YouTube 영상을 여기에 표시하는 코드 추가 */}
			<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
				{textToIcon[mood]}
				{phrase}
			</h3>
			<div className="justify-center">
				<YouTube videoId={music} opts={opts} />
			</div>
		</div>
	);
};

MusicVideo.propTypes = {
	music: PropTypes.string.isRequired,
	phrase: PropTypes.string.isRequired,
};

export default MusicVideo;
