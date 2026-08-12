import React, { useEffect } from "react";
import "./Intro.css";

const Intro = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        window.location.href = "/home";
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="intro">

      {/* AURORA + STARFIELD BACKDROP */}
      <div className="aurora">
        <span className="a1"></span>
        <span className="a2"></span>
        <span className="a3"></span>
      </div>
      <div className="stars"></div>

      {/* STYLIZED GLOBE */}
      <div className="globe-wrap globe-fade">
        <div className="globe-sphere"></div>
        <div className="globe-grid">
          <div className="lat lat1"></div>
          <div className="lat lat2"></div>
          <div className="lon lon1"></div>
          <div className="lon lon2"></div>
        </div>
      </div>

      {/* FLIGHT ROUTE */}
      <svg
        className="route-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="route-path"
          d="M12 74 Q50 15 85 37"
          pathLength="100"
        />
      </svg>
      <div className="route-dot origin"></div>
      <div className="route-dot dest"></div>

      {/* PLANE (Flipped to point forward along the trajectory) */}
      <div className="plane-wrap">
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 34 L6 8 L26 34 L6 58 Z" fill="#ffffff" />
          <path d="M26 34 L46 40 L60 34 Z" fill="#10b981" />
        </svg>
      </div>

      {/* TRIPNEST BRAND */}
      <div className="brand">
        <div className="brand-name">
          <span className="trip">TRIP</span>
          <span className="nest">NEST</span>
        </div>

        <div className="brand-divider">
          <span></span>
          <div>✈</div>
          <span></span>
        </div>

        <div className="tagline">
          Explore India and The World
        </div>
      </div>

      {/* REDIRECT */}
      <div className="redirect">
        <div className="dot-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Redirecting to your journey...</p>
      </div>

    </div>
  );
};

export default Intro;