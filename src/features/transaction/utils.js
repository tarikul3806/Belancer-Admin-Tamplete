export const pad2 = (n) => String(n).padStart(2, "0");

export function formatDateParts(iso) {
    if (!iso) return { date: "—", time: "" };
    const d = new Date(iso);
    if (isNaN(d)) return { date: "—", time: "" };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = `${pad2(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;

    let hrs = d.getHours();
    const mins = pad2(d.getMinutes());
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;
    const time = `${pad2(hrs)}:${mins} ${ampm}`;
    return { date, time };
}

export const statusClasses = {
    confirmed: "text-green-600",
    success: "text-green-600",
    pending: "text-yellow-600",
    rejected: "text-red-600",
    failed: "text-red-600",
    cancelled: "text-red-600",
};

export const toMoney = (n, currency = "USD") => {
    const num = Number(n);
    if (isNaN(num)) return currency === "BDT" ? "৳0.00" : "$0.00";
    const symbol = currency === "BDT" ? "৳" : "$";
    const sign = num < 0 ? "-" : "";
    return `${sign}${symbol}${Math.abs(num).toFixed(2)}`;
};

const normalize = (v) => String(v || "").toLowerCase();

export const getAmountPresentation = (actionRaw, statusRaw, amount, currency = "USD") => {
    const action = normalize(actionRaw);
    const status = normalize(statusRaw);
    const base = toMoney(Math.abs(Number(amount || 0)), currency);

    const isSuccess = status === "success" || status === "confirmed";
    const isPending = status === "pending" || status === "processing";
    const isFailedLike = ["failed", "cancelled", "canceled", "rejected"].includes(status);

    let text = base;
    let cls = "text-gray-600";
    let aria = `${action} ${status || "unknown"}`;

    if (isSuccess) {
        if (action === "deposit") { text = `+${base}`; cls = "text-green-600"; aria = "Credit amount (success)"; }
        if (action === "withdrawal") { text = `-${base}`; cls = "text-red-600"; aria = "Debit amount (success)"; }
    } else if (isPending) {
        text = base;
        cls = "text-yellow-600";
        aria = `${action} pending`;
    } else if (isFailedLike) {
        text = base;
        cls = "text-red-600";
        aria = `${action} ${status}`;
    }

    return { text, cls, aria };
};
