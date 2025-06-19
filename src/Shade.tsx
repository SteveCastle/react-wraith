import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import html2canvas from "html2canvas";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

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

interface ShadeProps {
  children: ReactNode;
}

const Shade: React.FC<ShadeProps> = ({ children }) => {
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
        if (contentRef.current) {
          contentRef.current.style.opacity = "0";
        }
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

    const debouncedCapture = debounce(() => {
      // Prevent recursive calls during capture process
      if (isCapturingRef.current) return;

      isCapturingRef.current = true;
      if (contentRef.current) {
        contentRef.current.style.opacity = "1";
      }
      updateSize();
      captureAndSetTexture();
    }, 300); // 300ms debounce delay

    // Initial capture
    debouncedCapture();

    const observer = new MutationObserver(() => {
      // Ignore mutations that occur during our own capture process
      if (isCapturingRef.current) return;
      //   debouncedCapture();
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

  return (
    <div
      style={{
        position: "relative",
        width: size.width ? `${size.width}px` : "auto",
        height: size.height ? `${size.height}px` : "auto",
        pointerEvents: "none",
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
          <mesh position={[meshOffsetX, -meshOffsetY, 0]}>
            <planeGeometry
              args={[
                size.width - margins.left - margins.right,
                size.height - margins.top - margins.bottom,
              ]}
            />
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

export default Shade;
