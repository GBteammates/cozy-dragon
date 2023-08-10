export const getDate = (value: string, lang: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}
