import { useState, type FC } from "react";
import Wraith from "./Wraith";
import "./App.css";
import { BlendFunction } from "postprocessing";

// Demo components to showcase Wraith library
const LibraryIntro: FC = () => (
  <div className="welcome-card">
    <h2 className="welcome-card-title">📦 Wraith Library</h2>
    <p className="welcome-card-description">
      A React component that adds stunning shader-based glow effects to any HTML
      content using Three.js and React Three Fiber.
    </p>
    <ul className="welcome-card-list">
      <li>🎨 HTML to 3D texture conversion</li>
      <li>✨ Real-time post processing shader effects</li>
      <li>🔥 Zero configuration needed</li>
      <li>⚡ Automatic content detection</li>
    </ul>
  </div>
);

const WithWraithExample: FC<{ interactiveText: string }> = ({
  interactiveText,
}) => (
  <div className="feature-card">
    <h3 className="feature-card-title">✨ With Wraith Effects</h3>
    <p className="feature-card-description">
      This card is wrapped with the Wraith component and gets beautiful glow
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
        onClick={() => alert("Wraith works with interactive content!")}
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
      <img
        src="./image2.jpg"
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
      Just wrap any component with Wraith - it's that simple!
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
        {`<Wraith>
  <YourComponent />
</Wraith>`}
      </code>
    </div>
  </div>
);

// NEW COMPONENT: demonstrates configuration options
const ConfigOptionsExample: FC = () => (
  <div
    className="feature-card"
    style={{
      background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      color: "#333",
    }}
  >
    <h3 className="feature-card-title" style={{ color: "#333" }}>
      ⚙️ Configuration Options
    </h3>
    <p className="feature-card-description" style={{ color: "#555" }}>
      Fine-tune the visual effects by passing an <code>effects</code> prop to
      Wraith.
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
        {`<Wraith
  effects={{
    bloom: { enabled: true, intensity: 1.2 },
    pixelation: { enabled: false },
    chromaticAberration: {
      enabled: true,
      offset: new Vector2(0.005, 0.005),
    },
  }}
>
  <YourComponent />
</Wraith>`}
      </code>
    </div>
  </div>
);

const FeatureComparison: FC = () => (
  <div className="regular-content-card author-card">
    <div className="author-info">
      <Wraith
        effects={{
          pixelation: { enabled: true, granularity: 4 },
          noise: {
            enabled: true,
            opacity: 0.9,
            blendFunction: BlendFunction.ADD,
          },
        }}
      >
        <img src="me.jpg" alt="Steve Castle avatar" className="author-avatar" />
      </Wraith>

      <div className="author-text">
        <h3 className="author-heading">👋 About the Author</h3>
        <p>
          Hi, I'm <strong>Steve Castle</strong> — thanks for checking out this
          demo!
        </p>
        <ul className="author-links">
          <li>
            📂{" "}
            <a
              href="https://github.com/placeholder"
              target="_blank"
              rel="noopener noreferrer"
            >
              Project GitHub Repository
            </a>
          </li>
          <li>
            🎥{" "}
            <a
              href="https://youtube.com/placeholder"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch the YouTube Tutorial
            </a>
          </li>
          <li>
            📝{" "}
            <a
              href="https://codesandbox.io/placeholder"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try the CodeSandbox Demo
            </a>
          </li>
          <li>
            ☕{" "}
            <a
              href="https://patreon.com/placeholder"
              target="_blank"
              rel="noopener noreferrer"
            >
              Support me on Patreon
            </a>
          </li>
        </ul>
      </div>
    </div>
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
        <Wraith
          effects={{
            pixelation: {
              enabled: false,
            },
            chromaticAberration: {
              enabled: true,
            },
            glitch: {
              enabled: true,
            },
          }}
        >
          <h1 className="app-title">React Wraith</h1>
        </Wraith>
        <p className="app-subtitle">
          Wrap any component with Wraith to add shader effects.
        </p>
      </header>

      {/* Demo Content */}
      <div className="content-grid">
        <LibraryIntro />
        <div className="column">
          <Wraith>
            <WithWraithExample interactiveText={interactiveText} />
          </Wraith>
          <Wraith>
            <CodeExample />
          </Wraith>
          <Wraith
            effects={{
              bloom: { enabled: true, intensity: 0.7 },
              pixelation: { enabled: true, granularity: 1 },
              noise: {
                enabled: true,
                opacity: 0.5,
                blendFunction: BlendFunction.OVERLAY,
              },
              chromaticAberration: {
                enabled: false,
              },
            }}
          >
            <ConfigOptionsExample />
          </Wraith>
        </div>
        <Wraith
          effects={{
            bloom: {
              enabled: false,
            },
          }}
        >
          <InteractiveDemo setInteractiveText={setInteractiveText} />
        </Wraith>

        <FeatureComparison />
      </div>

      {/* Usage Instructions */}
      <div className="instructions-panel">
        <h4 className="instructions-title">🚀 Quick Start:</h4>
        <code className="instructions-code">
          {`import Wraith from 'wraith-react';
<Wraith>
  <YourComponent />
</Wraith>`}
        </code>
        <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: 0.8 }}>
          That's it! Wraith automatically handles HTML-to-texture conversion and
          applies beautiful glow effects.
        </p>
      </div>
    </div>
  );
};

export default App;
