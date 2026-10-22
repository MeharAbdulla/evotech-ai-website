import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

/**
 * Compact auto-rotating 3D PCB preview for project cards — real OBJ only.
 */
const PcbCardViewer = ({ modelUrl, mtlUrl, className = "" }) => {
  const mountRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = mountRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px", threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !mountRef.current || !modelUrl) return undefined;

    const mount = mountRef.current;
    let disposed = false;
    let frameId = 0;
    let renderer;
    let boardRoot = null;

    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 208;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141210);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 2000);
    camera.position.set(0, 42, 0.01);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = 0.28;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.9;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(20, 80, 10);
    scene.add(key);
    const fillLight = new THREE.DirectionalLight(0xe8a45a, 0.45);
    fillLight.position.set(-30, 50, -15);
    scene.add(fillLight);

    const fitFront = (object) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      object.position.sub(center);

      const dims = [
        { axis: "x", value: size.x },
        { axis: "y", value: size.y },
        { axis: "z", value: size.z },
      ].sort((a, b) => a.value - b.value);
      const thin = dims[0].axis;
      if (thin === "x") object.rotation.z = Math.PI / 2;
      else if (thin === "z") object.rotation.x = -Math.PI / 2;

      const box2 = new THREE.Box3().setFromObject(object);
      object.position.sub(box2.getCenter(new THREE.Vector3()));
      const size2 = box2.getSize(new THREE.Vector3());
      const span = Math.max(size2.x, size2.z) || 40;
      camera.position.set(0, span * 1.55, span * 0.08);
      camera.up.set(0, 0, -1);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
    };

    const attachBoard = (object) => {
      if (disposed) return;
      boardRoot = object;
      scene.add(object);
      fitFront(object);
    };

    const loadObj = (materials) => {
      const loader = new OBJLoader();
      if (materials) {
        materials.preload();
        loader.setMaterials(materials);
      }
      loader.load(
        modelUrl,
        (obj) => {
          obj.traverse((child) => {
            if (child.isMesh && !child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x14532d,
                metalness: 0.2,
                roughness: 0.5,
              });
            }
          });
          attachBoard(obj);
        },
        undefined,
        () => {}
      );
    };

    if (mtlUrl) {
      new MTLLoader().load(
        mtlUrl,
        (materials) => loadObj(materials),
        undefined,
        () => loadObj(null)
      );
    } else {
      loadObj(null);
    }

    const animate = () => {
      if (disposed) return;
      frameId = requestAnimationFrame(animate);
      if (boardRoot) {
        boardRoot.rotation.x = 0;
        boardRoot.rotation.z = 0;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount || disposed) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [visible, modelUrl, mtlUrl]);

  return (
    <div className={`relative w-full h-full bg-[#05070d] ${className}`}>
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded-md bg-[#05070d]/85 border border-sky-500/35 text-[9px] font-mono uppercase tracking-wider text-sky-200 pointer-events-none">
        3D OBJ
      </div>
    </div>
  );
};

export default PcbCardViewer;
