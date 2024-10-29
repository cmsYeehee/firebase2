// Configuration
const CONFIG = {
    RENDERER: {
        antialias: false,
        powerPreference: "high-performance",
        precision: "mediump"
    },
    TEXTURE_SIZE: 512,
    STAR_COUNT: 50,
    NEBULA: {
        layers: 3,
        colors: ['#0a1466', '#1a3ca0', '#4169e1']
    }
};

// Create and add styles for planet screen
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .planet-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
            z-index: 1000;
        }

        .planet-screen.active {
            opacity: 1;
            pointer-events: all;
        }

        .planet-screen h1 {
            color: white;
            font-size: 48px;
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease 0.3s;
        }

        .planet-screen.active h1 {
            opacity: 1;
            transform: translateY(0);
        }

        .back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 10px 20px;
            background: rgba(79, 156, 255, 0.3);
            border: 1px solid #4f9cff;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            font-family: Arial, sans-serif;
            transition: background 0.3s ease;
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.5s ease 0.5s;
        }

        .planet-screen.active .back-button {
            opacity: 1;
            transform: translateX(0);
        }

        .back-button:hover {
            background: rgba(79, 156, 255, 0.5);
        }
    `;
    document.head.appendChild(style);
}

// Create nebula effect
function createNebula() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.6';
    document.getElementById('scene-container').prepend(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');

    function drawNebula() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        CONFIG.NEBULA.colors.forEach((color, index) => {
            for (let i = 0; i < 3; i++) {
                const gradient = ctx.createRadialGradient(
                    canvas.width * (0.3 + Math.sin(Date.now() * 0.0001 + index) * 0.2),
                    canvas.height * (0.5 + Math.cos(Date.now() * 0.0001 + index) * 0.2),
                    0,
                    canvas.width * (0.3 + Math.sin(Date.now() * 0.0001 + index) * 0.2),
                    canvas.height * (0.5 + Math.cos(Date.now() * 0.0001 + index) * 0.2),
                    canvas.width * 0.5
                );

                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'transparent');

                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        });

        requestAnimationFrame(drawNebula);
    }

    drawNebula();
}

// Create planet screen
function createPlanetScreen() {
    const screen = document.createElement('div');
    screen.className = 'planet-screen';
    
    const title = document.createElement('h1');
    screen.appendChild(title);
    
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '← Back to Solar System';
    backButton.addEventListener('click', () => {
        screen.classList.remove('active');
        resumeAnimation();
    });
    screen.appendChild(backButton);
    
    document.body.appendChild(screen);
    return screen;
}

function showPlanetScreen(planetName) {
    const screen = document.querySelector('.planet-screen');
    const title = screen.querySelector('h1');
    title.textContent = planetName;
    screen.classList.add('active');
    pauseAnimation();
}
class CometSystem {
    constructor() {
        this.comets = [];
        this.active = false;
        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = '0';
        document.body.appendChild(this.container);
        
        this.createToggle();
        this.animate = this.animate.bind(this);
        this.lastCometTime = 0;
        this.cometInterval = 2000; // New comet every 2 seconds
    }

    createToggle() {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'comet-toggle';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'comet-toggle';
        
        const label = document.createElement('label');
        label.htmlFor = 'comet-toggle';
        label.textContent = 'Show Comets';
        
        toggleContainer.appendChild(checkbox);
        toggleContainer.appendChild(label);
        document.body.appendChild(toggleContainer);
        
        checkbox.addEventListener('change', (e) => {
            this.active = e.target.checked;
            if (this.active) {
                this.start();
            } else {
                this.stop();
            }
        });
    }

    createComet() {
        const comet = document.createElement('div');
        comet.className = 'comet';
        
        // Random starting position above the screen
        const startX = Math.random() * window.innerWidth;
        const startY = -50;
        
        // Random ending position below the screen
        const endX = startX - (Math.random() * 500 + 200);
        const endY = window.innerHeight + 50;
        
        comet.style.left = `${startX}px`;
        comet.style.top = `${startY}px`;
        
        // Random rotation for varied angles
        const angle = Math.atan2(endY - startY, endX - startX);
        comet.style.transform = `rotate(${angle}rad)`;
        
        this.container.appendChild(comet);
        
        // Animate the comet
        const duration = Math.random() * 1000 + 1000; // 1-2 seconds
        const animation = comet.animate([
            { opacity: 0, transform: `rotate(${angle}rad) translateX(0)` },
            { opacity: 1, transform: `rotate(${angle}rad) translateX(100px)`, offset: 0.1 },
            { opacity: 1, transform: `rotate(${angle}rad) translateX(${Math.hypot(endX - startX, endY - startY)}px)`, offset: 0.8 },
            { opacity: 0, transform: `rotate(${angle}rad) translateX(${Math.hypot(endX - startX, endY - startY)}px)` }
        ], {
            duration: duration,
            easing: 'linear'
        });
        
        animation.onfinish = () => {
            comet.remove();
            const index = this.comets.indexOf(comet);
            if (index > -1) {
                this.comets.splice(index, 1);
            }
        };
        
        this.comets.push(comet);
    }

    animate(currentTime) {
        if (!this.active) return;
        
        if (currentTime - this.lastCometTime > this.cometInterval) {
            this.createComet();
            this.lastCometTime = currentTime;
        }
        
        requestAnimationFrame(this.animate);
    }

    start() {
        this.active = true;
        this.animate(performance.now());
    }

    stop() {
        this.active = false;
        this.comets.forEach(comet => comet.remove());
        this.comets = [];
    }
}
class VisitCounter {
        constructor() {
            this.createCounter();
            this.incrementCount();
        }
    
        createCounter() {
            const counter = document.createElement('div');
            counter.className = 'visit-counter';
            
            // Get current count from localStorage or start at 0
            const currentCount = this.getCount();
            
            counter.innerHTML = `
                Explored <span>${currentCount}</span> times
            `;
            
            document.body.appendChild(counter);
        }
    
        getCount() {
            return parseInt(localStorage.getItem('explorationCount') || '0');
        }
    
        incrementCount() {
            const newCount = this.getCount() + 1;
            localStorage.setItem('explorationCount', newCount.toString());
            
            // Update the display
            const counterSpan = document.querySelector('.visit-counter span');
            if (counterSpan) {
                counterSpan.textContent = newCount;
            }
        }
    }
window.addEventListener('load', () => {
    // Scene variables
    let scene, camera, renderer, planets = [], star, stars;
    let animationPaused = false;
    let animationRunning = false;
    
    const planetInfo = document.getElementById('planet-info');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBarFill = document.getElementById('loading-bar-fill');
    const loadingText = document.getElementById('loading-text');
    const errorMessage = document.getElementById('error-message');

    // Resource Manager for model caching
    const ResourceManager = {
        modelCache: new Map(),
        
        async loadModel(path) {
            if (this.modelCache.has(path)) {
                return this.modelCache.get(path).clone();
            }
            
            const loader = new window.GLTFLoader();
            const gltf = await new Promise((resolve, reject) => {
                loader.load(path, resolve, undefined, reject);
            });
            
            this.modelCache.set(path, gltf.scene.clone());
            return gltf.scene;
        }
    };

    function showError(message) {
        console.error(message);
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.style.display = 'none', 5000);
    }

    function updateLoadingText(text) {
        loadingText.textContent = text;
        console.log('Loading status:', text);
    }

    function pauseAnimation() {
        animationPaused = true;
    }

    function resumeAnimation() {
        animationPaused = false;
        if (!animationRunning) {
            animationRunning = true;
            animate();
        }
    }

    function createBackgroundStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.25,
            transparent: true,
            opacity: 1.0,
            sizeAttenuation: false
        });

        const starPositions = [];
        const starSizes = [];

        for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 90 + Math.random() * 10;

            starPositions.push(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            starSizes.push(0.5 + Math.random() * 0.5);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

        stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        function animateStars() {
            const sizes = starGeometry.attributes.size.array;
            for (let i = 0; i < sizes.length; i++) {
                sizes[i] = 0.5 + Math.random() * 0.5;
            }
            starGeometry.attributes.size.needsUpdate = true;
        }

        setInterval(animateStars, 1000);
    }

    class Planet {
        constructor(modelPath, orbitRadius, orbitSpeed, name, description) {
            this.orbitRadius = orbitRadius;
            this.orbitSpeed = orbitSpeed;
            this.angle = Math.random() * Math.PI * 2;
            this.name = name;
            this.description = description;
            this.loaded = false;
            this.loadModel(modelPath);
        }

        loadModel(modelPath) {
            updateLoadingText(`Loading ${this.name}...`);
            
            const loader = new window.GLTFLoader();
            loader.load(
                modelPath,
                (gltf) => {
                    this.mesh = gltf.scene;
                    this.mesh.scale.set(0.2, 0.2, 0.2);
                    this.mesh.userData.planet = this;
                    this.updatePosition();
                    scene.add(this.mesh);
                    this.loaded = true;
                    updateLoadingText(`${this.name} loaded successfully`);
                },
                (progress) => {
                    const percentComplete = (progress.loaded / progress.total) * 100;
                    updateLoadingText(`Loading ${this.name}: ${Math.round(percentComplete)}%`);
                },
                (error) => {
                    showError(`Error loading ${this.name}: ${error.message}`);
                }
            );
        }

        updatePosition() {
            if (this.mesh) {
                const x = Math.cos(this.angle) * this.orbitRadius;
                const z = Math.sin(this.angle) * this.orbitRadius;
                this.mesh.position.set(x, 0, z);
                this.mesh.rotation.y = -this.angle + Math.PI / 2;
            }
        }

        update() {
            if (this.mesh && this.loaded) {
                this.angle += this.orbitSpeed;
                this.updatePosition();
                this.mesh.rotation.x = Math.sin(this.angle * 2) * 0.1;
            }
        }
    }

    function initScene() {
        updateLoadingText('Initializing scene...');
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({ 
            antialias: false,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('scene-container').appendChild(renderer.domElement);

        camera.position.z = 12;
        camera.position.y = 3;
        camera.lookAt(0, 0, 0);
        const cometSystem = new CometSystem();

        createNebula();
        createBackgroundStars();
        const visitCounter = new VisitCounter();

        scene.add(new THREE.AmbientLight(0x333333));
        const starLight = new THREE.PointLight(0x4f9cff, 2, 50);
        starLight.position.set(0, 0, 0);
        scene.add(starLight);

        updateLoadingText('Scene initialized');
    }

    function loadModels() {
        updateLoadingText('Starting model loading...');

        planets.push(
            new Planet('models/planets/ocean-planet.glb', 3, 0.01, 'Ocean World', 
                'A serene aquatic paradise filled with vast oceans and floating islands.'),
            new Planet('models/planets/jungle-planet.glb', 5, 0.007, 'Jungle World',
                'A lush world teeming with exotic flora and fauna.'),
            new Planet('models/planets/mountain-planet.glb', 7, 0.005, 'Mountain World',
                'A rugged landscape of towering peaks and deep valleys.')
        );

        updateLoadingText('Loading star...');
        const starLoader = new window.GLTFLoader();
        starLoader.load(
            'models/star/star.glb',
            (gltf) => {
                star = gltf.scene;
                star.scale.set(0.125, 0.125, 0.125);
                star.position.set(0, 0, 0);
                scene.add(star);
                updateLoadingText('Star loaded successfully');
                
                star.userData.animate = () => {
                    const pulseScale = 0.125 + Math.sin(Date.now() * 0.002) * 0.01;
                    star.scale.set(pulseScale, pulseScale, pulseScale);
                };

                checkLoadingComplete();
            },
            (progress) => {
                const percentComplete = (progress.loaded / progress.total) * 100;
                updateLoadingText(`Loading star: ${Math.round(percentComplete)}%`);
            },
            (error) => {
                showError(`Error loading star: ${error.message}`);
            }
        );
    }

    function checkLoadingComplete() {
        if (star && planets.every(planet => planet.loaded)) {
            updateLoadingText('All models loaded successfully');
            loadingScreen.style.display = 'none';
        }
    }

    function setupInteraction() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            let foundPlanet = false;
            for (let intersect of intersects) {
                let object = intersect.object;
                while (object.parent && !object.userData.planet) {
                    object = object.parent;
                }
                if (object.userData.planet) {
                    planetInfo.innerHTML = `
                        <h2>${object.userData.planet.name}</h2>
                        <p>${object.userData.planet.description}</p>
                    `;
                    planetInfo.style.opacity = 1;
                    foundPlanet = true;
                    document.body.style.cursor = 'pointer';
                    break;
                }
            }
            if (!foundPlanet) {
                planetInfo.style.opacity = 0;
                document.body.style.cursor = 'default';
            }
        });

        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            for (let intersect of intersects) {
                let object = intersect.object;
                while (object.parent && !object.userData.planet) {
                    object = object.parent;
                }
                if (object.userData.planet) {
                    showPlanetScreen(object.userData.planet.name);
                    break;
                }
            }
        });
    }

    function animate() {
        if (animationPaused) {
            animationRunning = false;
            return;
        }
        
        requestAnimationFrame(animate);
        planets.forEach(planet => planet.update());
        
        if (star?.userData.animate) {
            star.userData.animate();
        }
        
        renderer.render(scene, camera);
        animationRunning = true;
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Initialize everything
    addStyles();
    createPlanetScreen();
    initScene();
    loadModels();
    setupInteraction();
    animate();
});