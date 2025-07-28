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

// Theme configuration
const themes = {
  blue: {
    background: [
      new THREE.Color(0x1a2a6c), // Deep blue
      new THREE.Color(0x003366), // Navy
      new THREE.Color(0x35478c)  // Indigo blue
    ],
    prismColors: [0x3366ff, 0x00aaff, 0x66ccff, 0x0088cc, 0x4477aa],
    lightColors: [0x3366ff, 0x00aaff, 0x4477aa],
    waveColor: 0x4fb4ff
  },
  purple: {
    background: [
      new THREE.Color(0x2e1065), // Deep purple
      new THREE.Color(0x4c1d95), // Purple
      new THREE.Color(0x7e22ce)  // Violet
    ],
    prismColors: [0x8b5cf6, 0xa78bfa, 0xc4b5fd, 0xddd6fe, 0x7c3aed],
    lightColors: [0x8b5cf6, 0xa78bfa, 0x7c3aed],
    waveColor: 0xc4b5fd
  },
  green: {
    background: [
      new THREE.Color(0x064e3b), // Deep green
      new THREE.Color(0x065f46), // Emerald
      new THREE.Color(0x047857)  // Green
    ],
    prismColors: [0x10b981, 0x34d399, 0x6ee7b7, 0xa7f3d0, 0x059669],
    lightColors: [0x10b981, 0x34d399, 0x059669],
    waveColor: 0x6ee7b7
  },
  // Add new themes to match CSS
  dark: {
    background: [
      new THREE.Color(0x0b0b0b), // Dark
      new THREE.Color(0x1a1a2e), // Dark blue
      new THREE.Color(0x16213e)  // Navy
    ],
    prismColors: [0x00ffff, 0x00ccff, 0x0088cc, 0x3366ff, 0x4477aa],
    lightColors: [0x00ffff, 0x00ccff, 0x3366ff],
    waveColor: 0x00ffff
  },
  light: {
    background: [
      new THREE.Color(0xf5f5f7), // Light
      new THREE.Color(0xe5e5e7), // Light gray
      new THREE.Color(0xd5d5d7)  // Gray
    ],
    prismColors: [0x0066cc, 0x3399ff, 0x66ccff, 0x99ddff, 0x0088cc],
    lightColors: [0x0066cc, 0x3399ff, 0x0088cc],
    waveColor: 0x3399ff
  },
  cyberpunk: {
    background: [
      new THREE.Color(0x0a0a16), // Dark blue
      new THREE.Color(0x1a0033), // Deep purple
      new THREE.Color(0x330066)  // Purple
    ],
    prismColors: [0xff00ff, 0xaa00ff, 0xcc00cc, 0xff33ff, 0xdd00dd],
    lightColors: [0xff00ff, 0xaa00ff, 0xff33ff],
    waveColor: 0xff00ff
  },
  ocean: {
    background: [
      new THREE.Color(0x001e3c), // Deep blue
      new THREE.Color(0x003366), // Navy
      new THREE.Color(0x004d7a)  // Ocean blue
    ],
    prismColors: [0x00bfff, 0x007bb8, 0x0099cc, 0x33ccff, 0x0088cc],
    lightColors: [0x00bfff, 0x007bb8, 0x33ccff],
    waveColor: 0x00bfff
  },
  forest: {
    background: [
      new THREE.Color(0x0a1f0a), // Deep green
      new THREE.Color(0x1b2e1b), // Forest
      new THREE.Color(0x2d462d)  // Dark green
    ],
    prismColors: [0x4caf50, 0x2e7d32, 0x66bb6a, 0x81c784, 0x388e3c],
    lightColors: [0x4caf50, 0x2e7d32, 0x388e3c],
    waveColor: 0x4caf50
  },
  "soft-pink": {
    background: [
      new THREE.Color(0xfff0f5), // Light pink
      new THREE.Color(0xffdae5), // Pink
      new THREE.Color(0xffe4e8)  // Soft pink
    ],
    prismColors: [0xff69b4, 0xdb7093, 0xff99cc, 0xffb6c1, 0xffc0cb],
    lightColors: [0xff69b4, 0xdb7093, 0xff99cc],
    waveColor: 0xff69b4
  }
};

// Default theme
let currentTheme = 'dark'; // Changed default to match HTML/CSS

// Create a gradient background with theme support
const createGradientBackground = (theme = currentTheme) => {
  const colors = themes[theme as keyof typeof themes].background;
  
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

// Create the flowing wave mesh with theme support
const createWaveMesh = (theme = currentTheme) => {
  const waveColor = themes[theme as keyof typeof themes].waveColor;
  const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
  const material = new THREE.MeshStandardMaterial({
    color: waveColor,
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

// Initialize with default theme
createGradientBackground();
let wave = createWaveMesh();
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

// Create a collection of prisms with theme support
const prisms: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshPhysicalMaterial, THREE.Object3DEventMap>[] = [];
let prismColors = themes[currentTheme as keyof typeof themes].prismColors;

// Function to create prisms with current theme colors
const createPrisms = (theme = currentTheme) => {
  // Clear existing prisms
  prisms.forEach(prism => {
    scene.remove(prism);
  });
  prisms.length = 0;
  
  // Get colors from the current theme
  prismColors = themes[theme as keyof typeof themes].prismColors;
  
  // Create new prisms
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
};

createPrisms();

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

// Light beams with theme support
const lightBeams: THREE.SpotLight[] = [];

// Function to create light beams with current theme colors
const createLightBeams = (theme = currentTheme) => {
  // Clear existing light beams
  lightBeams.forEach(beam => {
    scene.remove(beam);
    scene.remove(beam.target);
  });
  lightBeams.length = 0;
  
  // Get colors from the current theme
  const lightColors = themes[theme as keyof typeof themes].lightColors;
  
  // Create new light beams
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
};

createLightBeams();

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
    const {rotationSpeed, floatOffset, originalY } = prism.userData;
    
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
  camera.rotation.x = t * -0.00001;
  
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

  // Track if this is the first API call
  let isFirstApiCall = true;
  const MAX_RETRIES = 3;

  // Function to add a message to the chat
  const addMessage = (message: string, isUser = false) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", isUser ? "user" : "bot");
    messageDiv.innerHTML = `<p class="chat-color">${message}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  // Function to send POST request and handle response
  const getBotResponse = async (question: string, retryCount = 0) => {
    const apiUrl = "https://portfolioagent.onrender.com/chat";

    try {
      // Create thinking message with advanced animation
      const thinkingMessage = document.createElement("div");
      thinkingMessage.classList.add("chat-message", "bot");
      thinkingMessage.innerHTML = `
        <div class="message-connector"></div>
        <div class="message-content">
          <div class="message-header">
            <span class="agent-name">PORTFOLIO-AI</span>
            <span class="timestamp">${isFirstApiCall ? "INITIALIZING" : "PROCESSING"}</span>
          </div>
          <p class="thinking-anim">
            <span>${isFirstApiCall ? "Warming up systems" : "Analyzing query"}</span>
            <span class="thinking-dots">
              <span></span><span></span><span></span>
            </span>
          </p>
          <div class="message-footer">
            <div class="confidence-indicator">
              <span class="confidence-label">ANALYSIS:</span>
              <div class="confidence-bar medium"></div>
            </div>
          </div>
        </div>
      `;
      chatBody.appendChild(thinkingMessage);
      chatBody.scrollTop = chatBody.scrollHeight;

      // Set a longer timeout for the first API call
      const timeoutDuration = isFirstApiCall ? 30000 : 15000; // 30 seconds for first call, 15 for others
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), timeoutDuration);
      });

      // Send request to API with timeout
      const fetchPromise = fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      // Race between the fetch and the timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      // First successful call completed
      isFirstApiCall = false;
      
      // Remove thinking message
      thinkingMessage.remove();
      
      // Format timestamp
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Add bot response with advanced styling
      const botMessage = document.createElement("div");
      botMessage.classList.add("chat-message", "bot");
      botMessage.innerHTML = `
        <div class="message-connector"></div>
        <div class="message-content">
          <div class="message-header">
            <span class="agent-name">PORTFOLIO-AI</span>
            <span class="timestamp">${timestamp}</span>
          </div>
          <p class="chat-color">${data.answer || "Analysis incomplete. Please rephrase your query."}</p>
          <div class="message-footer">
            <div class="confidence-indicator">
              <span class="confidence-label">CONFIDENCE:</span>
              <div class="confidence-bar high"></div>
            </div>
          </div>
        </div>
      `;
      
      chatBody.appendChild(botMessage);
      chatBody.scrollTop = chatBody.scrollHeight;
      
    } catch (error) {
      console.error("Error:", error);
      
      // Remove the thinking message if it exists
      const thinkingMsg = document.querySelector(".chat-message.bot:last-child");
      if (thinkingMsg) thinkingMsg.remove();
      
      // For the first API call, implement retry logic
      if (isFirstApiCall && retryCount < MAX_RETRIES) {
        const retryMessage = document.createElement("div");
        retryMessage.classList.add("chat-message", "bot");
        retryMessage.innerHTML = `
          <div class="message-connector"></div>
          <div class="message-content">
            <div class="message-header">
              <span class="agent-name">SYSTEM</span>
              <span class="timestamp">RETRY</span>
            </div>
            <p class="chat-color">Initializing AI systems. Retrying in a moment... (${retryCount + 1}/${MAX_RETRIES})</p>
            <div class="message-footer">
              <div class="confidence-indicator">
                <span class="confidence-label">STATUS:</span>
                <div class="confidence-bar medium"></div>
              </div>
            </div>
          </div>
        `;
        
        chatBody.appendChild(retryMessage);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Wait and retry
        setTimeout(() => {
          retryMessage.remove();
          getBotResponse(question, retryCount + 1);
        }, 5000); // Wait 5 seconds before retrying
        
        return;
      }
      
      // Add error message if retries exhausted or not first call
      const errorMessage = document.createElement("div");
      errorMessage.classList.add("chat-message", "bot");
      errorMessage.innerHTML = `
        <div class="message-connector"></div>
        <div class="message-content">
          <div class="message-header">
            <span class="agent-name">SYSTEM</span>
            <span class="timestamp">ERROR</span>
          </div>
          <p class="chat-color">${isFirstApiCall ? 
            "AI systems are still initializing. Please try again in a minute." : 
            "Neural connection interrupted. Unable to process request. Please try again."}</p>
          <div class="message-footer">
            <div class="confidence-indicator">
              <span class="confidence-label">STATUS:</span>
              <div class="confidence-bar low"></div>
            </div>
          </div>
        </div>
      `;
      
      chatBody.appendChild(errorMessage);
      chatBody.scrollTop = chatBody.scrollHeight;
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

// Add this at the end of your file, before any animation loops
// Listen for theme changes from the HTML/CSS theme switcher
document.addEventListener('DOMContentLoaded', () => {
  // Get initial theme from body class
  const bodyClass = document.body.className;
  const initialTheme = bodyClass.replace('-theme', '');
  
  // Set initial 3D background theme
  if (themes[initialTheme as keyof typeof themes]) {
    currentTheme = initialTheme;
    updateSceneTheme(currentTheme);
  }
  // Listen for theme changes
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      if (theme && themes[theme as keyof typeof themes]) {
        currentTheme = theme;
        updateSceneTheme(currentTheme);
      }
    });
  });
  
  // Function to update all theme-dependent elements in the scene
  function updateSceneTheme(theme: string) {
    // Update background
    createGradientBackground(theme);
    
    // Update wave color
    if (wave) {
      scene.remove(wave);
      wave = createWaveMesh(theme); 
      scene.add(wave);
    }
    
    // Update prism colors if they exist
    if (prisms) {
      prisms.forEach((prism, index) => {
        const prismColors = themes[theme as keyof typeof themes].prismColors;
        const color = prismColors[index % prismColors.length];
        (prism.material as THREE.MeshStandardMaterial).color.set(color);
      });
    }
    
    // Update light colors if they exist
    if (lightBeams) {
      lightBeams.forEach((light, index) => {
        const lightColors = themes[theme as keyof typeof themes].lightColors;
        const color = lightColors[index % lightColors.length];
        light.color.set(color);
      });
    }
  }
});