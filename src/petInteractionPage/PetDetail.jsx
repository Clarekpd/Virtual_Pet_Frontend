import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { API_BASE_URL } from "../config";

export default function PetDetail() {
  const { name } = useParams();
  const [pet, setPet] = useState(null);
  const [nickname, setNickname] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [show, setShow] = useState(false);
  const [goodIcon, setGoodIcon] = useState(null);
  const wasAllGood = useRef(false);
  const { theme } = useContext(ThemeContext);

  const goodIcons = [
    "/icons/good/food_full.svg",
    "/icons/good/heart.svg",
    "/icons/good/leaf.svg",
    "/icons/good/toy.svg",
  ];

  useEffect(() => {
    const storedPets = JSON.parse(localStorage.getItem("allPets")) || [];
    const found = storedPets.find((p) => p.name === name);
    if (found) {
      found.interactionModule = found.interactionModule.map((i) => ({
        ...i,
        originalIncrement: i.increment,
      }));
      setNickname(found.nickname || "");
    }
    setPet(found);
  }, [name]);

  // Polling for pet updates
  useEffect(() => {
    const interval = setInterval(() => {
      const storedPets = JSON.parse(localStorage.getItem("allPets")) || [];
      const found = storedPets.find((p) => p.name === name);
      if (found) setPet(found);
    }, 1000);
    return () => clearInterval(interval);
  }, [name]);

  // Check if all stats are good
  useEffect(() => {
    if (!pet) return;

    const allGood = pet.interactionModule.every(
      (i) =>
        (i.value ?? i.increment) /
        ((i.originalIncrement ?? i.increment) || 1) >=
        0.7
    );

    if (allGood && !wasAllGood.current) {
      const randomIndex = Math.floor(Math.random() * goodIcons.length);
      setGoodIcon(goodIcons[randomIndex]);
      wasAllGood.current = true;
    } else if (!allGood) {
      setGoodIcon(null);
      wasAllGood.current = false;
    }
  }, [pet]);

  if (!pet)
    return (
      <div
        className="m-3 py-2"
        style={{ display: "flex", justifyContent: "center", color: theme.text }}
      >
        <p>Pet not found.</p>
      </div>
    );


  const lowStat = pet.interactionModule.find(
    (i) =>
      (i.value ?? i.increment) /
      ((i.originalIncrement ?? i.increment) || 1) <=
      0.1
  );

  function handleView() {
    setShow(!show);
  }

  return (
    <>
      <div className="m-2 py-2 d-flex justify-content-center">
        <div
          className="d-flex flex-wrap gap-4 align-items-start"
          style={{ color: theme.text }}
        >
          <div className="d-flex flex-column align-items-center text-center position-relative">
            <h2 style={{ color: theme.text }}>{nickname || pet.name}</h2>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
                backgroundColor: theme.cardBg,
                padding: "10px",
              }}
            >
              <img
                src={
                  pet.img
                    ? "/" + pet.img
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={pet.name}
                width="300"
                className="rounded"
                style={{ objectFit: "contain" }}
              />
              {(lowStat || goodIcon) && (
                <img
                  src={lowStat ? "/" + lowStat.svgBad : goodIcon}
                  alt="status icon"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                    zIndex: 5,
                  }}
                />
              )}
            </div>
          </div>

          {show && (
            <div style={{ width: "300px", color: theme.text }}>
              <h3 style={{ textAlign: "center", color: theme.text }}>Pet Information</h3>
              <p>
                <strong>Name:</strong> {pet.nickname || pet.name || "Unknown"}
              </p>
              <p>
                <strong>Species:</strong> {pet.type || "Unknown"}
              </p>
              <p>
                <strong>Interactions:</strong>{" "}
                {pet.interactionModule
                  .map((i) => `${i.action}`)
                  .join(", ") || "Unknown"}
              </p>

              <div className="w-100 mt-3 d-flex flex-column align-items-center">
                <div className="mb-2 w-100">
                  <label style={{ color: theme.text }}>Pet nickname</label>
                  <input
                    className="form-control"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Give your pet a nickname"
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    style={{
                      backgroundColor: theme.accent,
                      color: "#fff",
                      border: `1px solid ${theme.border}`,
                    }}
                    onClick={async () => {
                      setStatusMsg("");
                      const petKey = pet._id || pet.id || pet.name;
                      const token = localStorage.getItem("token");
                      if (token) {
                        try {
                          const res = await fetch(`${API_BASE_URL}user/pet-nickname`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ petId: petKey, nickname }),
                          });
                          if (!res.ok) {
                            const err = await res.json();
                            setStatusMsg(err.error || "Failed to save nickname");
                            return;
                          }
                          const stored = JSON.parse(localStorage.getItem("allPets")) || [];
                          const idx = stored.findIndex((p) => (p._id || p.id || p.name) === petKey);
                          if (idx >= 0) {
                            stored[idx].nickname = nickname;
                            localStorage.setItem("allPets", JSON.stringify(stored));
                          }
                          setStatusMsg("Nickname saved");
                        } catch (e) {
                          console.error(e);
                          setStatusMsg("Network error");
                        }
                      } else {
                        const stored = JSON.parse(localStorage.getItem("allPets")) || [];
                        const idx = stored.findIndex((p) => (p._id || p.id || p.name) === petKey);
                        if (idx >= 0) {
                          stored[idx].nickname = nickname;
                          localStorage.setItem("allPets", JSON.stringify(stored));
                          setStatusMsg("Nickname saved locally (login to persist)");
                        } else {
                          setStatusMsg("Could not find pet to save nickname locally");
                        }
                      }
                    }}
                  >
                    Save nickname
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    style={{ color: theme.text, borderColor: theme.border }}
                    onClick={() => {
                      setNickname("");
                      setStatusMsg("");
                    }}
                  >
                    Clear
                  </button>
                </div>
                {statusMsg && <small style={{ color: theme.text }}>{statusMsg}</small>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="align-items-center text-center">
        <button
          className="btn btn-outline-secondary"
          style={{ color: theme.text, borderColor: theme.border }}
          onClick={handleView}
        >
          Toggle Pet Info
        </button>
      </div>
    </>
  );
}
