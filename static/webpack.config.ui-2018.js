module.exports = {
	entry: {
		'./scripts/apps/insurance-tourism': './scripts/apps/insurance-tourism/app.js',
		'./scripts/apps/insurance-tourism-about': './scripts/apps/insurance-tourism/about.js',
		'./scripts/apps/feedback-panel': './scripts/apps/feedback-panel/feedback-panel.js',
		'./styles/insurance-vzr': './styles/insurance-vzr.extract.styl',
		'./scripts/apps/prolongation': './scripts/apps/prolongation/index.jsx',
		'./eosago/scripts/home-page': './eosago/scripts/home-page/index.tsx',
		'./eosago/scripts/partners': './eosago/scripts/partners/index.tsx',
		'./eosago/scripts/form': './eosago/scripts/form/index.tsx',
		'./eosago/styles/eosago-redesign': './eosago/styles/eosago-redesign.extract.styl',
	},

	externals: {
		'scroll-magic': {amd: 'ScrollMagic'},
		'scroll-magic-animation': {amd: 'ScrollMagic.animation'},
		'tween-max': {amd: 'TweenMax'},
	}
};
