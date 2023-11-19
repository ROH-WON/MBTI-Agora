/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
export default {
	content: ['./src/**/*.{js,jsx}'],
	theme: {
		extend: {},
		screens: {
			'xs': '360px',
			...defaultTheme.screens,
		  },
	},
	
	plugins: [],
};
