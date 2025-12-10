import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ThemeContext } from "../ThemeContext";

export default function PetStatus() {
  const { name } = useParams();
  const [pet, setPet] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const storedPets = JSON.parse(localStorage.getItem("allPets")) || [];
    const found = storedPets.find((p) => p.name === name);
    if (found) {
      found.interactionModule = found.interactionModule.map((i) => ({
        ...i,
        value: 100,
        originalIncrement: i.increment,
      }));
    }
    setPet(found);

    // If authenticated, try to fetch user's nickname and merge
    (async () => {
      if (!found) return;
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8081/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const u = await res.json();
        const pn = u.petNicknames || [];
        const petKey = found._id || found.id || found.name;
        const match = pn.find((p) => String(p.petId) === String(petKey));
        if (match) {
          setPet((prev) => (prev ? { ...prev, nickname: match.nickname } : prev));
        }
      } catch (e) {
        console.warn("Could not fetch user nicknames in PetStatus", e.message);
      }
    })();
  }, [name]);

  useEffect(() => {
    if (!pet) return;

    const timers = pet.interactionModule.map((interaction) => {
      return setInterval(() => {
        setPet((prevPet) => {
          if (!prevPet) return prevPet;
          const updated = {
            ...prevPet,
            interactionModule: prevPet.interactionModule.map((i) =>
              i.status === interaction.status && i.value > 0
                ? { ...i, value: i.value - 1 }
                : i
            ),
          };

          const stored = JSON.parse(localStorage.getItem("allPets")) || [];
          const idx = stored.findIndex((p) => p.name === name);
          if (idx >= 0) stored[idx] = updated;
          localStorage.setItem("allPets", JSON.stringify(stored));

          return updated;
        });
      }, (Math.random() * (interaction.originalIncrement * 2000) + 100));
    });

    return () => timers.forEach(clearInterval);
  }, [pet?.name]);

  const handleAction = (interaction) => {
    setPet((prevPet) => {
      if (!prevPet) return prevPet;

      const updated = {
        ...prevPet,
        interactionModule: prevPet.interactionModule.map((i) =>
          i.status === interaction.status && i.value < 100
            ? { ...i, value: i.value + 3 }
            : i
        ),
      };

      const stored = JSON.parse(localStorage.getItem("allPets")) || [];
      const idx = stored.findIndex((p) => p.name === name);
      if (idx >= 0) stored[idx] = updated;
      localStorage.setItem("allPets", JSON.stringify(stored));

      return updated;
    });
  };

  const getBarColor = (interaction) => {
    const ratio = interaction.value / 100;
    if (ratio <= 0.3) return "danger";
    if (ratio <= 0.7) return "warning";
    return "success";
  };

  if (!pet)
    return (
      <div className="m-3 py-2">
        <p style={{ color: theme.text }}>Pet not found.</p>
      </div>
    );

  return (
    <div className="justify-content-center">
      <div className="m-3 py-2">
        <div
          className="rounded p-3"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            color: theme.text,
          }}
        >
          {pet.interactionModule.map((interaction, idx) => (
            <div key={idx} className="d-flex align-items-center gap-4 mb-3">
              {/* Interaction button */}
              <button
                className="btn"
                style={{
                  width: "25%",
                  backgroundColor: theme.accent,
                  color: "#fff",
                  border: `1px solid ${theme.border}`,
                }}
                onClick={() => handleAction(interaction)}
              >
                {interaction.action}
              </button>

              {/* Interaction label */}
              <p className="m-0" style={{ width: "10%", color: theme.text }}>
                {interaction.status}:
              </p>

              {/* Progress bar */}
              <div style={{ width: "60%" }}>
                <ProgressBar
                  variant={getBarColor(interaction)}
                  now={interaction.value}
                  style={{
                    height: "18px",
                    backgroundColor: theme.background,
                    border: "solid 2px",
                    borderColor: theme.border,
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}