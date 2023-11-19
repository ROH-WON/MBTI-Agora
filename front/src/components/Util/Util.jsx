import moment from 'moment';

export const classNames = (...classes) => {
	return classes.filter(Boolean).join(' ');
};

//배경색용, 연한 버전

export const textToBorderColor = {
	insecure: 'border-[#F1E3FF]',
	surprise: 'border-[#fcf7de]',
	pleasure: 'border-[#e1f2e2]',
	sad: 'border-[#ECF1FF]',
	anger: 'border-[#F9EBDE]',
	neutral: 'border-[#f5f5f5]',
};

export const textToColor = {
	insecure: '#F1E3FF',
	surprise: '#fcf7de',
	pleasure: '#e1f2e2',
	sad: '#ECF1FF',
	anger: '#F9EBDE',
	neutral: '#f5f5f5',
};

export const textEngToDeepColor = {
	pleasure: '#8CD790',
	insecure: '#A593E0',
	sad: '#6AAFE6',
	neutral: '#B8B8B8',
	surprise: '#F6B352',
	anger: '#FF7761',
};

//통계색용, 진한 버전
export const textToDeepColor = {
	불안: '#A593E0',
	놀람: '#F6B352',
	기쁨: '#8CD790',
	슬픔: '#6AAFE6',
	분노: '#FF7761',
	중립: '#B8B8B8',
};

export const textToIcon = {
	insecure: '😨',
	surprise: '😮',
	pleasure: '😊',
	sad: '😢',
	anger: '😡',
	neutral: '😐',
};

export const textToKorean = {
	insecure: '불안',
	surprise: '놀람',
	pleasure: '기쁨',
	sad: '슬픔',
	anger: '분노',
	neutral: '중립',
};

export const objectToKorean = (obj) => {
	const result = {};
	for (let key in obj) {
		const value = obj[key].toFixed(2); // 소수점 2자리까지 나타냄
		result[textToKorean[key]] = parseFloat(value);
	}
	return result;
};

export const mbtiList = [
	{ value: 'ISTJ', label: 'ISTJ' },
	{ value: 'ISFJ', label: 'ISFJ' },
	{ value: 'INFJ', label: 'INFJ' },
	{ value: 'INTJ', label: 'INTJ' },
	{ value: 'ISTP', label: 'ISTP' },
	{ value: 'ISFP', label: 'ISFP' },
	{ value: 'INFP', label: 'INFP' },
	{ value: 'INTP', label: 'INTP' },
	{ value: 'ESTP', label: 'ESTP' },
	{ value: 'ESFP', label: 'ESFP' },
	{ value: 'ENFP', label: 'ENFP' },
	{ value: 'ENTP', label: 'ENTP' },
	{ value: 'ESTJ', label: 'ESTJ' },
	{ value: 'ESFJ', label: 'ESFJ' },
	{ value: 'ENFJ', label: 'ENFJ' },
	{ value: 'ENTJ', label: 'ENTJ' },
];

export const truncateString = (string, length) => {
	return string.length > length ? `${string.slice(0, length)}...` : string;
};

export const removeTag = (string) => {
	return string.replace(/<[^>]*>?/g, '');
};

export const formatDate = (string) => {
	const date = moment(string);
	const formattedDate = date.format('YYYY년 M월 D일');
	return formattedDate;
};

export const formatCreatedAt = (string) => {
	const formattedTime = moment(string).format('YYYY-MM-DD HH:mm');
	return formattedTime;
};

export const formatRelativeTime = (string) => {
	const now = moment();
	const date = moment(string);

	const duration = moment.duration(now.diff(date));
	const daysElapsed = duration.asDays();

	if (duration.asSeconds() < 60) {
		return '방금';
	} else if (duration.asMinutes() < 60) {
		return `${Math.floor(duration.asMinutes())}분 전`;
	} else if (duration.asHours() < 24) {
		return `${Math.floor(duration.asHours())}시간 전`;
	} else if (daysElapsed <= 3) {
		return `${Math.floor(daysElapsed)}일 전`;
	} else {
		return date.format('YYYY-MM-DD');
	}
};

export const colorQueryText = ({ text, query }) => {
	if (!text.includes(query)) {
		return <>{text}</>;
	}

	const textParts = text.split(query);
	const lastIndex = textParts.length - 1;

	return (
		<>
			{textParts.map((part, index) =>
				index !== lastIndex ? (
					<>
						{part}
						<span className="text-blue-600 font-semibold">{query}</span>
					</>
				) : (
					<>{part}</>
				),
			)}
		</>
	);
};

export const calendarDateToString = (date) => {
	return new Date(date)
		.toLocaleDateString('ko-KR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		})
		.replaceAll('.', '-')
		.slice(0, -1)
		.replaceAll(' ', '');
};

export const defaultUser = '/images/default-user.png';

export const passwordRegex =
	/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

export const nicknameRegex = /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,16}$/;

export const isEmpty = (obj) => {
	return Object.keys(obj).length === 0;
};
