import MyDaenamuCard from './MyDaenamuCard';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { getApi } from '../../services/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const MyDaenamus = () => {
	const [forests, setForests] = useState([]);

	const fetchDaenamus = async () => {
		try {
			const res = await getApi('forest/my');
			setForests(res.data.forests);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchDaenamus();
	}, []);

	return (
		<>
			<div>
				<h3 className="text-2xl text-gray-700 font-semibold">
					내가 쓴 대나무숲
				</h3>
				<div className="mt-1">
					총{' '}
					<span className="text-blue-600 font-semibold">{forests.length}</span>{' '}
					건
				</div>
				<div className="text-base mt-4 mb-4 text-gray-700">
					{forests.length !== 0 ? (
						<span className="inline">
							<ChevronRightIcon className="w-4 inline mb-1" />
							<Link to="MyDaenamusAll" state={{ forests: forests }}>
								전체보기
							</Link>
						</span>
					) : null}
					<div className="my-8 flex flex-wrap justify-start md:justify-start">
						{forests.slice(0, 3).map((forest) => (
							<div
								key={forest._id}
								className={`w-full md:w-1/3 mb-4 px-1 md:px-2`}
							>
								<MyDaenamuCard forest={forest} />
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default MyDaenamus;
