import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import SettingsPanel from "./SettingsPanel.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || null);
  }, []);

  return (
    <>
      <Nav className="navbar navbar-expand bg-dark navbar-dark mb-3 px-2">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/")}
        >
          Care for Your Pets
        </button>
        <button
          className="btn btn-outline-light ms-2"
          onClick={() => navigate("/about")}
        >
          About Us
        </button>
        <div style={{
          position: "absolute",
          bottom: "10px",
          right: "65px",
        }}>
          {username ? (
            <>
              <span style={{ color: "#fff", marginRight: 8 }}>Hi, {username}</span>
              <button className="btn btn-outline-light ms-2" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('username'); setUsername(null); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-light ms-2" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-outline-light ms-2" onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>
        <button
          className="btn btn-outline-light"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
          }}
          onClick={() => setShowSettings(true)}
        >
          ⚙️
        </button>
      </Nav>

      <SettingsPanel show={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
