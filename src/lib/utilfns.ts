export const initialsFromFullname = (str: string | undefined) => {
    if (str) {
        const parts = str.split(" ");
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    } else return "AB";
};