export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    return new Date(date).toLocaleDateString("fr-FR", options);
}
