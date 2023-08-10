export const getTime = (value: string, lang: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat(lang, {
        hour: "numeric",
        minute: "numeric",
    }).format(date);
}