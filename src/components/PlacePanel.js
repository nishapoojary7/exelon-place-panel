import { useState, useEffect, useRef } from "react";
import placeData from "../data/placeData";

export default function PlacePanel() {
  const [loading, setLoading] = useState(true);
  const [showHours, setShowHours] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const panelRef = useRef(null);
  const startY = useRef(0);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const handleTouchStart = (e) => {
    setDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0) setTranslateY(deltaY);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    if (translateY > 150) {
      // close the panel
      panelRef.current.style.transform = `translateY(100%)`;
    } else {
      setTranslateY(0);
    }
  };

  if (loading) {
    return <div className="panel loading">Loading place details…</div>;
  }

  return (
    <>
      <div
        className="overlay"
        style={{ opacity: translateY === 0 ? 0.3 : 0, pointerEvents: translateY === 0 ? "auto" : "none" }}
        onClick={() => (panelRef.current.style.transform = "translateY(100%)")}
      ></div>

      <div
        className={`panel ${!loading ? "show" : ""}`}
        ref={panelRef}
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle Bar */}
        <div className="handle-bar"></div>

        {/* Header */}
        <div className="panel-header">
          <h1 className="title">{placeData.name}</h1>
          <p className="address">{placeData.address}</p>
          <div className="rating">⭐ {placeData.rating} ({placeData.reviews})</div>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button onClick={() => window.open("tel:+919148448704")}>Call</button>
          <button onClick={() => window.open("https://exeloncircuits.com/", "_blank")}>
            Website
          </button>
          <button
            onClick={() =>
              window.open(
                "https://www.google.com/maps/dir/?api=1&destination=Exelon+Circuits+Pvt+Ltd,+Second+Floor,+MELRIC,+Old+Post+Office+Rd,+Iddya,+Surathkal,+Mangaluru,+Karnataka+575014",
                "_blank"
              )
            }
          >
            Directions
          </button>
        </div>

        {/* Status & Hours */}
        <div
          className={`hours ${showHours ? "expanded" : ""}`}
          onClick={() => setShowHours(!showHours)}
        >
          <span className={`status ${placeData.status === "Open" ? "open" : "closed"}`}>
            {placeData.status}
          </span>{" "}
          · 9:00 AM – 6:00 PM
          <span className={`arrow ${showHours ? "up" : "down"}`}>▼</span>
        </div>

        <ul className={`hours-list ${showHours ? "show" : ""}`}>
          {Object.entries(placeData.hours).map(([day, time]) => (
            <li key={day}>
              <strong>{day}</strong>: {time}
            </li>
          ))}
        </ul>

        {/* Scroll Snap Gallery */}
        <div className="gallery">
          {placeData.images.map((img, index) => (
            <img key={index} src={img} alt={`place-${index}`} />
          ))}
        </div>
      </div>
    </>
  );
}
