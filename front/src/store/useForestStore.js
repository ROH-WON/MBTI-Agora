import { create } from 'zustand';
import { getApi } from '../services/api';

const useForestStore = create((set) => ({
	title: '',
	content: '',
	mood: '',
	commentList: '',
	totalPage: 0,
	forests: [],

	setTitle: (title) => set({ title }),
	setContent: (content) => set({ content }),
	setMood: (mood) => set({ mood }),
	setCommentList: (commentList) => set({ commentList }),
	setForests: (forests) => set({ forests }),
	setTotalPage: (totalPage) => set({ totalPage }),

	reset: () =>
		set({
			title: '',
			content: '',
			mood: '',
			commentList: '',
		}),

	fetchFilteredForests: async (mbtiFilter, page = 1) => {
		try {
			const res = await getApi(`forest/mbti?filter=${mbtiFilter}&page=${page}`);
			set({ forests: res.data.forests });
			set({ totalPage: res.data.totalPage });
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	},

	fetchForests: async (page = 1) => {
		try {
			const res = await getApi(`forest?page=${page}`);

			set({ forests: res.data.forests });
			set({ totalPage: res.data.totalPage });
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	},

	fetchPopularFilteredForests: async (mbtiFilter, page = 1) => {
		try {
			const res = await getApi(
				`forest/popularity/mbti?filter=${mbtiFilter}&page=${page}`,
			);

			set({ forests: res.data.forests });
			set({ totalPage: res.data.totalPage });
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	},

	fetchPopularForests: async (page = 1) => {
		try {
			const res = await getApi(`forest/popularity?&page=${page}`);

			set({ forests: res.data.forests });
			set({ totalPage: res.data.totalPage });
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	},
}));

export default useForestStore;
