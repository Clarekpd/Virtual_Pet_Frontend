import { useState, useContext } from "react";
import { ThemeContext, themes } from "./ThemeContext";

export default function SettingsPanel({ show, onClose }) {
  const [petNamePopup, setPetNamePopup] = useState(false);
  const [themePopup, setThemePopup] = useState(true);
  const { theme, changeTheme } = useContext(ThemeContext);

  const handleTheme = () => {
    setThemePopup((prev) => !prev);
    setPetNamePopup(false);
  };

  const handlePetName = () => {
    setPetNamePopup((prev) => !prev);
    setThemePopup(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`settings-overlay ${show ? "show" : ""}`}
        style={{
          backgroundColor: show ? "rgba(0, 0, 0, 0.5)" : "transparent",
          transition: "background-color 0.3s ease",
        }}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className={`settings-panel rounded ${show ? "open" : ""}`}
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          border: `2px solid ${theme.border}66`,
          transition: "all 0.3s ease",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center p-3 border-bottom"
          style={{
            borderColor: theme.border,
          }}
        >
          <h5 className="m-0" style={{ color: theme.text }}>
            Settings
          </h5>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onClose}
            style={{
              color: theme.text,
              border: "0px",
              borderColor: theme.border,
              backgroundColor: theme.background,
            }}
          >
            ✖
          </button>
        </div>

        <div className="m-3 py-2">
          <button
            onClick={handleTheme}
            className="btn rounded"
            style={{
              backgroundColor: theme.accent,
              color: "#fff",
              border: `1px solid ${theme.border}`,
            }}
          >
            Change Theme
          </button>

          {themePopup && (
            <div className="mt-3">
              <p>Select a theme:</p>
              <div className="d-flex flex-wrap gap-2">
                {Object.keys(themes).map((key) => (
                  <button
                    key={key}
                    onClick={() => changeTheme(key)}
                    className="btn rounded"
                    style={{
                      backgroundColor: themes[key].background,
                      color: themes[key].accent,
                      border: `.5px solid ${themes[key].border}`,
                    }}
                  >
                    {themes[key].name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
