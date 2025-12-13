import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { ThemeContext } from "./ThemeContext";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { theme } = useContext(ThemeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8081/user/password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to change password");
                return;
            }
            setSuccess("Password changed — you'll need to sign in again.");
            // Clear local token and force re-login
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setError("Network error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className="container mt-5 mb-5">
            <div className="card mx-auto" style={{ maxWidth: 540, backgroundColor: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }}>
                <div className="card-header" style={{ backgroundColor: theme.background, borderBottom: `1px solid ${theme.border}` }}>
                    <h5 className="mb-0">Change Password</h5>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" style={{ color: theme.text }}>Current password</label>
                            <input type="password" className="form-control" style={{ backgroundColor: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" style={{ color: theme.text }}>New password</label>
                            <input type="password" className="form-control" style={{ backgroundColor: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" style={{ color: theme.text }}>Confirm new password</label>
                            <input type="password" className="form-control" style={{ backgroundColor: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn" style={{ backgroundColor: theme.accent, color: theme.text, border: `1px solid ${theme.accent}` }} disabled={loading}>{loading ? 'Saving...' : 'Change Password'}</button>
                            <button type="button" className="btn btn-outline-secondary" style={{ color: theme.text, borderColor: theme.border, backgroundColor: 'transparent' }} onClick={() => navigate('/')}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}
