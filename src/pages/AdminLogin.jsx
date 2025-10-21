import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { postData } from "../common/axiosInstance";


const AdminLogin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await postData("/auth/login", {
                username: email,
                password: password
            });
            console.log("login response:", res);

            const token =
                res?.token ||
                res?.access_token ||
                res?.data?.token ||
                res?.data?.access_token;

            if (!token) {
                throw new Error("No token in response: " + JSON.stringify(res));
            }

            // persist + set header immediately for future requests
            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // go to dashboard
            navigate("/", { replace: true });
        } catch (err) {
            console.error("LOGIN ERROR:", err?.response?.data || err);
            const payload = err?.response?.data;

            let msg = "";
            if (Array.isArray(payload?.detail)) {
                msg = payload.detail.map(d => d?.msg || JSON.stringify(d)).join(", ");
            } else if (payload?.detail) {
                msg = typeof payload.detail === "string"
                    ? payload.detail
                    : payload.detail?.msg || JSON.stringify(payload.detail);
            } else {
                msg = payload?.message || payload?.error ||
                    (typeof payload === "string" ? payload : "") ||
                    err.message || "Login failed";
            }

            setError(msg);
        }

    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
                <h1 className="text-2xl text-center mb-8 text-gray-700">
                    Welcome to <span className="font-semibold text-gray-900">Belancer Admin</span>
                </h1>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@domain.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="*********"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700"
                        />
                    </div>

                    <div>
                        <button className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-md transition-colors duration-200 uppercase tracking-wide"
                    >
                        Submit
                    </button>
                </div>

                <p className="text-center text-gray-600 mt-6 text-sm">
                    Don't have login?{' '}
                    <button className="text-gray-900 hover:text-teal-600 font-medium transition-colors">
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;