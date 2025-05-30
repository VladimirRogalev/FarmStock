/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}'
	],
	safelist: ['font-geist'],
	theme: {
		container: {
			padding: '2rem',
			center: true
		},
		extend: {
			fontFamily: {
				geist: ['Geist', 'sans-serif']
			}
		}
	},
	plugins: [require('@tailwindcss/forms'),]
};