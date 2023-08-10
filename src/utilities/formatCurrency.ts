export const toCurrency = (n: number, curr = 'USD', LanguageFormat = 'en-us') =>
    Intl
        .NumberFormat(
            LanguageFormat,
            {
                style: 'currency',
                currency: curr,
                minimumFractionDigits: 0
            })
        .format(n);