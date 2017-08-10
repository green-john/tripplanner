
export function formatDate(date) {
    if (!date) {
        return "";
    }
    const d = new Date(date);
    const day = d.getDate() + 1;
    const month = d.getMonth() + 1;
    return `${day}/${month}/${d.getFullYear()}`;
}
