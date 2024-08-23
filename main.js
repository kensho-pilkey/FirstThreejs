import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Galaxy parameters
const starCount = 50000;
const galaxyRadius = 10;
const armCount = 5;
const armSpread = 0.8;
const armTwist = Math.PI / 4;
const pointsGeometry = new THREE.BufferGeometry();
const colors = [];
const pointsMaterial = new THREE.PointsMaterial({ 
    size: 0.02, 
    vertexColors: true, 
    blending: THREE.AdditiveBlending,
    transparent: true
});

// Generate stars with colors and spiral arms
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    const armIndex = i % armCount;
    const radius = Math.pow(Math.random(), 0.5) * galaxyRadius; // Adjust distribution
    const angle = (armIndex / armCount) * 2 * Math.PI + radius * armTwist;
    const spreadFactor = Math.pow(radius / galaxyRadius, 2) * armSpread; // More spread at outer edges
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * spreadFactor;
    const y = (Math.random() - 0.5) * 0.3 * radius;
    const z = Math.sin(angle) * radius + (Math.random() - 0.5) * spreadFactor;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Add color based on distance from the center
    const color = new THREE.Color();
    color.setHSL((radius / galaxyRadius) * 0.1 + 0.6, 1.0, 0.8);
    colors.push(color.r, color.g, color.b);
}

pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
pointsGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
const galaxy = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(galaxy);

// Camera positioning
camera.position.set(0, 15, 20);
camera.lookAt(0, 0, 0);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the galaxy slowly
    galaxy.rotation.y += 0.0005;

    // Update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

animate();

// Adjust camera and renderer on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});