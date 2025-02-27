import * as THREE from 'three';

// Create scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg') as HTMLCanvasElement,
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
camera.position.set(0, 0, 20);

// Create a gradient background
const createGradientBackground = () => {
  const colors = [
    new THREE.Color(0x1a2a6c), // Deep blue
    new THREE.Color(0x003366), // Navy
    new THREE.Color(0x35478c)  // Indigo blue
  ];
  
  const canvasSize = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  
  const context = canvas.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 0, canvasSize);
  
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), `#${color.getHexString()}`);
  });
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvasSize, canvasSize);
  
  const texture = new THREE.CanvasTexture(canvas);
  scene.background = texture;
};

createGradientBackground();

// Create the flowing wave mesh
const createWaveMesh = () => {
  const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4fb4ff,
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    wireframe: false
  });
  
  const wave = new THREE.Mesh(geometry, material);
  wave.rotation.x = Math.PI / 2;
  wave.position.y = -20;
  
  return wave;
};

const wave = createWaveMesh();
scene.add(wave);

// Create floating triangular prisms
const createPrism = (size: number, color: number, x: number, y: number, z: number, rotation = 0) => {
  // Create a triangular prism
  const geometry = new THREE.CylinderGeometry(0, size, size * 2, 3, 1);
  const material = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.6,
    roughness: 0.2,
    reflectivity: 0.6,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.9
  });
  
  const prism = new THREE.Mesh(geometry, material);
  prism.position.set(x, y, z);
  prism.rotation.x = rotation;
  prism.castShadow = true;
  prism.receiveShadow = true;
  
  // Add custom properties for animation
  prism.userData = {
    floatSpeed: Math.random() * 0.003 + 0.001, // Slower, more subtle floating
    rotationSpeed: Math.random() * 0.003 + 0.001, // Slower rotation
    floatOffset: Math.random() * Math.PI * 2,
    originalY: y
  };
  
  return prism;
};

// Create a collection of prisms - reduced number for better performance
const prisms: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshPhysicalMaterial, THREE.Object3DEventMap>[] = [];
const prismColors = [0x3366ff, 0x00aaff, 0x66ccff, 0x0088cc, 0x4477aa]; // More professional blue palette

// Reduced number of prisms for better performance and cleaner look
for (let i = 0; i < 15; i++) {
  const size = Math.random() * 1.5 + 0.5;
  const x = Math.random() * 80 - 40;
  const y = Math.random() * 40 - 20;
  const z = Math.random() * 40 - 20;
  const color = prismColors[Math.floor(Math.random() * prismColors.length)];
  const rotation = Math.random() * Math.PI;
  
  const prism = createPrism(size, color, x, y, z, rotation);
  prisms.push(prism);
  scene.add(prism);
}

// Create light beams (spotlight)
const createLightBeam = (color: THREE.ColorRepresentation | undefined, x: number, y: number, z: number, targetX: number, targetY: number, targetZ: number) => {
  const spotlight = new THREE.SpotLight(color, 2, 100, Math.PI / 8, 0.6, 1);
  spotlight.position.set(x, y, z);
  
  const target = new THREE.Object3D();
  target.position.set(targetX, targetY, targetZ);
  scene.add(target);
  spotlight.target = target;
  
  spotlight.castShadow = true;
  spotlight.shadow.bias = -0.0001;
  spotlight.shadow.mapSize.width = 1024;
  spotlight.shadow.mapSize.height = 1024;
  
  return spotlight;
};

// Add multiple colored light beams - using more professional colors
const lightBeams: THREE.SpotLight[] = [];
const lightColors = [0x3366ff, 0x00aaff, 0x4477aa]; // Professional blue tones

for (let i = 0; i < 3; i++) {
  const x = Math.random() * 30 - 15;
  const y = 40;
  const z = Math.random() * 30 - 15;
  const targetX = x * 0.8;
  const targetY = -30;
  const targetZ = z * 0.8;
  
  const beam = createLightBeam(lightColors[i], x, y, z, targetX, targetY, targetZ);
  lightBeams.push(beam);
  scene.add(beam);
}

// Add ambient light - slightly brighter for better visibility
const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

// Create fog particles - reduced count for better performance
const createFogParticles = () => {
  const particleCount = 500; // Reduced for better performance
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = Math.random() * 80 - 40;
    positions[i3 + 1] = Math.random() * 40 - 20;
    positions[i3 + 2] = Math.random() * 80 - 40;
    sizes[i] = Math.random() * 1.5 + 0.3;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.4,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  return new THREE.Points(geometry, material);
};

const fogParticles = createFogParticles();
scene.add(fogParticles);

// Animation loop with scroll interaction
function animate() {
  requestAnimationFrame(animate);
  
  // Animate wave vertices for flowing effect - smoother, more subtle waves
  const waveVertices = (wave.geometry as THREE.PlaneGeometry).attributes.position;
  const time = Date.now() * 0.0003; // Slower time factor for more subtle animation
  
  for (let i = 0; i < waveVertices.count; i++) {
    const x = waveVertices.getX(i);
    const y = waveVertices.getY(i);
    
    // Create more subtle wave pattern
    const xOffset = (x + time) * 0.3;
    const yOffset = (y + time) * 0.3;
    const amplitude = 1.5; // Reduced amplitude for subtler waves
    const newZ = Math.sin(xOffset) * Math.cos(yOffset) * amplitude;
    
    waveVertices.setZ(i, newZ);
  }
  
  waveVertices.needsUpdate = true;
  
  // Animate prisms (floating and rotating) - more subtle, professional movement
  prisms.forEach(prism => {
    const { floatSpeed, rotationSpeed, floatOffset, originalY } = prism.userData;
    
    // Make prisms float up and down with more subtle movement
    prism.position.y = originalY + Math.sin(time * 2 + floatOffset) * 1.5;
    
    // Rotate prisms more slowly for a professional look
    prism.rotation.y += rotationSpeed;
    prism.rotation.z += rotationSpeed * 0.5;
  });
  
  // Animate light beams with more subtle changes
  lightBeams.forEach((beam, index) => {
    const intensity = 1.5 + Math.sin(time * 2 + index) * 0.5; // Less dramatic intensity changes
    beam.intensity = intensity > 0 ? intensity : 0.5;
    
    // Slower movement for light positions
    beam.position.x += Math.sin(time * 0.3 + index) * 0.05;
    beam.position.z += Math.cos(time * 0.3 + index) * 0.05;
  });
  
  // Very subtle fog movement
  fogParticles.rotation.y += 0.002;
  fogParticles.position.y = Math.sin(time) * 1;
  
  renderer.render(scene, camera);
}

// Resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Enhanced scroll interaction for parallax effect - more subtle for professional look
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  
  // Move camera based on scroll position - more subtle movement
  camera.position.z = 20 + t * -0.01;
  camera.position.x = t * -0.003;
  camera.position.y = Math.max(-10, Math.min(10, t * 0.005));
  
  // Very subtle camera rotation
  camera.rotation.y = t * -0.00001;
  
  // Create parallax effect by moving different elements at different speeds
  prisms.forEach((prism, index) => {
    const speedFactor = 0.3 + (index % 3) * 0.1; // More subtle speed differences
    prism.position.y = prism.userData.originalY - t * 0.002 * speedFactor;
  });
  
  // Move light beams with scroll - more subtle
  lightBeams.forEach((beam, index) => {
    const speedFactor = 0.2 + (index % 3) * 0.1;
    beam.position.y = 40 - t * 0.005 * speedFactor;
    beam.target.position.y = -30 - t * 0.004 * speedFactor;
  });
}

// Add performance optimization - throttle scroll events
function throttle(fn: Function, delay: number) {
  let lastCall = 0;
  return function(...args: any[]) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

// Event listeners with throttling for better performance
document.body.onscroll = throttle(moveCamera, 20);
window.addEventListener('resize', throttle(onWindowResize, 100));

// Initialize animation
animate();

// Navigation toggle code (kept from original)
const navToggle = document.querySelector(".mobile-nav-toggle");
const navMenu = document.querySelector("#primary-navigation");

if (navToggle) {
    navToggle.addEventListener("click", () => {
        if (navMenu) {
            const visible = navMenu.getAttribute("data-visible");
            if (visible === "false") {
                navMenu.setAttribute("data-visible", "true");
                navToggle.setAttribute("aria-expanded", "true");
            } else {
                navMenu.setAttribute("data-visible", "false");
                navToggle.setAttribute("aria-expanded", "false");
            }
        }
    });
}

// Chat functionality (kept from original)
document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input") as HTMLInputElement;
  const chatSend = document.getElementById("chat-send") as HTMLButtonElement;
  const chatBody = document.getElementById("chat-body") as HTMLDivElement;

  // Function to add a message to the chat
  const addMessage = (message: string, isUser = false) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", isUser ? "user" : "bot");
    messageDiv.innerHTML = `<p class="chat-color">${message}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  // Function to send POST request and handle response
  const getBotResponse = async (question: string) => {
    const apiUrl = "https://portfolio-chatbot-q6cb.onrender.com/recommendation";

    try {
      // Add a "bot is typing" message
      const typingMessage = document.createElement("div");
      typingMessage.classList.add("chat-message", "bot");
      typingMessage.innerHTML = `<p class="thinking-effect">Thinking...</p>`;
      chatBody.appendChild(typingMessage);
      chatBody.scrollTop = chatBody.scrollHeight;

      // Send POST request to the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Something went wrong. Please try again later.");
      }

      // Wait for the full response
      const data = await response.json();

      // Remove the "bot is typing" message
      typingMessage.remove();

      // Display the bot's response
      addMessage(data.result || "Sorry, I couldn't understand that.");
    } catch (error) {
      console.error("Error:", error);

      // Remove the "bot is typing" message and show error
      const typingMessage = document.querySelector(".chat-message.bot:last-child");
      if (typingMessage) typingMessage.remove();
      addMessage("Unable to connect to the server. Please try again later.");
    }
  };

  // Function to handle chat interactions
  const handleChat = () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Add user message to the chat
    addMessage(userMessage, true);
    chatInput.value = "";

    // Send the question to the server
    getBotResponse(userMessage);
  };

  // Event listeners for sending messages
  chatSend.addEventListener("click", handleChat);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleChat();
  });
});