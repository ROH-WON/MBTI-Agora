// Toast-UI Viewer 임포트
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import useStoryStore from '../../hooks/useStoryStore';

export default function TextViewer() {
	// 마크다운
	const { content } = useStoryStore();

	return (
		<div>
			<Viewer initialValue={content} />
		</div>
	);
}
