export default function convertNameToInitials(firstName: string, lastName: string): string {
	const firstInitial = Array.from(firstName)[0];
	const lastInitial = Array.from(lastName)[0];
	return `${firstInitial}${lastInitial}`;
}
