export const currency = (n) => {
    if (n === null || n === undefined || n === "") return "—";
    const v = Number(n);
    if (Number.isNaN(v)) return String(n);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);
};

export const maybeBDT = (usd) => {
    const v = Number(usd);
    if (Number.isNaN(v)) return null;
    const fx = Number(localStorage.getItem("fx_usd_bdt"));
    if (!fx) return null;
    return new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(v * fx);
};
