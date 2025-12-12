import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { ThemeContext } from "./ThemeContext";

export default function PetsList() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // fetch pets from backend API (MongoDB)
    async function loadPets() {
      try {
        const res = await fetch("http://localhost:8081/pets");
        const data = await res.json();
        let items = [];
        if (Array.isArray(data)) items = data;
        else if (data.pets) items = data.pets;
        else if (data.data) items = data.data;
        else items = Object.values(data);

        // merge user petNicknames when authenticated
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const ures = await fetch("http://localhost:8081/user", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (ures.ok) {
              const user = await ures.json();
              const pn = user.petNicknames || [];
              // petId may be _id, id, or name depending on data; normalize by string
              items = items.map((it) => {
                const key = it._id || it.id || it.name;
                const match = pn.find((p) => String(p.petId) === String(key));
                return match ? { ...it, nickname: match.nickname } : it;
              });
            }
          } catch (e) {
            console.warn("Could not fetch user to merge nicknames", e.message);
          }
        }

        setPets(items);
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
    }

    loadPets();
  }, []);

  const handleSelect = (pet) => {
    localStorage.setItem("allPets", JSON.stringify(pets));
    navigate(`/pet/${encodeURIComponent(pet.name)}`);
  };

  const filteredPets = pets.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <title>Pet Picker</title>
      <Navbar />
      <div
        className="m-3 py-3 px-4 rounded"
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          minHeight: "100vh",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search for a pet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: `1px solid ${theme.border}`,
          }}
        />

        <div className="row" id="card-container">
          {filteredPets.length === 0 ? (
            <div className="col-12" style={{ text: theme.text }}>No pets to adopt!</div>
          ) : (
            filteredPets.map((pet, i) => (
              <div key={i} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    backgroundColor: theme.background,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    transition: "background-color 0.3s ease, color 0.3s ease",
                  }}
                >
                  <img
                    src={
                      pet.img ||
                      "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={pet.name}
                    className="card-img-top"
                    style={{
                      objectFit: "contain",
                      height: "250px",
                      backgroundColor: theme.border + "22",
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title" style={{ color: theme.text }}>
                      {pet.nickname || pet.name}
                    </h5>
                    {pet.nickname && (
                      <div style={{ fontStyle: "italic", color: theme.text }}>{pet.name}</div>
                    )}
                    <p className="mb-3 mt-2">
                      <strong>Care Information:</strong>{" "}
                      {pet.interactionModule
                        .map((i) => i.action)
                        .join(", ") || "Unknown"}
                    </p>
                    <button
                      className="btn mt-auto"
                      onClick={() => handleSelect(pet)}
                      style={{
                        backgroundColor: theme.accent,
                        color: "#fff",
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      Care for {pet.nickname || pet.name}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
