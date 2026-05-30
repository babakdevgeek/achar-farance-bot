

export class CalculatorView {

    static success(expression, result) {
        return [
            {
                type: "article",
                id: "calc_success",
                title: `${expression} = ${result}`,
                description: "ارسال به چت",
                //  paper icon as thumbnail
                thumbnail_url: "https://img.icons8.com/?size=100&id=48262&format=png&color=000000",
                input_message_content: {
                    message_text: `${expression} = ${result}`,
                }
            }
        ]
    }

    static error(errorType) {

        const messages = {
            EMPTY: "برای مثال 3 * 6 یا (2 + 5) / 3 را وارد کنید.",
            INVALID: "❌ عبارت نامعتبر",
            SYNTAX: "❌ خطای سینتکس",
            NOT_FINITE: "❌ نتیجه نامحدود است",
            NOT_NUMBER: "❌ خروجی عددی نیست"
        };



        return [
            {
                type: "article",
                id: "calc_error",
                title: errorType === "EMPTY" ? "عبارت ریاضی خود را بنویسید" : "❌ خطا در محاسبه",
                description: messages[errorType] || "خطای ناشناخته",
                thumbnail_url: "https://img.icons8.com/?size=100&id=44000&format=png&color=000000",
                input_message_content: {
                    message_text: messages[errorType] || "❌ خطا"
                }
            }
        ]
    }
}