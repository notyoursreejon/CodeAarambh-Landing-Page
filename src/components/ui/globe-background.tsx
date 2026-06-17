"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useScroll, useTransform } from "framer-motion";

interface GlobeBackgroundProps {
  className?: string;
}

export const GlobeBackground: React.FC<GlobeBackgroundProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    globe: THREE.Mesh;
    nodes: THREE.Points[];
    connections: THREE.LineSegments[];
    orbitalRings: THREE.Mesh[];
    particles: THREE.Points;
    animationId: number;
  } | null>(null);

  // Use the global viewport scroll instead of a fixed element target reference
  const { scrollYProgress } = useScroll();

  const cameraZ = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [100, 60, 30, 15, 5, -10]);
  const cameraY = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 5, 10, 15, 20, 25]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0.3, 0.5, 0.7, 0.8, 0.6, 0.3]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(15, 64, 64);
    const globeMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.3 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = vec3(0.2, 0.4, 0.8) * intensity;
          float pulse = sin(time * 0.5) * 0.1 + 0.9;
          gl_FragColor = vec4(atmosphere * pulse, opacity * intensity);
        }
      `,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Create AI nodes with coding symbols
    const nodes: THREE.Points[] = [];
    const nodeCount = 300;
    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(nodeCount * 3);
      const colors = new Float32Array(nodeCount * 3);
      const sizes = new Float32Array(nodeCount);
      const types = new Float32Array(nodeCount);

      for (let j = 0; j < nodeCount; j++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 15.5 + i * 0.8;

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        // Different colors for different agent types
        const agentType = Math.floor(Math.random() * 5);
        if (agentType === 0) { // Frontend
          colors[j * 3] = 0.2; colors[j * 3 + 1] = 0.6; colors[j * 3 + 2] = 1.0;
        } else if (agentType === 1) { // Backend
          colors[j * 3] = 0.5; colors[j * 3 + 1] = 0.3; colors[j * 3 + 2] = 0.9;
        } else if (agentType === 2) { // AI/ML
          colors[j * 3] = 0.0; colors[j * 3 + 1] = 0.9; colors[j * 3 + 2] = 0.7;
        } else if (agentType === 3) { // DevOps
          colors[j * 3] = 0.9; colors[j * 3 + 1] = 0.4; colors[j * 3 + 2] = 0.2;
        } else { // Database
          colors[j * 3] = 0.3; colors[j * 3 + 1] = 0.9; colors[j * 3 + 2] = 0.5;
        }

        sizes[j] = Math.random() * 3 + 1.5;
        types[j] = agentType;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aType", new THREE.BufferAttribute(types, 1));

      const material = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          attribute float aType;
          varying vec3 vColor;
          varying float vType;
          uniform float time;
          
          void main() {
            vColor = color;
            vType = aType;
            vec3 pos = position;
            float pulse = sin(time * (0.5 + aType * 0.2) + position.x * 3.0) * 0.3 + 0.7;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z) * pulse;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vType;
          
          void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            // Create different shapes for different types
            float shape = 1.0;
            if (vType < 1.0) {
              // Circle for frontend
              shape = 1.0 - smoothstep(0.3, 0.5, dist);
            } else if (vType < 2.0) {
              // Square for backend
              float square = max(abs(center.x), abs(center.y));
              shape = 1.0 - smoothstep(0.3, 0.5, square);
            } else if (vType < 3.0) {
              // Triangle for AI
              float angle = atan(center.y, center.x);
              float r = 0.4;
              float triangle = cos(floor(0.5 + angle / 2.094395) * 2.094395 - angle) * length(center);
              shape = 1.0 - smoothstep(r * 0.8, r, triangle);
            } else {
              // Diamond
              float diamond = abs(center.x) + abs(center.y);
              shape = 1.0 - smoothstep(0.3, 0.5, diamond);
            }
            
            if (shape < 0.1) discard;
            gl_FragColor = vec4(vColor, shape * 0.9);
          }
        `,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      nodes.push(points);
    }

    // Create AI communication connections
    const connections: THREE.LineSegments[] = [];
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions: number[] = [];
    const connectionColors: number[] = [];
    
    for (let i = 0; i < 150; i++) {
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(Math.random() * 2 - 1);
      const theta2 = Math.random() * Math.PI * 2;
      const phi2 = Math.acos(Math.random() * 2 - 1);
      const radius = 16 + Math.random() * 2;

      connectionPositions.push(
        radius * Math.sin(phi1) * Math.cos(theta1),
        radius * Math.sin(phi1) * Math.sin(theta1),
        radius * Math.cos(phi1),
        radius * Math.sin(phi2) * Math.cos(theta2),
        radius * Math.sin(phi2) * Math.sin(theta2),
        radius * Math.cos(phi2)
      );

      // Data packet colors
      const colorType = Math.random();
      if (colorType < 0.5) {
        connectionColors.push(0.2, 0.6, 1.0, 0.5, 0.3, 0.9);
      } else {
        connectionColors.push(0.0, 0.9, 0.7, 0.3, 0.9, 0.5);
      }
    }

    connectionGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(connectionPositions, 3)
    );
    connectionGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(connectionColors, 3)
    );

    const connectionMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const connectionLines = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    scene.add(connectionLines);
    connections.push(connectionLines);

    // Create orbital AI rings with code streams
    const orbitalRings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const ringGeometry = new THREE.TorusGeometry(18 + i * 4, 0.08, 16, 100);
      const ringMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          time: { value: 0 },
          ringIndex: { value: i },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float ringIndex;
          varying vec2 vUv;
          
          void main() {
            float wave = sin(vUv.x * 50.0 - time * (2.0 + ringIndex)) * 0.5 + 0.5;
            vec3 color1 = vec3(0.2, 0.6, 1.0);
            vec3 color2 = vec3(0.5, 0.3, 0.9);
            vec3 color3 = vec3(0.0, 0.9, 0.7);
            
            vec3 finalColor = mix(color1, color2, ringIndex * 0.2);
            finalColor = mix(finalColor, color3, wave * 0.3);
            
            float opacity = 0.4 * wave;
            gl_FragColor = vec4(finalColor, opacity);
          }
        `,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2 + (i * Math.PI) / 8;
      ring.rotation.y = (i * Math.PI) / 12;
      scene.add(ring);
      orbitalRings.push(ring);
    }

    // Create code particle streams
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Position particles in orbital streams
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 40;
      const height = (Math.random() - 0.5) * 100;
      
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = height;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      // Code stream colors
      const codeType = Math.random();
      if (codeType < 0.3) {
        particleColors[i * 3] = 0.2; particleColors[i * 3 + 1] = 0.6; particleColors[i * 3 + 2] = 1.0;
      } else if (codeType < 0.6) {
        particleColors[i * 3] = 0.0; particleColors[i * 3 + 1] = 0.9; particleColors[i * 3 + 2] = 0.7;
      } else {
        particleColors[i * 3] = 0.5; particleColors[i * 3 + 1] = 0.3; particleColors[i * 3 + 2] = 0.9;
      }

      particleSizes[i] = Math.random() * 2 + 0.5;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );
    particleGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(particleSizes, 1)
    );

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Orbital motion
          float angle = time * 0.1;
          float x = pos.x * cos(angle) - pos.z * sin(angle);
          float z = pos.x * sin(angle) + pos.z * cos(angle);
          pos.x = x;
          pos.z = z;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(vColor, opacity * 0.8);
        }
      `,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      globe,
      nodes,
      connections,
      orbitalRings,
      particles,
      animationId: 0,
    };

    const animate = () => {
      if (!sceneRef.current) return;

      const time = Date.now() * 0.001;

      sceneRef.current.globe.rotation.y += 0.001;
      (sceneRef.current.globe.material as THREE.ShaderMaterial).uniforms.time.value = time;

      sceneRef.current.nodes.forEach((node, i) => {
        node.rotation.y += 0.0005 * (i + 1);
        (node.material as THREE.ShaderMaterial).uniforms.time.value = time;
      });

      sceneRef.current.orbitalRings.forEach((ring, i) => {
        ring.rotation.z += 0.001 * (i + 1);
        (ring.material as THREE.ShaderMaterial).uniforms.time.value = time;
      });

      (sceneRef.current.particles.material as THREE.ShaderMaterial).uniforms.time.value = time;

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!sceneRef.current) return;
      sceneRef.current.camera.aspect = window.innerWidth / window.innerHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribeZ = cameraZ.on("change", (latest) => {
      if (sceneRef.current) {
        sceneRef.current.camera.position.z = latest;
      }
    });

    const unsubscribeY = cameraY.on("change", (latest) => {
      if (sceneRef.current) {
        sceneRef.current.camera.position.y = latest;
      }
    });

    const unsubscribeOpacity = globeOpacity.on("change", (latest) => {
      if (sceneRef.current) {
        (sceneRef.current.globe.material as THREE.ShaderMaterial).uniforms.opacity.value = latest;
      }
    });

    return () => {
      unsubscribeZ();
      unsubscribeY();
      unsubscribeOpacity();
    };
  }, [cameraZ, cameraY, globeOpacity]);

  return (
    <div ref={containerRef} className={`fixed inset-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Light blur overlay for better text readability */}
      <div className="absolute inset-0 bg-[#060608]/45 backdrop-blur-[2.5px] pointer-events-none" />
    </div>
  );
};
