const decodeBase64Row = (base64Row: string): number[] => {
	const decodedBytes = atob(base64Row);
	const numbers = Array.from(decodedBytes, (char) => char.charCodeAt(0));
	return numbers;
};

// Utility function to decode a single Base64-encoded field
export const transformField = (encodedField: string[]): number[][] => {
	return encodedField.map(decodeBase64Row);
};
