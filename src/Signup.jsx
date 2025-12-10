import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:8081/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Signup failed");
                return;
            }
            // after signup, auto-login by calling login endpoint
            const lres = await fetch("http://localhost:8081/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const ldata = await lres.json();
            if (lres.ok) {
                localStorage.setItem("token", ldata.token);
                localStorage.setItem("username", ldata.username || username);
            }
            navigate("/");
        } catch (e) {
            setError("Network error");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button className="btn btn-primary" type="submit">Sign Up</button>
                </form>
            </div>
        </>
    );
}
