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
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container div
  const contentRef = useRef<HTMLDivElement>(null); // Ref for the div wrapping children
  const isCapturingRef = useRef(false); // Flag to prevent recursive captures
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    contentWidth: 0,
    contentHeight: 0,
  });

  const getTargetElement = () =>
    contentRef.current?.children[0] as HTMLElement | undefined;

  const captureAndSetTexture = () => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;

    const element = getTargetElement();
    if (element) {
      html2canvas(element, {
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })
        .then((canvas) => {
          const newTexture = new THREE.CanvasTexture(canvas);
          newTexture.needsUpdate = true;
          setTexture((prevTexture) => {
            if (prevTexture) {
              prevTexture.dispose();
            }
            return newTexture;
          });
          isCapturingRef.current = false;
        })
        .catch((error) => {
          console.error("html2canvas error:", error);
          isCapturingRef.current = false;
        });
    } else {
      isCapturingRef.current = false;
    }
  };

  const updateDimensions = () => {
    const element = getTargetElement();
    const container = containerRef.current;

    if (element && container) {
      // Get the bounding box of the actual content element
      const elementRect = element.getBoundingClientRect();

      // Calculate dimensions including any margins, borders, etc.
      const style = window.getComputedStyle(element);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;

      const totalWidth = elementRect.width + marginLeft + marginRight;
      const totalHeight = elementRect.height + marginTop + marginBottom;

      const newDimensions = {
        width: totalWidth,
        height: totalHeight,
        contentWidth: elementRect.width,
        contentHeight: elementRect.height,
      };

      // Only update if dimensions have actually changed
      if (
        newDimensions.width !== dimensions.width ||
        newDimensions.height !== dimensions.height ||
        newDimensions.contentWidth !== dimensions.contentWidth ||
        newDimensions.contentHeight !== dimensions.contentHeight
      ) {
        setDimensions(newDimensions);
      }
    }
  };

  useLayoutEffect(() => {
    updateDimensions();
  }, [children]);

  useEffect(() => {
    const targetNode = contentRef.current;
    if (!targetNode) return;

    updateDimensions();

    // Delay texture capture to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      captureAndSetTexture();
    }, 50);

    const observer = new MutationObserver(() => {
      updateDimensions();
      // Debounce texture capture
      setTimeout(() => {
        captureAndSetTexture();
      }, 100);
    });

    observer.observe(targetNode, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Also observe resize events
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      setTimeout(() => {
        captureAndSetTexture();
      }, 100);
    });

    const element = getTargetElement();
    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      resizeObserver.disconnect();
      if (texture) {
        texture.dispose();
      }
    };
  }, [children]);

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

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: dimensions.width ? `${dimensions.width}px` : "auto",
        height: dimensions.height ? `${dimensions.height}px` : "auto",
        overflow: "hidden", // Ensure no content bleeds outside
      }}
    >
      <div
        ref={contentRef}
        style={{
          userSelect: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
      {texture && dimensions.width > 0 && dimensions.height > 0 && (
        <Canvas
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <OrthographicCamera
            makeDefault
            position={[0, 0, 10]}
            zoom={1}
            top={dimensions.height / 2}
            bottom={-dimensions.height / 2}
            left={-dimensions.width / 2}
            right={dimensions.width / 2}
            near={0.1}
            far={1000}
          />
          <mesh position={[0, 0, 0]}>
            <planeGeometry
              args={[dimensions.contentWidth, dimensions.contentHeight]}
            />
            <meshBasicMaterial
              map={texture}
              transparent
              side={THREE.DoubleSide}
            />
          </mesh>
          <EffectComposer>{effectElements}</EffectComposer>
        </Canvas>
      )}
    </div>
  );
};

export default Wraith;
