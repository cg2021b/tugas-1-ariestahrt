import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';

class FogGUIHelper {
    constructor(fog, backgroundColor) {
        this.fog = fog;
        this.backgroundColor = backgroundColor;
    }
    get near() {
        return this.fog.near;
    }
    set near(v) {
        this.fog.near = v;
        this.fog.far = Math.max(this.fog.far, v);
    }
    get far() {
        return this.fog.far;
    }
    set far(v) {
        this.fog.far = v;
        this.fog.near = Math.min(this.fog.near, v);
    }
    get color() {
        return `#${this.fog.color.getHexString()}`;
    }
    set color(hexString) {
        this.fog.color.set(hexString);
        this.backgroundColor.set(hexString);
    }
}

class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;  // this will call the min setter
    }
}

function animate() {
    
    const canvas = document.querySelector('#canvas');

    const renderer = new THREE.WebGLRenderer({ canvas });
    const gui = new GUI();

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = -4;
    camera.position.z = 10;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const scene = new THREE.Scene();

    function updateCamera() {
        camera.updateProjectionMatrix();
    }

    const camFolder = gui.addFolder('camera');
    camFolder.add(camera, 'fov', 1, 150).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    camFolder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    camFolder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

    {
        const near = 1;
        const far = 30;
        const color = 'lightblue';
        scene.fog = new THREE.Fog(color, near, far);
        scene.background = new THREE.Color(color);

        const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background);
        const fogFolder = gui.addFolder('fog');
        fogFolder.add(fogGUIHelper, 'near', near, far).listen();
        fogFolder.add(fogGUIHelper, 'far', near, far).listen();
        fogFolder.addColor(fogGUIHelper, 'color');
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const geometry = new THREE.BoxGeometry(2, 2, 2);

    function makeInstance(geometry, material, x, y, z) {

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;

        return cube;
    }
    const loader = new THREE.TextureLoader();

    const cubes = [
        makeInstance(geometry, new THREE.MeshBasicMaterial({
            map: loader.load('images/texture-gold.jpg'),
        }), 0, 0, 8),
        makeInstance(geometry, new THREE.MeshBasicMaterial({
            map: loader.load('images/texture-diamond.jpg'),
        }), 8, 0, 0),
        makeInstance(geometry, new THREE.MeshBasicMaterial({
            map: loader.load('images/texture-stone.png'),
        }), -8, 0, 0),
        makeInstance(geometry, new THREE.MeshBasicMaterial({
            map: loader.load('images/texture-brick.png'),
        }), 0, 0, -8)
    ];

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );

    let sphereCamera = new THREE.CubeCamera(1,500,cubeRenderTarget);
    sphereCamera.position.set(0, 0, 0);
    scene.add(sphereCamera);

    let sphereMaterial = new THREE.MeshBasicMaterial({ envMap: sphereCamera.renderTarget });

    let sphereGeo = new THREE.SphereGeometry(1.5, 500, 500);
    const spheres = [
        makeInstance(new THREE.SphereGeometry(3, 500, 500), sphereMaterial, 0, 0, 0),
        makeInstance(sphereGeo, new THREE.MeshBasicMaterial({
            map: loader.load('images/texture-fire.jpg'),
        }), -4, 6, 0),
        makeInstance(sphereGeo, new THREE.MeshBasicMaterial({
            map: loader.load('images/texture-earth.jpg'),
        }), 4, 6, 0)
    ];

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            'images/minecraft360.jpg',
            () => {
                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(renderer, texture);
                scene.background = rt.texture;
            });
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    let t = 0;
    function render(time) {
        time *= 0.001;
        t += 0.01;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.position.x = 15 * Math.cos( t + ndx * Math.PI / 2);
            cube.position.z = 15 * Math.sin( t + ndx * Math.PI / 2);

            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        spheres.forEach((sphere, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            
            // sphere.position.x = 10 * Math.cos( t + ndx * Math.PI / 2);
            // sphere.position.z = 10 * Math.sin( t + ndx * Math.PI / 2);

            sphere.rotation.x = rot;
            sphere.rotation.y = rot;
        });

        renderer.render(scene, camera);
        sphereCamera.update(renderer,scene);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

animate();