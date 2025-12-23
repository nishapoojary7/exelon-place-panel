import { useState, useEffect, useRef } from "react";
import placeData from "../data/placeData";
import "../index.css";

export default function PlacePanel() {
  const [loading, setLoading] = useState(true);
  const [showHours, setShowHours] = useState(false);
  const [panelOffset, setPanelOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef(null);
  const startY = useRef(0);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Prevent body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = panelOffset < 100 ? 'hidden' : '';
    return () => { 
      document.body.style.overflow = ''; 
    };
  }, [panelOffset]);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0) {
      setPanelOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged down more than 150px, close it
    if (panelOffset > 150) {
      setPanelOffset(window.innerHeight);
    } else {
      setPanelOffset(0);
    }
  };

  const closePanel = () => {
    setPanelOffset(window.innerHeight);
  };

  if (loading) {
    return <div className="panel loading">Loading place details…</div>;
  }

  return (
    <>
      <div
        className="overlay"
        style={{
          opacity: panelOffset === 0 ? 0.3 : 0,
          pointerEvents: panelOffset === 0 ? "auto" : "none"
        }}
        onClick={closePanel}
      />

      <div
        className={`panel show ${isDragging ? "dragging" : ""}`}
        ref={panelRef}
        style={{
          transform: `translateY(${panelOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
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
          </span>
          {" "} · 9:00 AM – 6:00 PM
          <span className={`arrow ${showHours ? "up" : "down"}`}>▼</span>
        </div>

        <ul className={`hours-list ${showHours ? "show" : ""}`}>
          {Object.entries(placeData.hours).map(([day, time]) => (
            <li key={day}>
              <strong>{day}</strong>: {time}
            </li>
          ))}
        </ul>

        {/* Photo Gallery */}
        <div className="gallery">
          {placeData.images.map((img, index) => (
            <img key={index} src={img} alt={`place-${index}`} />
          ))}
        </div>
      </div>
    </>
  );
}