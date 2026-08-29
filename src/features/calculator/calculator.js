import { evaluate } from "mathjs";

export const CALC_ERRORS = {
    EMPTY: "برای مثال 3 * 6 یا (2 + 5) / 3 را وارد کنید.",
    INVALID: "❌ عبارت نامعتبر",
    SYNTAX: "❌ خطای سینتکس",
    NOT_FINITE: "❌ نتیجه نامحدود است",
    NOT_NUMBER: "❌ خروجی عددی نیست",
};

/** Convert common math symbols to operators the evaluator understands. */
function normalize(input) {
    return input.replace(/×/g, "*").replace(/÷/g, "/").trim();
}

/**
 * Evaluate a math expression.
 * @returns {{ ok: true, expression: string, result: number }
 *          | { ok: false, error: keyof typeof CALC_ERRORS }}
 */
export function calculate(input) {
    if (!input || !input.trim()) {
        return { ok: false, error: "EMPTY" };
    }

    const expression = normalize(input);

    try {
        const result = evaluate(expression);

        if (typeof result !== "number") return { ok: false, error: "NOT_NUMBER" };
        if (!Number.isFinite(result)) return { ok: false, error: "NOT_FINITE" };

        return { ok: true, result, expression };
    } catch {
        return { ok: false, error: "SYNTAX" };
    }
}
