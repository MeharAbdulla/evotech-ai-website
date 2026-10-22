import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

/**
 * Proprietary PCB 3D viewer — real OBJ only, flat front/top view of the board face.
 */
const PcbModelViewer = ({ modelUrl, mtlUrl, title = "PCB 3D View", fill = false }) => {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("Loading OBJ…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const mount = mountRef.current;
    let disposed = false;
    let frameId = 0;
    let renderer;
    let controls;
    let resizeObserver;

    if (!modelUrl) {
      setFailed(true);
      setStatus("No OBJ design file");
      return undefined;
    }

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141210);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 8000);
    camera.position.set(0, 260, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 30;
    controls.maxDistance = 1200;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(80, 220, 60);
    scene.add(key);
    const fillLight = new THREE.DirectionalLight(0xe8a45a, 0.35);
    fillLight.position.set(-120, 100, -80);
    scene.add(fillLight);
    const rim = new THREE.DirectionalLight(0xc9854a, 0.22);
    rim.position.set(0, -80, 140);
    scene.add(rim);

    const grid = new THREE.GridHelper(500, 24, 0x5c4030, 0x2a2218);
    grid.position.y = -4;
    scene.add(grid);

    const setFrontView = (object) => {
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
      const center2 = box2.getCenter(new THREE.Vector3());
      object.position.sub(center2);
      const size2 = box2.getSize(new THREE.Vector3());

      const faceW = Math.max(size2.x, size2.z) || 100;
      const faceH = Math.max(size2.x, size2.z, size2.y * 0.1) || 100;
      const distance = Math.max(faceW, faceH) * 1.35;

      camera.position.set(0, distance, 0.01);
      camera.up.set(0, 0, -1);
      camera.near = Math.max(distance / 250, 0.05);
      camera.far = distance * 50;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.update();
      camera.lookAt(0, 0, 0);
    };

    const onLoaded = (object) => {
      if (disposed) return;
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          if (!child.material) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x14532d,
              metalness: 0.2,
              roughness: 0.5,
            });
          }
        }
      });
      scene.add(object);
      setFrontView(object);
      setFailed(false);
      setStatus("Front view · drag to rotate · scroll to zoom");
    };

    const onError = () => {
      if (disposed) return;
      setFailed(true);
      setStatus("OBJ failed to load");
    };

    const loadObj = (materials) => {
      const loader = new OBJLoader();
      if (materials) {
        materials.preload();
        loader.setMaterials(materials);
      }
      loader.load(modelUrl, onLoaded, undefined, onError);
    };

    if (mtlUrl) {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(
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
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount || disposed) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      controls?.dispose();
      renderer?.dispose();
      if (renderer?.domElement?.parentNode === mount) {
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
  }, [modelUrl, mtlUrl]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#05070d] ${
        fill
          ? "h-full min-h-[70vh] rounded-none border-0"
          : "h-[420px] sm:h-[580px] rounded-2xl border border-sky-500/30 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      }`}
    >
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-[#05070d]/90 border border-sky-500/35 text-[10px] font-mono uppercase tracking-wider text-sky-200">
        {title} · Front view
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3">
        <span
          className={`text-[10px] font-mono uppercase tracking-wider ${
            failed ? "text-rose-400" : "text-slate-400"
          }`}
        >
          {status}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300/90 border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 rounded-lg">
          Proprietary · Not open source
        </span>
      </div>
    </div>
  );
};

export default PcbModelViewer;
