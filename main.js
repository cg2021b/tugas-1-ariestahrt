// Global Variable Vertices
var shaderProgram = null;
var gl = null;
var group_vertices_obj_kanan = [];
var group_vertices_obj_kiri = [];
var scale = 0.1;

// OBJEK DARI TAMPAK DEPAN

let vertices_box_bawah = [
    -1.2,-0.8,		0.0,0.0,0.0,
    -1.0,-2.0,  	0.0,0.0,0.0,
    -1.2*-1,-0.8,	0.0,0.0,0.0,
    -1.0*-1,-2.0,	0.0,0.0,0.0,
];

let vertices_box_atas = [
    -1.0,1.0,		0.32, 0.32, 0.32,
    -1.2,-0.8,		0.32, 0.32, 0.32,
    -1.0*-1,1.0,	0.32, 0.32, 0.32,
    -1.2*-1,-0.8,	0.32, 0.32, 0.32,
];

let vertices_box_tempat_lobang = [
    -0.8, -0.8,		0.4,0.4,0.4,
    -0.6, -1.0,		0.4,0.4,0.4,
    -0.8*-1, -0.8,	0.4,0.4,0.4,
    -0.6*-1, -1.0,	0.4,0.4,0.4,
];

let vertices_key_depan = [
	-0.5, 0.8,		237/255, 235/255, 235/255, // L
	-0.8, 0.2,		237/255, 235/255, 235/255, // N
	-0.5*-1, 0.9,	237/255, 235/255, 235/255,
	-0.8*-1, 0.2,	237/255, 235/255, 235/255,
];

let vertices_key_atas = [
	-0.4, 1.5,		1.0,1.0,1.0, // K
	-0.5, 0.8,		1.0,1.0,1.0, // L
	-0.4*-1, 1.5,	1.0,1.0,1.0,
	-0.5*-1, 0.8,	1.0,1.0,1.0,
];

let vertices_key_kiri = [
	-0.7, 1.2,		222/255, 217/255, 217/255, // M
	-0.8, 0.2,		222/255, 217/255, 217/255, // N
	-0.4, 1.5,		222/255, 217/255, 217/255, // K
	-0.5, 0.7,		222/255, 217/255, 217/255, // L
];

let vertices_key_kanan = [
	-0.7*-1, 1.2,		222/255, 217/255, 217/255, // M
	-0.8*-1, 0.2,		222/255, 217/255, 217/255, // N
	-0.4*-1, 1.5,		222/255, 217/255, 217/255, // K
	-0.5*-1, 0.7,		222/255, 217/255, 217/255, // L
];

let vertices_bantalan_switch_depan = [
	-0.5, 0.2,			50/255, 50/255, 50/255, // U
	-0.7, -0.2,			50/255, 50/255, 50/255, // S
	-0.5*-1, 0.2,		50/255, 50/255, 50/255, // U'
	-0.7*-1, -0.2,		50/255, 50/255, 50/255, // S'
];

let vertices_bantalan_switch_kiri = [
	-0.6, 0.2,			60/255, 60/255, 60/255, // T
	-0.7, -0.2,			60/255, 60/255, 60/255, // S
	-0.5, 0.2,			60/255, 60/255, 60/255, // U
	-0.5, 0.2,			60/255, 60/255, 60/255, // U
];

let vertices_bantalan_switch_kanan = [
	-0.6*-1, 0.2,			60/255, 60/255, 60/255, // T
	-0.7*-1, -0.2,			60/255, 60/255, 60/255, // S
	-0.5*-1, 0.2,			60/255, 60/255, 60/255, // U
	-0.5*-1, 0.2,			60/255, 60/255, 60/255, // U
];

let vertices_switch_peer = [
	-0.35, 0.2,			200/255, 200/255, 200/255, // A1
	-0.35, 0.0,			200/255, 200/255, 200/255, // B1
	-0.35*-1, 0.2,		200/255, 200/255, 200/255, // A1
	-0.35*-1, 0.0,		200/255, 200/255, 200/255, // B1
];

let vertices_key_lamp_atas = [
	-0.08, 0.9,			51/255, 62/255, 222/255, // E1
	-0.07, 0.8,			51/255, 62/255, 222/255, // F1
	-0.08*-1, 0.9,		51/255, 62/255, 222/255, // E1
	-0.07*-1, 0.8,		51/255, 62/255, 222/255, // F1
];

let vertices_key_lamp_bawah = math_TransformByY(0.8, vertices_key_lamp_atas, 0, 5);


group_vertices_obj_kanan.push([...vertices_box_bawah]);
group_vertices_obj_kanan.push([...vertices_box_atas]);
group_vertices_obj_kanan.push([...vertices_box_tempat_lobang]);
group_vertices_obj_kanan.push([...vertices_key_depan]);
group_vertices_obj_kanan.push([...vertices_key_atas]);
group_vertices_obj_kanan.push([...vertices_key_kiri]);
group_vertices_obj_kanan.push([...vertices_key_kanan]);
group_vertices_obj_kanan.push([...vertices_bantalan_switch_depan]);
group_vertices_obj_kanan.push([...vertices_bantalan_switch_kiri]);
group_vertices_obj_kanan.push([...vertices_bantalan_switch_kanan]);
group_vertices_obj_kanan.push([...vertices_switch_peer]);
group_vertices_obj_kanan.push([...vertices_key_lamp_atas]);
group_vertices_obj_kanan.push([...vertices_key_lamp_bawah]);

group_vertices_obj_kanan.forEach((element) => {
	scaleVertices(element, 0, 5);        
});

group_vertices_obj_kiri.push([...vertices_box_bawah]);
group_vertices_obj_kiri.push([...vertices_box_atas]);
// group_vertices_obj_kiri.push([...vertices_box_tempat_lobang]);
group_vertices_obj_kiri.push([...vertices_key_depan]);
group_vertices_obj_kiri.push([...vertices_key_atas]);
group_vertices_obj_kiri.push([...vertices_key_kiri]);
group_vertices_obj_kiri.push([...vertices_key_kanan]);
group_vertices_obj_kiri.push([...vertices_bantalan_switch_depan]);
group_vertices_obj_kiri.push([...vertices_bantalan_switch_kiri]);
group_vertices_obj_kiri.push([...vertices_bantalan_switch_kanan]);
group_vertices_obj_kiri.push([...vertices_switch_peer]);
group_vertices_obj_kiri.push(math_TranslateByY(0.6, vertices_key_lamp_atas, 0,5), 0, 5);

group_vertices_obj_kiri.forEach((element) => {
	scaleVertices(element, 0, 5);        
});

function scaleVertices(vertices, offset, vertex_size){
	
	var vertices_size = parseInt(vertices.length / vertex_size);

    for(let i=0; i<vertices_size; i++){
        let index_now = i*vertex_size + offset;
        vertices[index_now] *= scale;
        vertices[index_now+1] *= scale;
    }
}

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            "Unable to initialize the shader program: " +
            gl.getProgramInfoLog(shaderProgram)
        );
        return null;
    }

    return shaderProgram;
}

// Function to load shader
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Function to initiate buffer
function initBuffer(gl, vertices){
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return positionBuffer;
}

function drawShape(gl, vertices, program){
    initBuffer(gl, vertices);
    
    var aPosition = gl.getAttribLocation(program, "a_Position");
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        aPosition, // Attribute Pointer
        2, // Number of elements per attribute
        gl.FLOAT, // Type of Element
        gl.FALSE, // Normalized 
        5 * Float32Array.BYTES_PER_ELEMENT, // Sized of an individual vertex
        0 // Offset from beginning of a single fertex to this attribute
    );

    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute Pointer
        3, // Number of elements per attribute
        gl.FLOAT, // Type of Element
        gl.FALSE, // Normalized 
        5 * Float32Array.BYTES_PER_ELEMENT, // Sized of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from beginning of a single fertex to this attribute
    );

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.drawArrays(gl.TRIANGLES , 0, 3);
    gl.drawArrays(gl.TRIANGLES , 1, 3);
}

function math_FindX(point1, point2, y){
    x = (y - point1.y)*(point2.x - point1.x)/(point2.y - point1.y) + point1.x;
    return x;
}

function math_TransformByX(x, vertices, offset, vertex_size){
    var vertices_size = parseInt(vertices.length / vertex_size);
    let result = [...vertices];
    for(let i=0; i<vertices_size; i++){
        let index_now = i*vertex_size + offset;
        result[index_now] = (result[index_now] + x)*-1;
    }
    return result;
}

function math_TransformByY(y, vertices, offset, vertex_size){
    var vertices_size = parseInt(vertices.length / vertex_size);
    let result = [...vertices];
    for(let i=0; i<vertices_size; i++){
        let index_now = i*vertex_size + offset + 1;
        result[index_now] = (result[index_now] - y)*-1 + y;
    }
    return result;
}

function math_TranslateByX(x, vertices, offset, vertex_size){
    var vertices_size = parseInt(vertices.length / vertex_size);
    let result = [...vertices];
    for(let i=0; i<vertices_size; i++){
        let index_now = i*vertex_size + offset;
        result[index_now] = result[index_now] + x;
    }
    return result;
}

function math_TranslateByY(x, vertices, offset, vertex_size){
    var vertices_size = parseInt(vertices.length / vertex_size);
    let result = [...vertices];
    for(let i=0; i<vertices_size; i++){
        let index_now = i*vertex_size + offset + 1;
        result[index_now] = result[index_now] + x;
    }
    return result;
}

function translate(group_vertices){
    let x_translate_value = $('#translate_x').val();
    let y_translate_value = $('#translate_y').val();

    $('#translate_x_val').html(x_translate_value);
    $('#translate_y_val').html(y_translate_value);

    // Clear Canvas
    gl.clearColor(0.10, 0.10, 0.10, 0.4);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // translate all vertices by x and y, then draw it
    group_vertices.forEach((element) => {
        // translate by x and y
        var translated = math_TranslateByX(parseFloat(x_translate_value/100), element, 0, 5);
        translated = math_TranslateByY(parseFloat(y_translate_value/100), translated, 0, 5);
        drawShape(gl, translated, shaderProgram);
    });
}

$( document ).ready(function() {
    var slider_x_translate = document.getElementById('translate_x');
    var slider_y_translate = document.getElementById('translate_y');

    slider_x_translate.addEventListener('input', translate);
    slider_y_translate.addEventListener('input', translate);
});

function getHighestAndLowestVertices(vertices, offset, vertex_size){
	let highest = -99999;
	let lowest = 99999;

    var vertices_size = parseInt(vertices.length / vertex_size);
    for(let i=0; i<vertices_size; i++){
        let index_y = i*vertex_size + offset + 1;
		if(vertices[index_y] > highest) highest = vertices[index_y];
		if(vertices[index_y] < lowest) lowest = vertices[index_y];
    }
    return {high:highest, low:lowest};
}

let dy = 0;
let speed = 0.0105;
function main() {
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");

    // definisi vertex
    var vertexShaderCode = `
        precision mediump float;

        attribute vec2 a_Position;
        attribute vec3 vertColor;
        varying vec3 fragColor;
		uniform mat4 u_matrix;

        void main(){
            fragColor = vertColor;
            gl_Position = u_matrix * vec4(a_Position, 0.0, 1.0);
        }
    `;
    
    // definisi fragment shader
    var fragmentShaderCode = `
        precision mediump float;
        varying vec3 fragColor;
        void main(){
            gl_FragColor = vec4(fragColor, 1.0);
        }
    `;

    // compile program
    shaderProgram = initShaderProgram(gl, vertexShaderCode, fragmentShaderCode);
    gl.useProgram(shaderProgram);

    // Clear Canvas
    gl.clearColor(0.10, 0.10, 0.10, 0.4);
    gl.clear(gl.COLOR_BUFFER_BIT);
	
	const u_matrix = gl.getUniformLocation(shaderProgram, 'u_matrix');

	// OBJEK KANAN
	// Get highest and lowest vertices to detect collision
	let hl_kanan = {high:-99999, low:99999};
	group_vertices_obj_kanan.forEach((vertices) =>{
		const temp = getHighestAndLowestVertices(vertices, 0, 5);
		if(temp.high > hl_kanan.high) hl_kanan.high = temp.high;
		if(temp.low < hl_kanan.low) hl_kanan.low = temp.low;
	});

	dy >= 1.0 - Math.abs(hl_kanan.high) ? speed = -speed : speed = speed;
	dy <= -1.0 + Math.abs(hl_kanan.low) ? speed = -speed : speed = speed;
	dy += speed;

	const rightObject = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.5, dy, 0.0, 1.0,
	];

	gl.uniformMatrix4fv(u_matrix, false, rightObject);

    group_vertices_obj_kanan.forEach((element) => {
        drawShape(gl, element, shaderProgram);
    });

	// OBJEK KIRI
	// Get highest and lowest vertices to detect collision
	let hl_kiri = {high:-99999, low:99999};
	group_vertices_obj_kiri.forEach((vertices) =>{
		const temp = getHighestAndLowestVertices(vertices, 0, 5);
		if(temp.high > hl_kiri.high) hl_kiri.high = temp.high;
		if(temp.low < hl_kiri.low) hl_kiri.low = temp.low;
	});

	dy >= 1.0 - Math.abs(hl_kiri.high) ? speed = -speed : speed = speed;
	dy <= -1.0 + Math.abs(hl_kiri.low) ? speed = -speed : speed = speed;
	dy += speed;

	const leftObject = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		-0.5, -dy, 0.0, 1.0,
	];

	gl.uniformMatrix4fv(u_matrix, false, leftObject);

    group_vertices_obj_kiri.forEach((element) => {
        drawShape(gl, element, shaderProgram);
    });
	requestAnimationFrame(main);
}

main();