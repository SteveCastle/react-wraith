import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import html2canvas from "html2canvas";
import {
  Bloom,
  EffectComposer,
  Glitch,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";

// Debounce function
const debounce = <F extends (...args: unknown[]) => void>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

interface HTMLToTextureProps {
  children: ReactNode;
}

const HTMLToTexture: React.FC<HTMLToTextureProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null); // Ref for the div wrapping children
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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
        if (contentRef.current) {
          contentRef.current.style.visibility = "hidden";
        }
      });
    }
  };

  const updateSize = () => {
    const element = getTargetElement();
    if (element) {
      const style = window.getComputedStyle(element);
      const newWidth =
        element.offsetWidth +
        parseFloat(style.marginLeft) +
        parseFloat(style.marginRight);
      const newHeight =
        element.offsetHeight +
        parseFloat(style.marginTop) +
        parseFloat(style.marginBottom);

      if (newWidth !== size.width || newHeight !== size.height) {
        setSize({ width: newWidth, height: newHeight });
      }
    }
  };

  useLayoutEffect(() => {
    updateSize();
  }, [children]);

  useEffect(() => {
    const targetNode = contentRef.current;
    if (!targetNode) return;

    const debouncedCapture = debounce(() => {
      if (contentRef.current) {
        contentRef.current.style.visibility = "visible";
      }
      updateSize();
      captureAndSetTexture();
    }, 300); // 300ms debounce delay

    // Initial capture
    debouncedCapture();

    const observer = new MutationObserver(() => {
      debouncedCapture();
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

  return (
    <div
      style={{
        position: "relative",
        width: size.width ? `${size.width}px` : "auto",
        height: size.height ? `${size.height}px` : "auto",
      }}
    >
      <div ref={contentRef}>{children}</div>
      {texture && size.width > 0 && size.height > 0 && (
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
          <mesh>
            <planeGeometry args={[size.width, size.height]} />
            <meshBasicMaterial map={texture} transparent />
          </mesh>
          <EffectComposer>
            <Bloom />
            <Noise
              premultiply // enables or disables noise premultiplication
              blendFunction={BlendFunction.ADD} // blend mode
            />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
};

export default HTMLToTexture;
