import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Perlin from 'perlin.js';

/**
 * nextjs-webgl の /tunnel（CatmullRomCurve3 + ワイヤ円環）をベースにした背景。
 * マゼンタ系の破線でトンネル感を出す。
 */
export default function TunnelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 30, 150);

    const sizes = { width: window.innerWidth, height: window.innerHeight };

    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      0.1,
      150
    );

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const pointsArray: [number, number][] = [
      [68.5, 185.5],
      [1, 262.5],
      [270.9, 281.9],
      [345.5, 212.8],
      [178, 155.7],
      [240.3, 72.3],
      [153.4, 0.6],
      [52.6, 53.3],
      [68.5, 185.5],
    ];

    const points: THREE.Vector3[] = [];
    for (let i = 0; i < pointsArray.length; i++) {
      const x = pointsArray[i][0];
      const y = Math.random() * 100;
      const z = pointsArray[i][1];
      points.push(new THREE.Vector3(x, y, z));
    }

    const path = new THREE.CatmullRomCurve3(points);
    path.closed = true;

    const tubeDetail = 1000;
    const circlesDetail = 10;
    const radius = 8;
    const frames = path.computeFrenetFrames(tubeDetail, true);

    const lines: THREE.Line[] = [];

    for (let i = 0; i < tubeDetail; i++) {
      const normal = frames.normals[i];
      const binormal = frames.binormals[i];
      const index = i / tubeDetail;

      const p = path.getPointAt(index);
      const circle = new THREE.BufferGeometry();

      const positions: number[] = [];
      for (let j = 0; j <= circlesDetail; j++) {
        let angle = (j / circlesDetail) * Math.PI * 2;
        angle += Perlin.perlin2(index * 10, 0);
        const sin = Math.sin(angle);
        const cos = -Math.cos(angle);

        const normalPoint = new THREE.Vector3(0, 0, 0);
        normalPoint.x = cos * normal.x + sin * binormal.x;
        normalPoint.y = cos * normal.y + sin * binormal.y;
        normalPoint.z = cos * normal.z + sin * binormal.z;

        normalPoint.multiplyScalar(radius);
        positions.push(normalPoint.x, normalPoint.y, normalPoint.z);
      }
      circle.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color().setRGB(37 / 255, 99 / 255, 235 / 255)
      })
      const line = new THREE.Line(circle, material);
      line.position.set(p.x, p.y, p.z);
      line.computeLineDistances();
      scene.add(line);
      lines.push(line);
    }

    let percentage = 0;
    let raf = 0;

    const render = () => {
      percentage += 0.001;
      const p1 = path.getPointAt(percentage % 1);
      const p2 = path.getPointAt((percentage + 0.005) % 1);
      camera.position.set(p1.x, p1.y, p1.z);
      camera.lookAt(p2);

      raf = window.requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    const onResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      for (const line of lines) {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      }
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
