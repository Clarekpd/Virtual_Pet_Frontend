import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";

export default function PetDetail() {
  const { name } = useParams();
  const [pet, setPet] = useState(null);
  const [nickname, setNickname] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [show, setShow] = useState(true);
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
      // pick up any locally-stored nickname
      setNickname(found.nickname || "");
    }
    setPet(found);
  }, [name]);

  // Try to fetch user's petNicknames when token is available
  useEffect(() => {
    async function fetchUserNicknames() {
      if (!pet) return;
      const token = localStorage.getItem("token");
      if (!token) return; // no auth

      try {
        const res = await fetch("http://localhost:8081/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const petKey = pet._id || pet.id || pet.name;
        const pn = (data.petNicknames || []).find((p) => String(p.petId) === String(petKey));
        if (pn) setNickname(pn.nickname || "");
      } catch (e) {
        console.warn("Could not fetch user nicknames:", e.message);
      }
    }

    fetchUserNicknames();
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

  return (
    <div className="m-2 py-2 d-flex justify-content-center">
      <div
        className="d-flex flex-wrap gap-4 align-items-start"
        style={{ color: theme.text }}
      >
        <div
          className="d-flex flex-column align-items-center text-center position-relative"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <h2>{pet.name}</h2>
          {nickname && (
            <h5 style={{ color: theme.text, fontStyle: "italic" }}>“{nickname}”</h5>
          )}
          <img
            src={"/" + pet.img}
            alt={pet.name}
            width="300"
            className="rounded"
          />
          <div className="w-100 mt-3 d-flex flex-column align-items-center">
            <div className="mb-2 w-100" style={{ maxWidth: 340 }}>
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
                onClick={async () => {
                  setStatusMsg("");
                  const petKey = pet._id || pet.id || pet.name;
                  const token = localStorage.getItem("token");
                  if (token) {
                    try {
                      const res = await fetch("http://localhost:8081/user/pet-nickname", {
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
                      // update local storage copy too
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
                    // no auth: save locally
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
                className="btn btn-secondary"
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
          {goodIcon && (
            <img
              src={goodIcon}
              alt="status icon"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "60px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
