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
    let CLICKABLE_OBJ = [];
    let SCORE_TEXTS = [];
    let PRIMOGEM_RADIUS = 5;
    let MAX_PAIR_OBJECTS = prompt("MAX_PAIR_OBJECTS");

    let scoreObject = null;
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

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '0x';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return parseInt(color, 16);
    }

    const fontloader = new THREE.FontLoader();

    // Setup the camera
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect , near, far );
    camera.position.set(0, 0, 50);

    let canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        logarithmicDepthBuffer: true,
        antialias: true,
        powerPreference: "high-performance",
        alpha: false
    });

    renderer.setPixelRatio( window.devicePixelRatio );

    function updateCamera() {
        camera.updateProjectionMatrix();
    }

    // SET UI CONTROLNYA
    const gui = new GUI();
    gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('far').onChange(updateCamera);
    
    // SET RAYCASTER
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    


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
    // const controls = new OrbitControls(camera, canvas);
    // controls.target.set(0, 0, 0);
    // controls.update();

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
    
    // Lantai-nya
    {
        const geometry = new THREE.BoxGeometry(50, 0.5, 50);
        const material = new THREE.MeshPhongMaterial({color: generateRandomColor(), shininess: 150});

        const lantai = new THREE.Mesh(geometry, material);
        lantai.position.set(0,0,0);
        // scene.add(lantai);
        objects["lantai"] = lantai;
    }
    
    const axesHelper = new THREE.AxesHelper( 40 );
    // scene.add( axesHelper );

    function scoreFactory(text, position, color){
        console.log(position);
        fontloader.load('Open Sans_Bold.json', (font) => {
          
            const textGeometry = new THREE.TextGeometry(text, {
                font: font,
                size: 2,
                height: 1,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelSegments: 1,
            });

            const textMaterial = new THREE.MeshPhongMaterial({
                color: color,
                shininess: 150,
                transparent: true,
                opacity: 1
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.castShadow = true;

            textGeometry.center();

            textMesh.position.set(position.x, position.y + 5, position.z);
            textMesh.rotation.x = 0.1;
            let scoreObject = textMesh;

            SCORE_TEXTS.push(scoreObject);
            scene.add(scoreObject);
        });     
    }

    function animateScore(){
        for(let i=0; i<SCORE_TEXTS.length; i++){
            SCORE_TEXTS[i].material.opacity -= 0.005;
            SCORE_TEXTS[i].rotation.y += 0.02;
            SCORE_TEXTS[i].position.y += 0.1;
        }

        SCORE_TEXTS.forEach((object) => {
            if(object.material.opacity < 0){
                SCORE_TEXTS.splice(SCORE_TEXTS.indexOf(object), 1);
                scene.remove(object);
            }
        });
    }

    function primogemFactory(color){
        const obj_geometry = new THREE.OctahedronGeometry(PRIMOGEM_RADIUS);
        const obj_material = new THREE.MeshPhongMaterial({color: color, shininess: 150});
        
        const wireframe_geometry = new THREE.WireframeGeometry(obj_geometry);
        const wireframe_material = new THREE.LineBasicMaterial( { color: 0xffffff } );

        let obj = {}
        obj.solid = new THREE.Mesh(obj_geometry, obj_material);
        obj.wireframe = new THREE.LineSegments(wireframe_geometry, wireframe_material);

        return obj;
    }

    function addPrimogem(color){

        let position = null;
        while(true){
            position = new THREE.Vector3(getRndInteger(boundary.x.min, boundary.x.max), getRndInteger(boundary.y.min, boundary.y.max), getRndInteger(boundary.z.min, boundary.z.max));
            let isOK = true;
            for(let i=0; i<CLICKABLE_OBJ.length; i++){
                if(
                    Math.abs(CLICKABLE_OBJ[i].item.solid.position.x - position.x) <= PRIMOGEM_RADIUS
                    ||
                    Math.abs(CLICKABLE_OBJ[i].item.solid.position.y - position.x) <= PRIMOGEM_RADIUS
                    || 
                    Math.abs(CLICKABLE_OBJ[i].item.solid.position.z - position.z) <= PRIMOGEM_RADIUS
                ){
                    isOK = true; // SET FALSE kalau ingin enable collision check
                    break;
                }
            }
            if(isOK){
                break;
            }
        }

        let obj = primogemFactory(color);
        obj.solid.position.set(position.x, position.y, position.z);
        obj.wireframe.position.set(position.x, position.y, position.z);
        
        CLICKABLE_OBJ.push({
            item: obj,
            color: color
        });

        scene.add(obj.solid);
        return obj;
    }

    let boundary = {
        x:{min:-60, max:60},
        y:{min:-40, max:40},
        z:{min:-100, max:-8},
    }

    let color_list = [];
    for(let i=0; i<MAX_PAIR_OBJECTS; i++){
        color_list.push({color:generateRandomColor(), displayed:0});
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

    let time = 0;
    let modulus = 80;
    let selected_object = [];
    let score = 0;
    $('#score').html(score);
    // textFactory('SCORE: '+score);

    function selectObject(object){
        console.log("SELECTED");

        console.log(object);
        // Check item gak boleh sama
        if(selected_object.length == 1){
            if(object.item.solid.uuid == selected_object[0].item.solid.uuid){
                return;
            }
        }

        scene.add(object.item.wireframe);
        selected_object.push(object);

        if(selected_object.length == 2){
            if(selected_object[0].color == selected_object[1].color){
                console.log("warna sama")
                scene.remove(selected_object[0].item.solid);
                scene.remove(selected_object[1].item.solid);

                for(let i=0; i<color_list.length; i++){
                    if(color_list[i].color == selected_object[0].color){
                        color_list[i].displayed = 0;
                        break;
                    }
                }

                // also remove from CLICKABLE_OBJ             
                CLICKABLE_OBJ.splice(CLICKABLE_OBJ.indexOf(selected_object[0]), 1);
                CLICKABLE_OBJ.splice(CLICKABLE_OBJ.indexOf(selected_object[1]), 1);
                const audio_pop = new Audio('./pop.mp3');
                audio_pop.play();
    
                score += 100;
                scoreFactory("+100", selected_object[1].item.solid.position, 0x00FF44);
                $('#score').html(score);
            }else{
                console.log("warna beda")
                const audio_wiff = new Audio('./bruh.mp3');
                audio_wiff.play();
    
                score -= 10;
                scoreFactory("-10", selected_object[1].item.solid.position, 0xFF0000);
                $('#score').html(score);
            }
            scene.remove(selected_object[0].item.wireframe);
            scene.remove(selected_object[1].item.wireframe);
            selected_object = [];
        }
    }

    window.addEventListener( 'mousemove', (event) => {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, false );

    window.oncontextmenu = function () {
        selected_object.forEach((item) => {
            scene.remove(item.item.wireframe);
        });
        selected_object = [];
    }

    renderer.domElement.addEventListener("click", (event) => {

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children); //array
        intersects.forEach((obj)=>{
            CLICKABLE_OBJ.forEach((C_OBJ) =>{
                if(C_OBJ.item.solid == obj.object){
                    selectObject(C_OBJ);
                }
            })
        });
    }, true);

    // scoreFactory("-10", new THREE.Vector3(0,0,0), 0x00ff44);
    
    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            console.log("RESIZED")
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        animateScore();

        if(time % modulus == 0){
            if(modulus > 30) modulus = modulus - 5;
            if(CLICKABLE_OBJ.length < 2 * color_list.length){
                // check color empty
                for(let i=0; i<MAX_PAIR_OBJECTS; i++){
                    if(color_list[i].displayed < 2){
                        addPrimogem(color_list[i].color)
                        color_list[i].displayed += 1;
                        break;      
                    }
                }
            }
        }

        time = time+1 % 1000000;
        renderer.render( scene, camera );
        requestAnimationFrame( render );
    }
    
    requestAnimationFrame( render );
};


animate();