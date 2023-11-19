import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useForestStore from '../../store/useForestStore';
import DaenamuTextEditor from './DaenamuTextEditor';
import { postApi } from '../../services/api';

const DaenamusWrite = () => {
	const navigate = useNavigate();
	const { title, content, mood } = useForestStore();

	const isFormValid = useMemo(
		() => title && content && mood,
		[title, content, mood],
	);

	const postForest = async (e) => {
		e.preventDefault();

		try {
			const post = { title, content, mood };

			const res = await postApi('forest', post);

			navigate(`/daenamus/${res.data._id}`);
		} catch (e) {
			console.error(e);
		}
	};
	return (
		<>
			<header>{/* 헤더 컴포넌트 */}</header>

			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold mb-4 my-16">대나무숲 작성하기</h2>

				<div className="mt-12">
					<DaenamuTextEditor />
					<div className="mt-3 justify-end flex flex-col">
						<button
							disabled={!isFormValid}
							onClick={postForest}
							type="button"
							className="w-40 self-end bg-blue-400 disabled:bg-neutral-300 text-white font-medium rounded-md text-sm px-5 py-2.5 text-center "
						>
							작성 완료
						</button>
						{!isFormValid && (
							<p className="self-end text-red-400 text-sm">
								제목 · 본문을 작성한 후 '감정 분석하기'를 눌러주세요.
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default DaenamusWrite;
