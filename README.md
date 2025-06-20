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

Every sub-object corresponds to a popular post-processing pass. See the API section below for the full list of options and their defaults.

---

## 📑 API

| Prop       | Type                   | Default | Description                                                 |
| ---------- | ---------------------- | ------- | ----------------------------------------------------------- |
| `effects`  | `EffectsConfig`        | –       | Optional map enabling & configuring post-processing passes. |
| `children` | `ReactNode` (required) | –       | The DOM subtree to capture/render.                          |

### EffectsConfig

The `effects` prop is a plain object where each key enables and configures a specific post-processing pass. The sections below outline what each effect does and which options are available. Any option you omit falls back to the default shown.

> **Enum helpers** – The `KernelSize`, `BlendFunction`, and `GlitchMode` enums are all re-exported from the underlying [`postprocessing`](https://github.com/pmndrs/postprocessing) package, so you can import them directly from your app.

#### Bloom – bright-area glow

| Option                      | Type         | Default            | Description                                         |
| --------------------------- | ------------ | ------------------ | --------------------------------------------------- |
| `enabled`                   | `boolean`    | `true`             | Turns the bloom pass on/off.                        |
| `intensity`                 | `number`     | `1`                | Strength of the glow.                               |
| `kernelSize`                | `KernelSize` | `KernelSize.LARGE` | Convolution blur kernel size.                       |
| `luminanceThreshold`        | `number`     | `0.9`              | Only pixels brighter than this contribute to bloom. |
| `luminanceSmoothing`        | `number`     | `0.025`            | Softens the luminance threshold edge.               |
| `mipmapBlur`                | `boolean`    | `false`            | Activates mip-map blur for smoother fall-off.       |
| `resolutionX / resolutionY` | `number`     | –                  | Override internal render target resolution.         |

#### Noise – film grain overlay

| Option          | Type            | Default             | Description                                             |
| --------------- | --------------- | ------------------- | ------------------------------------------------------- |
| `enabled`       | `boolean`       | `true`              | Toggles the noise pass.                                 |
| `premultiply`   | `boolean`       | `true`              | Multiply noise by the scene colour.                     |
| `blendFunction` | `BlendFunction` | `BlendFunction.ADD` | How the noise is composited.                            |
| `opacity`       | `number`        | –                   | Manual alpha if you want less than full noise strength. |

#### DotScreen – retro CRT dots

| Option          | Type            | Default                | Description                             |
| --------------- | --------------- | ---------------------- | --------------------------------------- |
| `enabled`       | `boolean`       | `false`                | Enable the dot-screen shader.           |
| `blendFunction` | `BlendFunction` | `BlendFunction.NORMAL` | Composition mode.                       |
| `angle`         | `number`        | `Math.PI / 2`          | Rotation of the dot pattern.            |
| `scale`         | `number`        | `1`                    | Distance between dots (lower = denser). |

#### Glitch – intermittent RGB shift & distortion

| Option     | Type               | Default               | Description                            |
| ---------- | ------------------ | --------------------- | -------------------------------------- |
| `enabled`  | `boolean`          | `false`               | Master toggle.                         |
| `delay`    | `[number, number]` | `[1.5, 3.5]`          | Min/max seconds between glitch bursts. |
| `duration` | `[number, number]` | `[0.6, 1.0]`          | Min/max seconds a burst lasts.         |
| `strength` | `[number, number]` | `[0.3, 1.0]`          | Distortion strength range.             |
| `mode`     | `GlitchMode`       | `GlitchMode.SPORADIC` | Continuous vs sporadic vs …            |
| `active`   | `boolean`          | `true`                | Whether the pass is currently active.  |
| `ratio`    | `number`           | `0.85`                | Portion of the frame affected.         |

#### Pixelation – chunky low-res look

| Option          | Type            | Default                | Description                        |
| --------------- | --------------- | ---------------------- | ---------------------------------- |
| `enabled`       | `boolean`       | `false`                | Toggle pixelation.                 |
| `blendFunction` | `BlendFunction` | `BlendFunction.NORMAL` | Composition mode.                  |
| `granularity`   | `number`        | `2`                    | Pixel size in screen-space pixels. |

#### Scanline – horizontal line overlay

| Option          | Type            | Default                 | Description                              |
| --------------- | --------------- | ----------------------- | ---------------------------------------- |
| `enabled`       | `boolean`       | `false`                 | Enable the scanline overlay.             |
| `blendFunction` | `BlendFunction` | `BlendFunction.OVERLAY` | Composition mode.                        |
| `density`       | `number`        | `1`                     | Spacing between lines (higher = denser). |
| `opacity`       | `number`        | `1`                     | Opacity of the lines.                    |

#### Chromatic Aberration – RGB channel offset

| Option          | Type               | Default                | Description            |
| --------------- | ------------------ | ---------------------- | ---------------------- |
| `enabled`       | `boolean`          | `false`                | Activate the effect.   |
| `blendFunction` | `BlendFunction`    | `BlendFunction.NORMAL` | Composition mode.      |
| `offset`        | `[number, number]` | `[0.01, 0.01]`         | Per-channel UV offset. |

#### CustomShader – bring your own fragment shader

| Option           | Type                      | Default                | Description                                     |
| ---------------- | ------------------------- | ---------------------- | ----------------------------------------------- |
| `enabled`        | `boolean`                 | `false`                | Toggle the pass.                                |
| `fragmentShader` | `string`                  | –                      | Your GLSL fragment shader source. **Required.** |
| `uniforms`       | `Record<string, unknown>` | –                      | Extra uniforms passed to the material.          |
| `blendFunction`  | `BlendFunction`           | `BlendFunction.NORMAL` | How to composite with the scene.                |

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
