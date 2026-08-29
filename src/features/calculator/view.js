const THUMB_SUCCESS = "https://img.icons8.com/?size=100&id=48262&format=png&color=000000";
const THUMB_ERROR = "https://img.icons8.com/?size=100&id=44000&format=png&color=000000";

export function calculatorSuccessArticle(expression, result) {
    return [
        {
            type: "article",
            id: "calc_success",
            title: `${expression} = ${result}`,
            description: "ارسال به چت",
            thumbnail_url: THUMB_SUCCESS,
            input_message_content: {
                message_text: `${expression} = ${result}`,
            },
        },
    ];
}

export function calculatorErrorArticle(errorType, messages) {
    return [
        {
            type: "article",
            id: "calc_error",
            title: errorType === "EMPTY" ? "عبارت ریاضی خود را بنویسید" : "❌ خطا در محاسبه",
            description: messages[errorType] || "خطای ناشناخته",
            thumbnail_url: THUMB_ERROR,
            input_message_content: {
                message_text: messages[errorType] || "❌ خطا",
            },
        },
    ];
}
