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
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="intro">

      {/* SKY */}
      <div className="sky"></div>

      {/* SUN */}
      <div className="sun"></div>

      {/* CLOUDS */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>
      <div className="cloud cloud4"></div>

      {/* MOUNTAINS */}
      <div className="mountains">
        <div className="mountain mountain1"></div>
        <div className="mountain mountain2"></div>
        <div className="mountain mountain3"></div>
      </div>

      {/* DISTANT AIRPORT */}
      <div className="airport">
        <div className="control-tower">
          <div className="tower-top"></div>
        </div>
      </div>

      {/* RUNWAY */}
      <div className="runway">
        <div className="runway-center"></div>
        <div className="runway-light light1"></div>
        <div className="runway-light light2"></div>
        <div className="runway-light light3"></div>
        <div className="runway-light light4"></div>
      </div>

      {/* PLANE */}
      <div className="plane">

        <svg
          viewBox="0 0 800 300"
          xmlns="http://www.w3.org/2000/svg"
        >

          {/* Main fuselage */}
          <path
            d="
              M80 145
              L560 145
              C625 145 680 151 730 169
              L760 180
              L730 190
              C675 181 620 178 560 178
              L80 178
              C50 178 25 165 10 155
              C25 148 50 145 80 145
              Z
            "
            fill="#f7f8fa"
          />

          {/* Upper fuselage */}
          <path
            d="
              M125 145
              C250 108 430 105 560 145
              Z
            "
            fill="#ffffff"
          />

          {/* Tail */}
          <path
            d="
              M135 145
              L80 68
              L150 120
              L185 145
              Z
            "
            fill="#182436"
          />

          {/* Green tail accent */}
          <path
            d="
              M105 100
              L145 130
              L170 145
              L130 145
              Z
            "
            fill="#10b981"
          />

          {/* Main wing */}
          <path
            d="
              M365 145
              L270 62
              L315 62
              L440 145
              Z
            "
            fill="#d9dee5"
          />

          {/* Lower wing */}
          <path
            d="
              M390 178
              L305 248
              L350 248
              L450 178
              Z
            "
            fill="#c7cdd5"
          />

          {/* Engines */}
          <ellipse
            cx="350"
            cy="178"
            rx="39"
            ry="15"
            fill="#303744"
          />

          <ellipse
            cx="450"
            cy="178"
            rx="39"
            ry="15"
            fill="#303744"
          />

          {/* Engine interiors */}
          <ellipse
            cx="350"
            cy="178"
            rx="18"
            ry="7"
            fill="#101820"
          />

          <ellipse
            cx="450"
            cy="178"
            rx="18"
            ry="7"
            fill="#101820"
          />

          {/* Windows */}
          <g fill="#26364d">

            <circle cx="195" cy="151" r="5" />
            <circle cx="215" cy="151" r="5" />
            <circle cx="235" cy="151" r="5" />
            <circle cx="255" cy="151" r="5" />
            <circle cx="275" cy="151" r="5" />
            <circle cx="295" cy="151" r="5" />
            <circle cx="315" cy="151" r="5" />
            <circle cx="335" cy="151" r="5" />
            <circle cx="355" cy="151" r="5" />
            <circle cx="375" cy="151" r="5" />
            <circle cx="395" cy="151" r="5" />
            <circle cx="415" cy="151" r="5" />
            <circle cx="435" cy="151" r="5" />
            <circle cx="455" cy="151" r="5" />
            <circle cx="475" cy="151" r="5" />
            <circle cx="495" cy="151" r="5" />

          </g>

          {/* Cockpit */}
          <path
            d="
              M560 145
              C625 145 680 151 730 169
              L660 166
              L560 160
              Z
            "
            fill="#26364d"
          />

          {/* TripNest green stripe */}
          <path
            d="
              M125 164
              L625 164
              L655 170
              L125 170
              Z
            "
            fill="#10b981"
          />

          {/* Landing wheels */}
          <circle
            className="wheel wheel1"
            cx="350"
            cy="195"
            r="8"
            fill="#111"
          />

          <circle
            className="wheel wheel2"
            cx="450"
            cy="195"
            r="8"
            fill="#111"
          />

        </svg>

      </div>

      {/* LANDING SMOKE */}
      <div className="landing-smoke smoke1"></div>
      <div className="landing-smoke smoke2"></div>

      {/* LANDING LIGHT */}
      <div className="landing-light"></div>

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

        <div className="loader">
          <div className="loader-plane">✈</div>
        </div>

        <p>Redirecting to your journey...</p>

      </div>

      {/* FOOTER */}
      <div className="bottom-text">
        6 seconds of journey. A lifetime of memories.
      </div>

    </div>
  );
};

export default Intro;