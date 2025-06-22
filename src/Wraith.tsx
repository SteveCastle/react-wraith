import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import html2canvas from "html2canvas";
import {
  Bloom,
  EffectComposer,
  Noise,
  DotScreen,
  Glitch,
  Pixelation,
  Scanline,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize, GlitchMode } from "postprocessing";
import type { BlurPass } from "postprocessing";
import { Vector2 } from "three";

// ---------------------------------------------------------------------------
// Effect configuration types
// ---------------------------------------------------------------------------

export interface BloomConfig {
  /** Enable/disable the bloom effect */
  enabled?: boolean;
  intensity?: number;
  blurPass?: BlurPass;
  kernelSize?: KernelSize;
  luminanceThreshold?: number;
  luminanceSmoothing?: number;
  mipmapBlur?: boolean;
  resolutionX?: number;
  resolutionY?: number;
}

export interface NoiseConfig {
  /** Enable/disable the noise effect */
  enabled?: boolean;
  premultiply?: boolean;
  blendFunction?: BlendFunction;
  /** Opacity of noise –– via material alpha */
  opacity?: number;
}

export interface DotScreenConfig {
  enabled?: boolean;
  blendFunction?: BlendFunction;
  angle?: number;
  scale?: number;
}

export interface GlitchConfig {
  enabled?: boolean;
  delay?: Vector2;
  duration?: Vector2;
  strength?: Vector2;
  mode?: GlitchMode;
  active?: boolean;
  ratio?: number;
}

export interface PixelationConfig {
  enabled?: boolean;
  blendFunction?: BlendFunction;
  granularity?: number;
}

export interface ScanlineConfig {
  enabled?: boolean;
  blendFunction?: BlendFunction;
  density?: number;
  opacity?: number;
}

export interface ChromaticAberrationConfig {
  enabled?: boolean;
  blendFunction?: BlendFunction;
  offset?: Vector2;
}

export interface CustomShaderConfig {
  enabled?: boolean;
  fragmentShader: string;
  uniforms?: Record<string, unknown>;
  blendFunction?: BlendFunction;
}

export interface EffectsConfig {
  bloom?: BloomConfig;
  noise?: NoiseConfig;
  dotScreen?: DotScreenConfig;
  glitch?: GlitchConfig;
  pixelation?: PixelationConfig;
  scanline?: ScanlineConfig;
  chromaticAberration?: ChromaticAberrationConfig;
  customShader?: CustomShaderConfig;
  // Extend with more effects as needed
}

interface WraithProps {
  children: ReactNode;
  /** Optional configuration to control post-processing effects */
  effects?: EffectsConfig;
}

const Wraith: React.FC<WraithProps> = ({ children, effects }) => {
  const contentRef = useRef<HTMLDivElement>(null); // Ref for the div wrapping children
  const isCapturingRef = useRef(false); // Flag to prevent recursive captures
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [margins, setMargins] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const getTargetElement = () =>
    contentRef.current?.children[0] as HTMLElement | undefined;

  const captureAndSetTexture = () => {
    const element = getTargetElement();
    if (element) {
      html2canvas(element, {
        backgroundColor: null,
        logging: false, // Disabling logging can help performance
      }).then((canvas) => {
        const newTexture = new THREE.CanvasTexture(canvas);
        newTexture.needsUpdate = true;
        setTexture(newTexture);
        isCapturingRef.current = false; // Reset flag after capture is complete
      });
    }
  };

  const updateSize = () => {
    const element = getTargetElement();
    if (element) {
      const style = window.getComputedStyle(element);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);

      const newWidth = element.offsetWidth + marginLeft + marginRight;
      const newHeight = element.offsetHeight + marginTop + marginBottom;

      if (newWidth !== size.width || newHeight !== size.height) {
        setSize({ width: newWidth, height: newHeight });
      }

      setMargins({
        left: marginLeft,
        right: marginRight,
        top: marginTop,
        bottom: marginBottom,
      });
    }
  };

  useLayoutEffect(() => {
    updateSize();
  }, [children]);

  useEffect(() => {
    const targetNode = contentRef.current;
    if (!targetNode) return;

    updateSize();
    captureAndSetTexture();

    const observer = new MutationObserver(() => {
      updateSize();
      captureAndSetTexture();
    });

    observer.observe(targetNode, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (texture) {
        texture.dispose();
      }
    };
  }, [children, size]);

  // Calculate the offset for the mesh to account for margins
  const meshOffsetX = (margins.right - margins.left) / 2;
  const meshOffsetY = (margins.top - margins.bottom) / 2;

  // ---------------------------------------------------------
  // Post-processing helpers
  // ---------------------------------------------------------

  const defaultBloom: BloomConfig = {
    enabled: true,
    intensity: 1,
    kernelSize: KernelSize.LARGE,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.025,
  };

  const defaultNoise: NoiseConfig = {
    enabled: true,
    premultiply: true,
    blendFunction: BlendFunction.ADD,
  };

  const defaultDotScreen: DotScreenConfig = {
    enabled: false,
    blendFunction: BlendFunction.NORMAL,
    angle: Math.PI * 0.5,
    scale: 1.0,
  };

  const defaultGlitch: GlitchConfig = {
    enabled: false,
    delay: new Vector2(1.5, 3.5),
    duration: new Vector2(0.6, 1.0),
    strength: new Vector2(0.3, 1.0),
    mode: GlitchMode.SPORADIC,
    active: true,
    ratio: 0.85,
  };

  const defaultPixelation: PixelationConfig = {
    enabled: false,
    blendFunction: BlendFunction.NORMAL,
    granularity: 2.0,
  };

  const defaultScanline: ScanlineConfig = {
    enabled: false,
    blendFunction: BlendFunction.OVERLAY,
    density: 1.0,
    opacity: 1.0,
  };

  const defaultChromaticAberration: ChromaticAberrationConfig = {
    enabled: false,
    blendFunction: BlendFunction.NORMAL,
    offset: new Vector2(0.01, 0.01),
  };

  const bloomConfig: BloomConfig = {
    ...defaultBloom,
    ...effects?.bloom,
  };

  const noiseConfig: NoiseConfig = {
    ...defaultNoise,
    ...effects?.noise,
  };

  const dotScreenConfig: DotScreenConfig = {
    ...defaultDotScreen,
    ...effects?.dotScreen,
  };

  const glitchConfig: GlitchConfig = {
    ...defaultGlitch,
    ...effects?.glitch,
  };

  const pixelationConfig: PixelationConfig = {
    ...defaultPixelation,
    ...effects?.pixelation,
  };

  const scanlineConfig: ScanlineConfig = {
    ...defaultScanline,
    ...effects?.scanline,
  };

  const chromaticConfig: ChromaticAberrationConfig = {
    ...defaultChromaticAberration,
    ...effects?.chromaticAberration,
  };

  // Omit the `enabled` flag before forwarding props to JSX components
  const { enabled: bloomEnabled, ...bloomProps } = bloomConfig;
  const { enabled: noiseEnabled, ...noiseProps } = noiseConfig;
  const { enabled: dotScreenEnabled, ...dotScreenProps } = dotScreenConfig;
  const { enabled: glitchEnabled, ...glitchProps } = glitchConfig;
  const { enabled: pixelationEnabled, ...pixelationProps } = pixelationConfig;
  const { enabled: scanlineEnabled, ...scanlineProps } = scanlineConfig;
  const { enabled: chromaticEnabled, ...chromaticProps } = chromaticConfig;

  const effectElements: React.ReactElement[] = [];
  if (bloomEnabled) effectElements.push(<Bloom key="bloom" {...bloomProps} />);
  if (noiseEnabled) effectElements.push(<Noise key="noise" {...noiseProps} />);
  if (dotScreenEnabled)
    effectElements.push(<DotScreen key="dotScreen" {...dotScreenProps} />);
  if (glitchEnabled)
    effectElements.push(
      <Glitch
        key="glitch"
        {...glitchProps}
        delay={glitchConfig.delay}
        duration={glitchConfig.duration}
        strength={glitchConfig.strength}
      />
    );
  if (pixelationEnabled)
    effectElements.push(<Pixelation key="pixelation" {...pixelationProps} />);
  if (scanlineEnabled)
    effectElements.push(<Scanline key="scanline" {...scanlineProps} />);
  if (chromaticEnabled)
    effectElements.push(
      <ChromaticAberration
        key="chromatic"
        {...chromaticProps}
        offset={chromaticConfig.offset}
      />
    );

  //   effectElements.push(<MyCustomEffect param={0.5} />);

  return (
    <div
      style={{
        position: "relative",
        width: size.width ? `${size.width}px` : "auto",
        height: size.height ? `${size.height}px` : "auto",
      }}
    >
      <div
        ref={contentRef}
        style={{
          userSelect: "none",
        }}
      >
        {children}
      </div>
      {texture && size.width > 0 && size.height > 0 && (
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <OrthographicCamera
            makeDefault
            position={[0, 0, 10]}
            zoom={1}
            top={size.height / 2}
            bottom={-size.height / 2}
            left={-size.width / 2}
            right={size.width / 2}
            near={1}
            far={1000}
          />
          <mesh position={[meshOffsetX, -meshOffsetY, 0]}>
            <planeGeometry
              args={[
                size.width - margins.left - margins.right,
                size.height - margins.top - margins.bottom,
              ]}
            />
            <meshBasicMaterial map={texture} transparent />
          </mesh>
          <EffectComposer>{effectElements}</EffectComposer>
        </Canvas>
      )}
    </div>
  );
};

export default Wraith;
