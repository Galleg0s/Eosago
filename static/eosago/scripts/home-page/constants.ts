export interface queryInterface {
	[media: string]: number
}

export interface mediaQueryInterface {
	[media: string]: queryInterface
}

export const mediaQuery: mediaQueryInterface = {
	xs: {
		maxWidth: 567
	},
	// Horizontal phone
	hxs: {
		maxWidth: 767
	},
	// Small screen / tablet
	sm: {
		maxWidth: 1023
	},
	// Horizontal tablet
	hsm: {
		maxWidth: 1279
	},
	// Medium screen / desktop
	md: {
		maxWidth: 1365
	},
	// Large screen / desktop
	lg: {
		maxWidth: 1439
	},
	// Extra large screen / wide desktop
	xl: {
		minWidth: 1440
	}
};
