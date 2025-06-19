import { useState, type FC } from "react";
import Shade from "./Shade";
import "./App.css";

// Demo components to showcase Shade library
const LibraryIntro: FC = () => (
  <div className="welcome-card">
    <h2 className="welcome-card-title">📦 Shade Library</h2>
    <p className="welcome-card-description">
      A React component that adds stunning shader-based glow effects to any HTML
      content using Three.js and React Three Fiber.
    </p>
    <ul className="welcome-card-list">
      <li>🎨 HTML to 3D texture conversion</li>
      <li>✨ Real-time glow effects</li>
      <li>🔥 Zero configuration needed</li>
      <li>⚡ Automatic content detection</li>
    </ul>
  </div>
);

const WithShadeExample: FC<{ interactiveText: string }> = ({
  interactiveText,
}) => (
  <div className="feature-card">
    <h3 className="feature-card-title">✨ With Shade Effects</h3>
    <p className="feature-card-description">
      This card is wrapped with the Shade component and gets beautiful glow
      effects automatically applied.
    </p>
    <div className="feature-card-features">
      <strong>🎯 What you get:</strong>
      <br />• Bloom post-processing effects
      <br />• Automatic HTML-to-texture conversion
      <br />• Performance-optimized rendering
      <br />• Seamless React integration
      <br />
      <br />
      <strong>State from other card:</strong>
      <br />
      <span
        style={{
          display: "inline-block",
          marginTop: "0.5rem",
          padding: "0.5rem",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "0.25rem",
        }}
      >
        {interactiveText}
      </span>
    </div>
  </div>
);

const InteractiveDemo: FC<{
  setInteractiveText: (text: string) => void;
}> = ({ setInteractiveText }) => (
  <div
    className="feature-card"
    style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
  >
    <h3 className="feature-card-title">🎮 Interactive Elements</h3>
    <p className="feature-card-description">
      Even interactive content gets the glow treatment! Buttons, forms, and
      dynamic content all work seamlessly.
    </p>
    <div className="feature-card-features">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const text = formData.get("text-input") as string;
          setInteractiveText(text || "This text is reactive! ✨");
          e.currentTarget.reset();
        }}
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <input
          name="text-input"
          type="text"
          placeholder="Type to update other card..."
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.3)",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            color: "white",
            flex: 1,
          }}
        />
        <button
          type="submit"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.3)",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Update
        </button>
      </form>
      <button
        style={{
          background: "rgba(255,255,255,0.2)",
          border: "2px solid rgba(255,255,255,0.3)",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => alert("Shade works with interactive content!")}
      >
        Click me! 🚀
      </button>
      <img
        src="./image.jpg"
        className="image"
        onLoad={(el) => {
          //on load set the height of this img element to the actual height
          el.currentTarget.style.height = `${el.currentTarget.offsetHeight}px`;
        }}
      />
    </div>
  </div>
);

const CodeExample: FC = () => (
  <div
    className="feature-card"
    style={{
      background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      color: "#333",
    }}
  >
    <h3 className="feature-card-title" style={{ color: "#333" }}>
      💻 Simple Integration
    </h3>
    <p className="feature-card-description" style={{ color: "#555" }}>
      Just wrap any component with Shade - it's that simple!
    </p>
    <div
      className="feature-card-features"
      style={{ background: "rgba(0,0,0,0.1)", color: "#333" }}
    >
      <code
        style={{
          fontSize: "0.9rem",
          display: "block",
          fontFamily: "monospace",
        }}
      >
        {`<Shade>
  <YourComponent />
</Shade>`}
      </code>
    </div>
  </div>
);

const FeatureComparison: FC = () => (
  <div className="regular-content-card">
    <h3>🔍 Without Shade Effects</h3>
    <p>
      This is regular HTML content without any Shade wrapper. Notice the
      difference in visual impact compared to the glowing components above.
    </p>
    <p>
      <strong>Standard features:</strong>
      <br />• Regular CSS styling
      <br />• No post-processing effects
      <br />• Standard DOM rendering
    </p>
    <p style={{ fontSize: "0.9rem", opacity: 0.7, marginTop: "1rem" }}>
      💡{" "}
      <em>
        Tip: Compare this card with the ones above to see Shade's visual
        enhancement in action!
      </em>
    </p>
  </div>
);

// Main App component
const App: FC = () => {
  const [interactiveText, setInteractiveText] = useState(
    "This text is reactive! ✨"
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">React Shade</h1>
        <p className="app-subtitle">
          Wrap any component with Shade to add shader effects.
        </p>
      </header>

      {/* Demo Content */}
      <div className="content-grid">
        <LibraryIntro />
        <div className="column">
          <Shade>
            <WithShadeExample interactiveText={interactiveText} />
          </Shade>
          <Shade>
            <CodeExample />
          </Shade>
        </div>
        <Shade>
          <InteractiveDemo setInteractiveText={setInteractiveText} />
        </Shade>

        <FeatureComparison />
      </div>

      {/* Usage Instructions */}
      <div className="instructions-panel">
        <h4 className="instructions-title">🚀 Quick Start:</h4>
        <code className="instructions-code">
          {`import Shade from 'shade-react';
<Shade>
  <YourComponent />
</Shade>`}
        </code>
        <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: 0.8 }}>
          That's it! Shade automatically handles HTML-to-texture conversion and
          applies beautiful glow effects.
        </p>
      </div>
    </div>
  );
};

export default App;
