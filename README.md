# React Wraith

A lightweight React component that turns any DOM subtree into a Three.js-powered canvas with optional post-processing effects like bloom, noise, glitch, pixelation, and more.

![NPM version](https://img.shields.io/npm/v/react-wraith?color=cb3837&logo=npm&style=flat-square)
![License](https://img.shields.io/github/license/stevecastle/react-wraith?style=flat-square)

---

## ✨ Features

• **One-liner drop-in** – wrap any JSX and instantly get a canvas version rendered on top.  
• **Zero config defaults** – bloom + noise out of the box.  
• **Configurable post-processing pipeline** – enable/disable and tweak popular effects (bloom, noise, dot-screen, glitch, pixelation, scanline, chromatic aberration).
• **DOM margin support** – keeps the Three.js plane perfectly aligned with your original layout.  
• **TypeScript first** – full typings for all effect options.

---

## 🚀 Demo

👉 **Live Demo:** [https://stevecastle.github.io/react-wraith/](https://stevecastle.github.io/react-wraith/)

Clone the repo and run the embedded demo:

```bash
pnpm install   # or npm/yarn
pnpm dev       # launches Vite demo at http://localhost:5173
```

---

## 📦 Installation

```bash
npm install react-wraith
# └── peer deps (you probably already have these in a R3F project)
npm install react react-dom

```

yarn add react-wraith three react react-dom

````

> `react`, `react-dom`,  are **peer dependencies** – they must be present in the consumer project but are not bundled with Wraith.

---

## 🛠 Usage

```tsx
import { Wraith } from "react-wraith";

export default function Card() {
  return (
    <Wraith>
      <div className="card">
        <h1>Hello ✨</h1>
        <p>
          This content is captured into a WebGL texture and re-rendered with
          post-processing.
        </p>
      </div>
    </Wraith>
  );
}
````

### Customising effects

All effect toggles & options live on the `effects` prop:

```tsx
import { Wraith, type EffectsConfig } from "wraith";

const effects: EffectsConfig = {
  bloom: { intensity: 1.5, luminanceThreshold: 0.8 },
  glitch: { enabled: true, strength: [0.3, 1.0] },
  chromaticAberration: { enabled: true, offset: [0.01, 0.01] },
};

<Wraith effects={effects}>…</Wraith>;
```

Every sub-object mirrors the props of its corresponding `@react-three/postprocessing` component. See the [TypeScript types](./src/Wraith.tsx) for the full reference.

---

## 📑 API

| Prop       | Type                   | Default | Description                                                 |
| ---------- | ---------------------- | ------- | ----------------------------------------------------------- |
| `effects`  | `EffectsConfig`        | –       | Optional map enabling & configuring post-processing passes. |
| `children` | `ReactNode` (required) | –       | The DOM subtree to capture/render.                          |

---

## 🏗️ Local development

```bash
pnpm install          # install deps
pnpm dev              # start Vite demo
pnpm build            # bundle library with tsup
```

### Project layout

```
├─ dist/               # build output (ignored in git)
├─ src/
│  ├─ Wraith.tsx       # main component
│  └─ index.ts         # library entry (re-exports)
└─ demo (root)         # Vite demo (App.tsx etc.)
```

---

## 🤝 Contributing

Bug reports and pull requests are welcome!

1. Fork the repo & create a branch.
2. Run the demo locally (`pnpm dev`).
3. Ensure `pnpm lint && pnpm build` pass.
4. Open a PR with a clear description.

---

## 📜 License

[MIT](LICENSE) © 2024 Your Name
