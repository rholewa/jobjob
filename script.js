import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Three.js setup
const canvas = document.getElementById('watch-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

// Responsive canvas
function updateSize() {
    const container = canvas.parentElement;
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', updateSize);
updateSize();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(10, 10, 10);
spotLight.angle = 0.15;
spotLight.penumbra = 1;
scene.add(spotLight);

// Load model
const loader = new GLTFLoader();
let model;

loader.load('/apple_watch_series_5.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(220, 220, 220);
    model.position.set(0, 80, 0);
    
    // Adjust materials
    model.traverse((child) => {
        if (child.isMesh) {
            child.material.roughness = 0.5;
            child.material.metalness = 0.7;
            child.material.envMapIntensity = 1;
            if (child.material.map) {
                child.material.map.anisotropy = 16;
            }
        }
    });
    
    scene.add(model);
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

camera.position.z = 200;

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        const t = performance.now() * 0.001;
        model.rotation.y = THREE.MathUtils.lerp(
            model.rotation.y,
            Math.sin(t / 2) * Math.PI / 6,
            0.05
        );
    }
    
    renderer.render(scene, camera);
}

animate();

// Typeform integration
window.openTypeform = function() {
    if (window.tf) {
        window.tf.createPopup('01JB99P1CN4ERF635NTZXBK0FZ').open();
    }
};
