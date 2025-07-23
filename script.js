const scene = new THREE.Scene();
let isDarkMode = true;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 50);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight(0xffffff, 2);
scene.add(ambientLight, pointLight);

// Texture loader and URLs
const loader = new THREE.TextureLoader();
const textureURLs = {
  Sun: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204207/2k_sun_o6p9ka.jpg',
  Mercury: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204207/2k_mercury_j3cnfn.jpg',
  Venus: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204207/2k_venus_surface_sbg4rb.jpg',
  Earth: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204207/2k_earth_daymap_cbykis.jpg',
  Mars: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204206/2k_mars_d3u2zl.jpg',
  Jupiter: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204206/2k_jupiter_mnraws.jpg',
  Saturn: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204205/2k_saturn_c5gnjw.jpg',
  Uranus: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204205/2k_uranus_vtbmyf.jpg',
  Neptune: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204205/2k_neptune_fpymzo.jpg',
  Stars: 'https://res.cloudinary.com/dhqfjwhhe/image/upload/v1753204206/8k_stars_jlpe51.jpg'
};

// Add sun
const sunMaterial = new THREE.MeshBasicMaterial({ map: loader.load(textureURLs.Sun) });
const sun = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), sunMaterial);
scene.add(sun);

// Planet setup
const planetData = [
  { name: 'Mercury', size: 0.5, distance: 6, texture: textureURLs.Mercury },
  { name: 'Venus', size: 0.7, distance: 8, texture: textureURLs.Venus },
  { name: 'Earth', size: 0.8, distance: 10, texture: textureURLs.Earth },
  { name: 'Mars', size: 0.6, distance: 12, texture: textureURLs.Mars },
  { name: 'Jupiter', size: 2.0, distance: 16, texture: textureURLs.Jupiter },
  { name: 'Saturn', size: 1.7, distance: 20, texture: textureURLs.Saturn },
  { name: 'Uranus', size: 1.2, distance: 24, texture: textureURLs.Uranus },
  { name: 'Neptune', size: 1.2, distance: 28, texture: textureURLs.Neptune }
];

const planets = [];
const controlsDiv = document.getElementById('controls');

planetData.forEach((planet, i) => {
  const material = new THREE.MeshStandardMaterial({ map: loader.load(planet.texture) });
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = planet.distance;
  scene.add(mesh);

  planets.push({ mesh, distance: planet.distance, angle: 0, speed: 0.01 + i * 0.002 });

  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'slider-container';
  sliderContainer.innerHTML = `<label>${planet.name}</label>`;
  
  const input = document.createElement('input');
  input.type = 'range';
  input.min = '0.001';
  input.max = '0.1';
  input.step = '0.001';
  input.value = 0.01 + i * 0.002;
  input.addEventListener('input', () => {
    planets[i].speed = parseFloat(input.value);
  });

  sliderContainer.appendChild(input);
  controlsDiv.appendChild(sliderContainer);
});

// Background
loader.load(textureURLs.Stars, tex => {
  scene.background = tex;
});

// Animation logic
let paused = false;
document.getElementById('toggle-animation').addEventListener('click', () => {
  paused = !paused;
  document.getElementById('toggle-animation').textContent = paused ? 'Resume' : 'Pause';
});

document.getElementById('toggle-theme').addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.style.backgroundColor = isDarkMode ? '#000' : '#fff';
  document.body.style.color = isDarkMode ? '#fff' : '#000';
});

function animate() {
  requestAnimationFrame(animate);
  if (!paused) {
    planets.forEach(p => {
      p.angle += p.speed;
      p.mesh.position.x = Math.cos(p.angle) * p.distance;
      p.mesh.position.z = Math.sin(p.angle) * p.distance;
    });
  }
  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
