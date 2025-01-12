import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg') as HTMLCanvasElement,
});

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 20);

const controls = new OrbitControls(camera, renderer.domElement);

// Galaxy Particles
const galaxyGeometry = new THREE.BufferGeometry();
const count = 1000;
const positions = [];

for (let i = 0; i < count; i++) {
  const x = THREE.MathUtils.randFloatSpread(100);
  const y = THREE.MathUtils.randFloatSpread(100);
  const z = THREE.MathUtils.randFloatSpread(100);
  positions.push(x, y, z);
}

galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const galaxyMaterial = new THREE.PointsMaterial({
  size: 0.3,
  color: 0x00ffff,
  transparent: true,
});

const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

// Mysterious Light at the Center
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 0);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);

  galaxy.rotation.y += 0.003;
  galaxy.rotation.x += 0.003;

  light.intensity = 1 + 0.5 * Math.sin(Date.now() * 0.002);

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;

  camera.position.x = t * -0.004;
  camera.position.y = t * -0.004;

}

document.body.onscroll = moveCamera;
document.addEventListener('resize', onWindowResize);

animate();

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

// TODO: Deploy the chatbot API and update the URL
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
    const apiUrl =
      "https://portfolio-chatbot-q6cb.onrender.com/recommendation";

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


