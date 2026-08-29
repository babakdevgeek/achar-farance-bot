import { evaluate } from "mathjs";

export const CALC_ERRORS = {
    EMPTY: "برای شروع، یک عبارت ریاضی بنویسید؛ مثلا 3 * 6 یا (2 + 5) / 3",
    INVALID: "❌ عبارت نامعتبر است",
    SYNTAX: "❌ خطای نگارشی در عبارت",
    UNKNOWN: "❌ نماد ناشناخته در عبارت",
    NOT_FINITE: "❌ نتیجه بی‌نهایت یا نامعتبر است",
    NOT_NUMBER: "❌ خروجی عددی نیست",
};

/** Characters users type that the evaluator doesn't understand directly. */
const DIGIT_MAP = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGIT_MAP = "٠١٢٣٤٥٦٧٨٩";

/** Convert Persian/Arabic digits, math symbols and separators to ASCII math. */
function normalize(input) {
    let out = input
        .replace(/[۰-۹]/g, (d) => String(DIGIT_MAP.indexOf(d)))
        .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGIT_MAP.indexOf(d)))
        .replace(/[×✕✖]/g, "*")
        .replace(/[÷∕]/g, "/")
        .replace(/[−–—]/g, "-")
        .replace(/[٫،]/g, ".")
        .replace(/٪/g, "%")
        .replace(/\u200c|\u200f|\u200e/g, "") // ZWNJ / RTL marks
        .replace(/[,\s_](?=\d{3}\b)/g, "") // thousands separators: 1,000 → 1000
        .trim();
    // Trailing "=" is a very common habit: "2+2="
    out = out.replace(/[=]+\s*$/, "").trim();
    return out;
}

/** Remove floating-point noise: 0.30000000000000004 → 0.3, 1/3 stays 1/3. */
function cleanNumber(n) {
    if (Number.isInteger(n)) return n;
    const rounded = Number(n.toPrecision(12));
    return rounded === 0 ? 0 : rounded; // avoid "-0"
}

/** Pretty-print a number with thousands separators, keeping decimals intact. */
export function formatResult(n) {
    const [intPart, decPart] = String(n).split(".");
    const grouped = new Intl.NumberFormat("en-US").format(Number(intPart));
    return decPart ? `${grouped}.${decPart}` : grouped;
}

/** Map a thrown mathjs error to a friendly, specific error key. */
function classifyError(err) {
    const msg = String(err?.message || "");
    if (/Undefined symbol|is not defined/i.test(msg)) return "UNKNOWN";
    if (/Unexpected end|Part of the|SyntaxError/i.test(msg)) return "SYNTAX";
    return "INVALID";
}

/**
 * Evaluate a math expression.
 * @param {string} input raw user input
 * @returns {{ ok: true, expression: string, result: number, formatted: string }
 *          | { ok: false, error: keyof typeof CALC_ERRORS }}
 */
export function calculate(input) {
    if (!input || !input.trim()) {
        return { ok: false, error: "EMPTY" };
    }

    const expression = normalize(input);

    try {
        const raw = evaluate(expression);

        if (typeof raw !== "number") return { ok: false, error: "NOT_NUMBER" };
        if (!Number.isFinite(raw)) return { ok: false, error: "NOT_FINITE" };

        const result = cleanNumber(raw);
        return { ok: true, result, formatted: formatResult(result), expression };
    } catch (err) {
        return { ok: false, error: classifyError(err) };
    }
}
