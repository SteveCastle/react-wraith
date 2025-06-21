# React Wraith (Alpha)

⚠️ **Alpha Release** - This library is experimental and has some rough edges. Element positioning may be inaccurate in some cases, and content updates are not real-time due to texture re-rendering.

A React component that converts HTML content into Three.js textures and applies configurable shader-based visual effects like bloom, pixelation, glitch, noise, chromatic aberration, and more.

![NPM version](https://img.shields.io/npm/v/react-wraith?color=cb3837&logo=npm&style=flat-square)
![License](https://img.shields.io/github/license/stevecastle/react-wraith?style=flat-square)

---

## ✨ Features

• **HTML to 3D texture conversion** – automatically captures DOM content as WebGL textures  
• **Multiple shader effects** – bloom, pixelation, glitch, noise, chromatic aberration, and more  
• **Configurable post-processing pipeline** – enable/disable and customize any effect  
• **TypeScript first** – full typings for all effect options  
• **Alpha software** – expect positioning quirks and delayed updates

---

## ⚠️ Current Limitations

This is alpha software with known issues:

- **Element positioning** may be slightly off in some layouts
- **Updates are not real-time** - content changes require texture re-rendering
- **Interactive elements** work but positioning may be approximate
- **Performance** is not yet optimized for production use

---

## 🚀 Demo

👉 **Live Demo:** [https://stevecastle.github.io/react-wraith/](https://stevecastle.github.io/react-wraith/)

### Quick&nbsp;Start

Get up and running in three steps:

1. **Install** the package (only React 19 required as peer dependency):

   ```bash
   npm install react-wraith
   ```

2. **Wrap** any JSX with the `Wraith` component:

   ```tsx
   import { Wraith } from "react-wraith";

   export default function Example() {
     return (
       <Wraith>
         <div style={{ padding: 32, background: "#111", color: "#fff" }}>
           ⚡️ Hello from Wraith!
         </div>
       </Wraith>
     );
   }
   ```

3. **Run** your dev server and see your content rendered with shader effects.

---

## 📦 Installation

```bash
npm install react-wraith
```

```bash
yarn add react-wraith
```

> Only `react ^19.0.0` and `react-dom ^19.0.0` are required as peer dependencies. All other dependencies (Three.js, React Three Fiber, etc.) are bundled with the library.

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
          configurable shader effects.
        </p>
      </div>
    </Wraith>
  );
}
```

### Customising effects

All effect toggles & options live on the `effects` prop:

```tsx
import { Wraith, type EffectsConfig } from "react-wraith";

const effects: EffectsConfig = {
  bloom: { enabled: true, intensity: 1.5, luminanceThreshold: 0.8 },
  pixelation: { enabled: true, granularity: 4 },
  glitch: { enabled: true, strength: [0.3, 1.0] },
  chromaticAberration: { enabled: true, offset: [0.01, 0.01] },
  noise: { enabled: true, opacity: 0.3 },
};

<Wraith effects={effects}>
  <YourComponent />
</Wraith>;
```

Mix and match different effects to create unique visual styles. Each effect can be independently enabled and configured.

---

## 📑 API

| Prop       | Type                   | Default | Description                                                 |
| ---------- | ---------------------- | ------- | ----------------------------------------------------------- |
| `effects`  | `EffectsConfig`        | –       | Optional map enabling & configuring post-processing passes. |
| `children` | `ReactNode` (required) | –       | The DOM subtree to capture/render.                          |

### EffectsConfig

The `effects` prop is a plain object where each key enables and configures a specific post-processing pass. The sections below outline what each effect does and which options are available. Any option you omit falls back to the default shown.

> **Enum helpers** – The `KernelSize`, `BlendFunction`, and `GlitchMode` enums are all re-exported from the underlying [`postprocessing`](https://github.com/pmndrs/postprocessing) package, so you can import them directly from your app.

#### Bloom – luminous glow effect

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

#### Pixelation – retro pixel art look

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

Bug reports and pull requests are welcome! This is alpha software, so please report any positioning issues or other bugs you encounter.

1. Fork the repo & create a branch.
2. Run the demo locally (`pnpm dev`).
3. Ensure `pnpm lint && pnpm build` pass.
4. Open a PR with a clear description.

---

## 📜 License

[MIT](LICENSE) © 2024 Your Name
