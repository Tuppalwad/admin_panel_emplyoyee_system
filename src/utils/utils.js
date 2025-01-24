export const capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};