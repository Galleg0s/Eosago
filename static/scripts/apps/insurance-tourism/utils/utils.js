export const getFieldStatus = (hint, {touched, error}) => {
	if (touched && error) {
		return {
			type: 'error',
			message: error,
		}
	}
	return {
		type: 'default',
		message: hint,
	};
};

// Format dates to from DD.MM.YYYY to YYYY-MM-DD
export function formatDate(date) {
	return date && date.split('.').reverse().join('-');
}

export const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const emptyFunction = () => {};

export const translitRusToEng = (russianString) => {
	const letters = {
		А: 'A', а: 'a', Б: 'B', б: 'b', В: 'V', в: 'v', Г: 'G', г: 'g',
		Д: 'D', д: 'd', Е: 'E', е: 'e', Ё: 'Yo', ё: 'yo', Ж: 'Zh', ж: 'zh',
		З: 'Z', з: 'z', И: 'I', и: 'i', Й: 'I', й: 'i', К: 'K', к: 'k',
		Л: 'L', л: 'l', М: 'M', м: 'm', Н: 'N', н: 'n', О: 'O', о: 'o',
		П: 'P', п: 'p', Р: 'R', р: 'r', С: 'S', с: 's', Т: 'T', т: 't',
		У: 'U', у: 'u', Ф: 'F', ф: 'f', Х: 'Kh', х: 'kh', Ц: 'Ts', ц: 'ts',
		Ч: 'Ch', ч: 'ch', Ш: 'Sh', ш: 'sh', Щ: 'Sch', щ: 'sch', Ъ: '"', ъ: '"',
		Ы: 'Y', ы: 'y', Ь: "'", ь: "'", Э: 'E', э: 'e', Ю: 'Yu', ю: 'yu',
		Я: 'Ya', я: 'ya'
	};
	let lettersReg = '';

	for (let letter in letters) {
		lettersReg += letter;
	}

	lettersReg = new RegExp('[' + lettersReg + ']', 'g');
	const replacement = (engLetter) => {
		return engLetter in letters ? letters[engLetter] : '';
	};

	return russianString.replace(lettersReg, replacement);
};

export function calculateAge(dob) {
	const diffMs = Date.now() - dob.getTime();
	const ageDt = new Date(diffMs);

	return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export function scrollToRef(ref) {
	if (!ref) {
		return;
	}
	const rect = ref.current.getBoundingClientRect();
	window.scrollTo({
		top: rect.top + window.scrollY,
		behavior: 'smooth'
	})
}
