export const TOKEN_KEY = "token";

export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Optional: role-aware checks
export function getJwtPayload() {
    try { return JSON.parse(atob((getToken() || "").split(".")[1])); } catch { return null; }
}
export const isTokenValid = () => {
    const p = getJwtPayload(); if (!p) return false;
    return !p.exp || p.exp * 1000 > Date.now();
};
export const isAdmin = () => {
    const p = getJwtPayload();
    if (!p) return false;

    const roleField = String(p.role || p.roles || "").toLowerCase();
    return (
        isTokenValid() &&
        (roleField.includes("admin") || roleField.includes("masteradmin"))
    );
};

