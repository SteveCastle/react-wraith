import React from "react";
import type { FC } from "react";
import HTMLToTexture from "./HTMLToTexture";

// Sample components to demonstrate usage
const WelcomeCard: FC = () => (
  <div
    style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem",
      borderRadius: "1rem",
      color: "white",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      margin: "1rem",
    }}
  >
    <h2 style={{ margin: "0 0 1rem 0", fontSize: "2rem" }}>
      Welcome to ThreeCanvas
    </h2>
    <p style={{ margin: "0 0 1rem 0", opacity: 0.9 }}>
      HTML content rendered with glow effects using @react-three/fiber!
    </p>
    <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
      <li>React Three Fiber ✨</li>
      <li>Custom Shaders 🔥</li>
      <li>HTML2Canvas 🎨</li>
    </ul>
  </div>
);

const FeatureCard: FC = () => (
  <div
    style={{
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      padding: "2rem",
      borderRadius: "1rem",
      color: "white",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      margin: "1rem",
      maxWidth: "400px",
    }}
  >
    <h3 style={{ margin: "0 0 1rem 0" }}>Interactive Features</h3>
    <p style={{ margin: "0 0 1rem 0", opacity: 0.9 }}>
      This card shows how any React component can have glow effects applied.
    </p>
    <div
      style={{
        background: "rgba(255,255,255,0.2)",
        padding: "1rem",
        borderRadius: "0.5rem",
        marginTop: "1rem",
      }}
    >
      <strong>✨ Features:</strong>
      <br />• Real-time HTML to texture conversion
      <br />• Automatic content change detection
      <br />• Customizable glow positioning
    </div>
  </div>
);

const GlowingButton: FC = () => (
  <button
    style={{
      background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
      border: "none",
      padding: "1rem 2rem",
      borderRadius: "2rem",
      color: "white",
      fontSize: "1.2rem",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      transition: "transform 0.2s",
      margin: "1rem",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    Click Me! ✨
  </button>
);

// Main App component
const App: FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 50%, #0f0f23 0%, #000000 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "3rem",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            margin: "0 0 1rem 0",
            background: "linear-gradient(45deg, #00ffff, #ff00ff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          HTML to 3D Glow Effects
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.8, margin: 0 }}>
          Wrap any component with HTMLToTexture to add shader-based glow effects
        </p>
      </header>

      {/* Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Card with glow effect */}
        <HTMLToTexture>
          <WelcomeCard />
        </HTMLToTexture>

        {/* Another card with different glow position */}
        <HTMLToTexture>
          <FeatureCard />
        </HTMLToTexture>

        {/* Regular content without glow */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "2rem",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.2)",
            margin: "1rem",
          }}
        >
          <h3>Regular Content</h3>
          <p>This content doesn't have glow effects applied.</p>
          <p>
            Only components wrapped with HTMLToTexture get the 3D shader
            treatment.
          </p>
        </div>
      </div>

      {/* Interactive elements */}
      <div
        style={{
          textAlign: "center",
          marginTop: "3rem",
        }}
      >
        <GlowingButton />
      </div>

      {/* Instructions */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "rgba(0,0,0,0.8)",
          padding: "1rem",
          borderRadius: "0.5rem",
          fontSize: "0.9rem",
          maxWidth: "300px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h4 style={{ margin: "0 0 0.5rem 0", color: "#00ffff" }}>Usage:</h4>
        <code
          style={{
            display: "block",
            background: "rgba(255,255,255,0.1)",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            fontSize: "0.8rem",
          }}
        >
          {`<HTMLToTexture
  glowPosition={[x, y, z]}
  glowScale={[x, y, z]}
>
  <YourComponent />
</HTMLToTexture>`}
        </code>
      </div>
    </div>
  );
};

export default App;
