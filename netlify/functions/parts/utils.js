
export const toPersianDigit = (value) => {
    return value
        .toString()
        .replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d])
}