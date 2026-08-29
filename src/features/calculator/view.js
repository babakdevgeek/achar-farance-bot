import { emojiTag } from "../../shared/emojis.js";

// Nicer, colored calculator / warning thumbnails instead of plain black glyphs.
const THUMB_SUCCESS =
    "https://img.icons8.com/fluency/96/calculator.png";
const THUMB_ERROR =
    "https://img.icons8.com/fluency/96/error--v1.png";
const THUMB_HELP =
    "https://img.icons8.com/fluency/96/light-on.png";

/** One example row for the help card. */
const HELP_EXAMPLES = [
    ["(2 + 5) / 3", "پرانتز و چهار عمل اصلی"],
    ["sqrt(144)", "جذر و توان: 2^10"],
    ["sin(pi / 2)", "توابع مثلثاتی"],
    ["1,500,000 * 12", "اعداد بزرگ با جداکننده"],
    ["۵ × ۷", "اعداد فارسی و علائم × ÷"],
];

function helpText() {
    const rows = HELP_EXAMPLES.map(([expr, desc]) => `<code>${expr}</code> — ${desc}`).join("\n");
    return (
        `🧮 <b>ماشین حساب</b> ${emojiTag("calculator")}\n` +
        `\nعبارت ریاضی خود را همین‌جا بنویسید و نتیجه را در هر چتی ارسال کنید.\n` +
        `\n<b>نمونه‌ها:</b>\n${rows}\n` +
        `\n<i>همچنین از توابع mathjs مثل log، round، factorial و... پشتیبانی می‌شود.</i>`
    );
}

function helpArticle() {
    return [
        {
            type: "article",
            id: "calc_help",
            title: "🧮 ماشین حساب را این‌جا بنویسید…",
            description: "مثلا 3 * 6 یا (2 + 5) / 3 — راهنما برای ارسال",
            thumbnail_url: THUMB_HELP,
            input_message_content: {
                message_text: helpText(),
                parse_mode: "HTML",
            },
        },
    ];
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function successArticle(expression, formatted) {
    const safeExpr = escapeHtml(expression);
    return [
        {
            type: "article",
            id: "calc_success",
            title: `${expression} = ${formatted}`,
            description: "برای ارسال نتیجه به چت، این‌جا را لمس کنید",
            thumbnail_url: THUMB_SUCCESS,
            input_message_content: {
                message_text:
                    `${emojiTag("calculator")} <b>${safeExpr}</b>\n` +
                    `<blockquote expandable><b>${formatted}</b></blockquote>`,
                parse_mode: "HTML",
            },
        },
    ];
}

function errorArticle(errorType, messages) {
    const title = errorType === "EMPTY" ? "🧮 عبارت ریاضی خود را بنویسید" : "❌ خطا در محاسبه";
    return [
        {
            type: "article",
            id: `calc_error_${errorType}`,
            title,
            description: messages[errorType] || "خطای ناشناخته",
            thumbnail_url: THUMB_ERROR,
            input_message_content: {
                message_text:
                    `${title}\n<blockquote>${messages[errorType] || "❌ خطای ناشناخته"}</blockquote>`,
                parse_mode: "HTML",
            },
        },
    ];
}

/** Inline-query result list for a successful calculation. */
export function calculatorSuccessArticle(expression, formatted) {
    return successArticle(expression, formatted);
}

/** Inline-query result list: help card for empty queries, error card otherwise. */
export function calculatorErrorArticle(errorType, messages) {
    return errorType === "EMPTY" ? helpArticle() : errorArticle(errorType, messages);
}
