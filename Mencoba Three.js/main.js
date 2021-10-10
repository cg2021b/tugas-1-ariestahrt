import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

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

function animate () {
    let objects = [];
    let light_objects = {
        DirectionalLight: {
            active: true,
            members: []
        },
        HemisphereLight: {
            active: false,
            members: []
        },
        AmbientLight: {
            active: false,
            members: []
        },
        PointLight: {
            active: false,
            members: []
        },
        Spotlights: {
            active: false,
            members: []
        }
    };

    function generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '0x';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return parseInt(color, 16);
    }

    // Setup the camera
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect , near, far );
    camera.position.set(0, 10, 25);

    let canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        logarithmicDepthBuffer: true,
        antialias: true,
        powerPreference: "high-performance",
        alpha: false
    });

    renderer.setPixelRatio( window.devicePixelRatio );

    // renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );

    function updateCamera() {
        camera.updateProjectionMatrix();
    }

    // SET UI CONTROLNYA
    const gui = new GUI();
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('far').onChange(updateCamera);
    
    let lightBarProps = {
        DirectionalLight: true,
        HemisphereLight:false,
        AmbientLight:false,
        PointLight:false,
        Spotlights:false,
    }

    let DirectionalLight_TOGGLE = gui.add(lightBarProps,'DirectionalLight').name('DirectionalLight').listen();
    DirectionalLight_TOGGLE.onChange((newValue) => {
        setLight('DirectionalLight', newValue)
    });

    let HemisphereLight_TOGGLE = gui.add(lightBarProps,'HemisphereLight').name('HemisphereLight').listen();
    HemisphereLight_TOGGLE.onChange((newValue) => {
        setLight('HemisphereLight', newValue)
    });

    let AmbientLight_TOGGLE = gui.add(lightBarProps,'AmbientLight').name('AmbientLight').listen();
    AmbientLight_TOGGLE.onChange((newValue) => {
        setLight('AmbientLight', newValue)
    });

    let PointLight_TOGGLE = gui.add(lightBarProps,'PointLight').name('PointLight').listen();
    PointLight_TOGGLE.onChange((newValue) => {
        setLight('PointLight', newValue)
    });

    let Spotlights_TOGGLE = gui.add(lightBarProps,'Spotlights').name('Spotlights').listen();
    Spotlights_TOGGLE.onChange((newValue) => {
        setLight('Spotlights', newValue)
    });

    // SET CAMERA CONTROLNYA
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x21252d);

    function setLight(type, active){
        if(type == 'HemisphereLight'){
            if(active){
                light_objects.HemisphereLight.members.forEach((light) => {
                    scene.add(light);
                });
            }else{
                light_objects.HemisphereLight.members.forEach((light) => {
                    scene.remove(light);
                });
                light_objects.HemisphereLight.active = false;
            }
        }

        if(type == 'DirectionalLight'){
            if(active){
                light_objects.DirectionalLight.members.forEach((light) => {
                    scene.add(light);
                });
            }else{
                light_objects.DirectionalLight.members.forEach((light) => {
                    scene.remove(light);
                });
                light_objects.DirectionalLight.active = false;
            }
        }

        if(type == 'AmbientLight'){
            if(active){
                light_objects.AmbientLight.members.forEach((light) => {
                    scene.add(light);
                });    
            }else{
                light_objects.AmbientLight.members.forEach((light) => {
                    scene.remove(light);
                });
                light_objects.AmbientLight.active = false;
            }
        }

        if(type == 'PointLight'){
            if(active){
                light_objects.PointLight.members.forEach((light) => {
                    scene.add(light);
                });    
            }else{
                light_objects.PointLight.members.forEach((light) => {
                    scene.remove(light);
                });
                light_objects.PointLight.active = false;
            }
        }

        if(type == 'Spotlights'){
            if(active){
                light_objects.Spotlights.members.forEach((light) => {
                    scene.add(light);
                    // scene.add(light.target);
                });    
            }else{
                light_objects.Spotlights.members.forEach((light) => {
                    scene.remove(light);
                });
                light_objects.Spotlights.active = false;
            }

        }
    }

    // Directional Light
    {
        function DirectionalFactory(color, intensity, position){
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(position[0], position[1], position[2]);
            return light;
        }

        light_objects.DirectionalLight.members.push(DirectionalFactory(0xFFFFFF, 0.3, [-25,50,25]));
        light_objects.DirectionalLight.members.push(DirectionalFactory(0xFFFFFF, 0.3, [25,50,25]));
        light_objects.DirectionalLight.members.push(DirectionalFactory(0xFFFFFF, 0.3, [-25,50,-25]));
        light_objects.DirectionalLight.members.push(DirectionalFactory(0xFFFFFF, 0.3, [25,50,-25]));

        light_objects.DirectionalLight.members.push(DirectionalFactory(0xFFFFFF, 0.3, [-30,0,30]));
        light_objects.DirectionalLight.members.push(DirectionalFactory(0xFFFFFF, 0.3, [30,0,30]));
        light_objects.DirectionalLight.members.push(DirectionalFactory(0xFFFFFF, 0.3, [-30,0,-30]));
        light_objects.DirectionalLight.members.push(DirectionalFactory(0xFFFFFF, 0.3, [30,0,-30]));
    }

    // HemisphereLight
    {
        const skyColor = generateRandomColor();  // light blue
        const groundColor = generateRandomColor();  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        
        light_objects.HemisphereLight.members.push(light);
    }

    // AmbientLight
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        light_objects.AmbientLight.members.push(light);
    }

    // PointLight
    {
        function PointLightFactory(color, intensity, position){
            const light = new THREE.PointLight(color, intensity);
            light.position.set(position[0], position[1], position[2]);
            return light;
        }

        light_objects.PointLight.members.push(PointLightFactory(0xfcba03, 1, [-25,50,25]));
        light_objects.PointLight.members.push(PointLightFactory(0xc300ff, 1, [25,50,25]));
        light_objects.PointLight.members.push(PointLightFactory(0xffffff, 1, [-25,50,-25]));
        light_objects.PointLight.members.push(PointLightFactory(0xfcba03, 1, [25,50,-25]));

        light_objects.PointLight.members.push(PointLightFactory(generateRandomColor(), 1, [-30,0,30]));
        light_objects.PointLight.members.push(PointLightFactory(generateRandomColor(), 1, [30,0,30]));
        light_objects.PointLight.members.push(PointLightFactory(generateRandomColor(), 1, [-30,0,-30]));
        light_objects.PointLight.members.push(PointLightFactory(generateRandomColor(), 1, [30,0,-30]));
    }

    // Spotlights
    {
        function SpotLightFactory(color, intensity, position, target_pos){
            const light = new THREE.SpotLight(color, intensity);
            light.position.set(position[0], position[1], position[2]);
            light.target.position.set(position[0], position[1], position[2]);
            return light;
        }
        light_objects.Spotlights.members.push(SpotLightFactory(generateRandomColor(), 1, [-25,50,25], [0,0,0]));
        light_objects.Spotlights.members.push(SpotLightFactory(generateRandomColor(), 1, [25,50,25], [0,0,0]));
    }

    setLight('DirectionalLight', true);

    // buat cube sbg indikasi tempat lampunya
    {
        const geometry = new THREE.BoxGeometry( 1, 1, 1, 3, 3, 3);
        // const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color: 0xd5eb34});
        
        let obj = {};
        obj.atas_leftfront = new THREE.Mesh(geometry, material);
        obj.atas_leftfront.position.set(-25,50,25);
        
        obj.atas_rightfront = new THREE.Mesh(geometry, material);
        obj.atas_rightfront.position.set(25,50,25);
        
        obj.atas_leftback = new THREE.Mesh(geometry, material);
        obj.atas_leftback.position.set(-25,50,-25);
        
        obj.atas_rightback = new THREE.Mesh(geometry, material);
        obj.atas_rightback.position.set(25,50,-25);
        
        obj.bawah_leftfront = new THREE.Mesh(geometry, material);
        obj.bawah_leftfront.position.set(-30,0,30);

        obj.bawah_rightfront = new THREE.Mesh(geometry, material);
        obj.bawah_rightfront.position.set(30,0,30);
        
        obj.bawah_leftback = new THREE.Mesh(geometry, material);
        obj.bawah_leftback.position.set(-30,0,-30);
        
        obj.bawah_rightback = new THREE.Mesh(geometry, material);
        obj.bawah_rightback.position.set(30,0,-30);

        
        scene.add(obj.atas_leftfront);
        scene.add(obj.atas_rightfront);
        scene.add(obj.atas_leftback);
        scene.add(obj.atas_rightback);

        scene.add(obj.bawah_leftfront);
        scene.add(obj.bawah_rightfront);
        scene.add(obj.bawah_leftback);
        scene.add(obj.bawah_rightback);
    }
    

    // Lantai-nya
    {
        const geometry = new THREE.BoxGeometry(50, 0.5, 50);
        const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color});

        const lantai = new THREE.Mesh(geometry, material);
        lantai.position.set(0,0,0);
        scene.add(lantai);
        objects["lantai"] = lantai;
    }

    // lantai.position.y = -1;

    // Kotak di tengah-tengah
    {
        const geometry = new THREE.BoxGeometry( 1, 1, 1, 3, 3, 3);
        const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color});
        const obj = new THREE.Mesh(geometry, material);
        // obj.position.set(30,0,-30),

        // scene.add(obj);
        objects["cube"] = obj;
    }

    // Kotak tengah wireframenya
    {
        const geometry = new THREE.WireframeGeometry(new THREE.BoxGeometry( 5, 5, 5, 3, 3, 3));
        const color = 0xFFFFFF;
        const material = new THREE.LineBasicMaterial( { color: 0xffffff } );
        const obj = new THREE.LineSegments(geometry, material);
        obj.position.set(0,5,0);

        // scene.add(obj);
        objects["cube_wireframe"] = obj;
    }

    // DodecahedronGeometry
    {
        const geometry = new THREE.DodecahedronGeometry(1, 2);
        const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color});
        const obj = new THREE.Mesh(geometry, material);

        // Wireframenya
        const wireframe_geometry = new THREE.WireframeGeometry(geometry);
        const wireframe_material = new THREE.LineBasicMaterial( { color: 0xffffff } );
        const wireframe_obj = new THREE.LineSegments(wireframe_geometry, wireframe_material);

        obj.position.set(0,7,0);
        wireframe_obj.position.set(0,7,0);

        scene.add(obj);
        // scene.add(wireframe_obj);

        objects["dodecahedron"] = obj;
        objects["dodecahedron_wireframe"] = wireframe_obj;
    }

    // DodecahedronGeometry with Wireframe
    {

    }

    // Primogem di tengah
    {
        const geometry = new THREE.OctahedronGeometry(5);
        const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color});
        const obj = new THREE.Mesh(geometry, material);
        

        // Wireframenya
        const wireframe_geometry = new THREE.WireframeGeometry(geometry);
        const wireframe_material = new THREE.LineBasicMaterial( { color: 0xffffff } );
        const wireframe_obj = new THREE.LineSegments(wireframe_geometry, wireframe_material);
        
        obj.position.set(0,7,0);
        wireframe_obj.position.set(0,7,0);
        scene.add(obj);
        scene.add(wireframe_obj);

        objects["octahedron"] = obj;
        objects["octahedron_wireframe"] = wireframe_obj;
    }

    // Kotak yang ngelilingin bola2 manja
    // Kotak di tengah-tengah
    {
        const geometry = new THREE.BoxGeometry( 1, 1, 1, 3, 3, 3);
        const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color});
        const obj = new THREE.Mesh(geometry, material);
        obj.position.set(0,7,0),

        scene.add(obj);
        objects["cube"] = obj;
    }

    // Donat di atas Primogem
    {
        const radius = 4;  
        const tubeRadius = 0.5;  
        const radialSegments = 4;
        const tubularSegments = 12;  
        const geometry = new THREE.TorusGeometry( radius, tubeRadius, radialSegments, tubularSegments);
        const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color});
        const obj = new THREE.Mesh(geometry, material);

        // Wireframenya
        const wireframe_geometry = new THREE.WireframeGeometry(geometry);
        const wireframe_material = new THREE.LineBasicMaterial( { color: 0xffffff } );
        const wireframe_obj = new THREE.LineSegments(wireframe_geometry, wireframe_material);

        obj.position.set(0,13,0);
        obj.rotation.x = 1/2 * Math.PI;

        wireframe_obj.position.set(0,13,0);
        wireframe_obj.rotation.x = 1/2 * Math.PI;

        scene.add(obj);
        scene.add(wireframe_obj);
        objects["donat"] = obj;
        objects["donat_wireframe"] = wireframe_obj;
    }

    // TetrahedronGeometry
    {
        const radius = 2;  
        const detail = 3;  
        const geometry = new THREE.TetrahedronGeometry(radius, detail);
        const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color});
        const obj = new THREE.Mesh(geometry, material);
        obj.position.set(0,7,0);

        scene.add(obj);
        objects["tetrahedron"] = obj;
    }

    // Simpul yang ngelilingin Tetrahedron
    {
        const radius =  0.5;
        const tubeRadius =  0.4;  
        const radialSegments =  5;  
        const tubularSegments = 64;  
        const p = 1;  
        const q = 3;  
        const geometry = new THREE.TorusKnotGeometry( radius, tubeRadius, tubularSegments, radialSegments, p, q);
        const color = generateRandomColor();
        const material = new THREE.MeshPhongMaterial({color});
        const obj = new THREE.Mesh(geometry, material);
        obj.position.set(0,7,0);

        scene.add(obj);
        objects["torusknot"] = obj;
    }

    // Cone Geom
    {
        const radius = 2;
        const height = 3;
        const radialSegments = 16;

        const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
        const material = new THREE.MeshPhongMaterial({color: generateRandomColor()});
        const obj = new THREE.Mesh(geometry, material);
        obj.position.set(0,7,0);

        scene.add(obj);
        objects["cone_geometry"] = obj;
    }

    // CylinderGeometry yg ngelilingin Cone
    {
        const radiusTop = 1;  
        const radiusBottom = 1;  
        const height = 1;
        const radialSegments = 12;  
        const geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments);
        const material = new THREE.MeshPhongMaterial({color: generateRandomColor()});
        const obj = new THREE.Mesh(geometry, material);
        obj.position.set(5,7,0);

        scene.add(obj);
        objects["cylinder_geometry"] = obj;
    }

    // Primogem lagi
    {
        const geometry = new THREE.OctahedronGeometry(2);
        const material = new THREE.MeshPhongMaterial({color: generateRandomColor()});
        material.wireframe = true;
        const obj = new THREE.Mesh(geometry, material);
                
        obj.position.set(7,7,0);
        scene.add(obj);

        objects["primogem_planet"] = obj;
    }

    // Primogem mini
    {
        const geometry = new THREE.OctahedronGeometry(1);
        const material = new THREE.MeshPhongMaterial({color: generateRandomColor()});
        material.wireframe = false;
        const obj = new THREE.Mesh(geometry, material);
                
        obj.position.set(8,7,0);
        scene.add(obj);

        objects["primogem_moon"] = obj;
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
    let t2 = 0;
    function render(time) {
        if (resizeRendererToDisplaySize(renderer)) {
            console.log("RESIZED")
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        objects["cube"].rotation.x += 0.03;
        objects["cube"].rotation.y += 0.03;
        // objects["cube_wireframe"].rotation.x += 0.003;
        // objects["cube_wireframe"].rotation.y += 0.003;

        objects["octahedron"].rotation.y += 0.003;
        objects["octahedron_wireframe"].rotation.y += 0.003;

        t += 0.01;
        t2 += 0.05;
        objects["dodecahedron"].position.x = 15 * Math.cos( t );
        objects["dodecahedron"].position.z = 15 * Math.sin( t );
        // objects["dodecahedron"].position.y = 4 * Math.sin( t )/Math.cos(t);
        objects["dodecahedron_wireframe"].position.x = 15 * Math.cos( t );
        objects["dodecahedron_wireframe"].position.z = 15 * Math.sin( t );

        objects["cube"].position.x = objects["dodecahedron_wireframe"].position.x + 3 * Math.cos( t2 );
        objects["cube"].position.z = objects["dodecahedron_wireframe"].position.z + 3 * Math.sin( t2 );

        objects["donat"].rotation.z += 0.003;
        objects["donat_wireframe"].rotation.z += 0.003;

        objects["tetrahedron"].position.x = 15 * Math.cos( t + 3 );
        objects["tetrahedron"].position.z = 15 * Math.sin( t + 3 );
        objects["tetrahedron"].rotation.z += 0.02;
        objects["torusknot"].position.x = objects["tetrahedron"].position.x + 5 * -1* Math.cos( t2 - 0.01 );
        objects["torusknot"].position.z = objects["tetrahedron"].position.z + 5 * Math.sin( t2 - 0.01 );

        // cone_geom
        objects["cone_geometry"].position.x = 15 * Math.cos( t + 1.5 );
        objects["cone_geometry"].position.z = 15 * Math.sin( t + 1.5 );
        objects["cone_geometry"].rotation.z += 0.01;

        objects["cylinder_geometry"].position.x = objects["cone_geometry"].position.x + 5 * Math.cos( t2 - 0.01 );
        objects["cylinder_geometry"].position.z = objects["cone_geometry"].position.z + 5 * Math.sin( t2 - 0.01 );
        objects["cylinder_geometry"].rotation.z += 0.01;

        objects["primogem_planet"].position.x = 15 * Math.cos( t + 4.5 );
        objects["primogem_planet"].position.z = 15 * Math.sin( t + 4.5 );
        objects["primogem_planet"].rotation.z += 0.02;

        objects["primogem_moon"].position.x = objects["primogem_planet"].position.x + 5 * Math.cos( t2 - 0.01 );
        objects["primogem_moon"].position.z = objects["primogem_planet"].position.z + 5 * Math.sin( t2 - 0.01 );
        objects["primogem_moon"].rotation.x += 0.02;

        // objects["lantai"].rotation.x += 0.01;
        // objects["lantai"].rotation.y += 0.01;
        
        renderer.render( scene, camera );
        requestAnimationFrame( render );
    }
    
    requestAnimationFrame( render );
};

animate();