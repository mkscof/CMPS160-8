
v_shaders = {}
f_shaders = {}
var load = 0;

// called when page is loaded
function main() {
    // retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    v_shaders["cube"] = "";
    f_shaders["cube"] = "";
    v_shaders["sphere"] = "";
    f_shaders["sphere"] = "";
    v_shaders["triang"] = "";
    f_shaders["triang"] = "";
    v_shaders["skybox"] = "";
    f_shaders["skybox"] = "";

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/cube_shader.vert", function(shader_src) {
        setShader(gl, canvas, "cube", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/cube_shader.frag", function(shader_src) {
        setShader(gl, canvas, "cube", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/sphere_shader.vert", function(shader_src) {
        setShader(gl, canvas, "sphere", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/sphere_shader.frag", function(shader_src) {
        setShader(gl, canvas, "sphere", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/triang_shader.vert", function(shader_src) {
        setShader(gl, canvas, "triang", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/triang_shader.frag", function(shader_src) {
        setShader(gl, canvas, "triang", gl.FRAGMENT_SHADER, shader_src);
    });

    // load shader files (calls 'setShader' when done loading)
    loadFile("shaders/skybox_shader.vert", function(shader_src) {
        setShader(gl, canvas, "skybox", gl.VERTEX_SHADER, shader_src);
    });

    loadFile("shaders/skybox_shader.frag", function(shader_src) {
        setShader(gl, canvas, "skybox", gl.FRAGMENT_SHADER, shader_src);
    });
}

// set appropriate shader and start if both are loaded
function setShader(gl, canvas, name, shader, shader_src) {
    if (shader == gl.VERTEX_SHADER)
       v_shaders[name] = shader_src;

    if (shader == gl.FRAGMENT_SHADER)
	   f_shaders[name] = shader_src;

    vShadersLoaded = 0;
    for (var shader in v_shaders) {
       if (v_shaders.hasOwnProperty(shader) && v_shaders[shader] != "") {
           vShadersLoaded += 1;
       }
    }

    fShadersLoaded = 0;
    for (var shader in f_shaders) {
        if (f_shaders.hasOwnProperty(shader) && f_shaders[shader] != "") {
            fShadersLoaded += 1;
        }
    }

    if(vShadersLoaded == Object.keys(v_shaders).length &&
       fShadersLoaded == Object.keys(f_shaders).length) {
        start(gl, canvas);
    }
}

function start(gl, canvas) {

    // Create camera
    var camera = new PerspectiveCamera(60, 1, 1, 100);
    camera.move(10,0,0,1);
    camera.move(2,1,0,0);
    camera.rotate(10,0,1,0);
    
    // Create scene
    var scene = new Scene(gl, camera);

    window.onkeypress = function(ev){ keypress(ev, gl, canvas, camera, scene); };
    window.onkeydown = function(ev){ keydown(ev, gl, canvas, camera, scene); };

    var texbutton = document.getElementById("newTex");
    texbutton.onclick = function(ev){ loadTextures(); };

     // Create a Sphere
    var sphere = new SphereGeometry(1, 32, 8);
    sphere.v_shader = v_shaders["sphere"];
    sphere.f_shader = f_shaders["sphere"];
    sphere.setPosition(new Vector3([-3,0.0,0.0]));
    scene.addGeometry(sphere);

    sphere.addUniform("u_cameraPos", "v3", camera.position.elements);

    // Create a cube
    var cube = new CubeGeometry(1);
    cube.setVertexShader(v_shaders["cube"]);
    cube.setFragmentShader(f_shaders["cube"]);
    cube.setRotation(new Vector3([1,45,45]));
    cube.setPosition(new Vector3([3,0.0,0.0]));
    cube.setScale(new Vector3([0.75,0.75,0.75]));
    scene.addGeometry(cube);

    // var cube2 = new CubeGeometry(1);
    // cube2.setVertexShader(v_shaders["cube"]);
    // cube2.setFragmentShader(f_shaders["cube"]);
    // cube2.setRotation(new Vector3([0,15,0]));
    // cube2.setPosition(new Vector3([0.0,0.0,0.0]));
    // cube2.setScale(new Vector3([0.75,0.75,0.75]));
    // scene.addGeometry(cube2);

    var plane = new Geometry();
    var size = 1.0
    plane.vertices = [0.0, size, 0.0, 
                      0.0, -size, 0.0, 
                      -size, size, 0.0,
                      -size,  -size, 0.0,

                      size, size, 0.0, 
                      size, -size, 0.0, 
                      0.0, size, 0.0,
                      0.0,  -size, 0.0
                     ];
    plane.indices = [0, 1, 2, 
                     1, 2, 3, 
                     4, 5, 6,
                     5, 6, 7
                    ];

    var uvs = [0.0, 0.0, 0.0, 
               0.0, 1.0, 0.0,
               1.0, 0.0, 0.0,
               1.0, 1.0, 0.0,

               0.0, 0.0, 0.0, 
               0.0, 1.0, 0.0,
               1.0, 0.0, 0.0,
               1.0, 1.0, 0.0
               ];

    plane.addAttribute("a_uv", uvs);

    plane.setVertexShader(v_shaders["triang"]);
    plane.setFragmentShader(f_shaders["triang"]);
    scene.addGeometry(plane);

    // var triang = new Geometry();
    // triang.vertices = [-3.5, -1, 0.0, 
    //                    -2.5, 1.0, 0.0, 
    //                   -1.5, -1, 0.0];
    // triang.indices = [0, 1, 2];
    // var uvs = [0.0, 0.0, 0.0, 
    //            0.5, 1.0, 0.0, 
    //            1.0, 0.0, 0.0];
    // triang.addAttribute("a_uv", uvs);

    // triang.setVertexShader(v_shaders["triang"]);
    // triang.setFragmentShader(f_shaders["triang"]);
    // scene.addGeometry(triang);

    // var triang2 = new Geometry();
    // triang2.vertices = [-3.5, -1, 0.0, -2.5, 1.0, 0.0, -1.5, -1, 0.0];
    // triang2.indices = [0, 1, 2];
    // var uvs2 = [0.0, 0.0, 0.0, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0];
    // triang2.addAttribute("a_uv", uvs2);

    // triang2.setVertexShader(v_shaders["triang"]);
    // triang2.setFragmentShader(f_shaders["triang"]);
    // scene.addGeometry(triang2);

    // Create a cube
    var skyBox = new CubeGeometry(10);
    skyBox.setVertexShader(v_shaders["skybox"]);
    skyBox.setFragmentShader(f_shaders["skybox"]);
    scene.addGeometry(skyBox);

    scene.draw();

    var tex2 = new Texture2D(gl, 'img/beach/posz.jpg', function(tex) {
        console.log(tex);
        plane.addUniform("u_squareTex", "t2", tex);
        // triang.addUniform("u_tex", "t2", tex);
        // triang2.addUniform("u_tex", "t2", tex);
       scene.draw();
    });

    var tex = new Texture3D(gl, [
        'img/beach/negx.jpg',
        'img/beach/posx.jpg',
        'img/beach/negy.jpg',
        'img/beach/posy.jpg',
        'img/beach/negz.jpg',
        'img/beach/posz.jpg'
    ], function(tex) {
        skyBox.addUniform("u_skyBoxTex", "t3", tex);
        sphere.addUniform("u_sphereTex", "t3", tex);
        cube.addUniform("u_cubeTex", "t3", tex);
        scene.draw();
    });

    function loadTextures(){
        var tex = new Texture3D(gl, [
            'img/beach/negx.jpg',
            'img/beach/posx.jpg',
            'img/beach/negy.jpg',
            'img/beach/posy.jpg',
            'img/beach/negz.jpg',
            'img/beach/posz.jpg'
        ], function(tex) {
            sphere.addUniform("u_sphereTex", "t3", tex);
            cube.addUniform("u_cubeTex", "t3", tex);
            scene.draw();
        });

        var tex4 = new Texture3D(gl, [
            'img/extra/blue.jpg',
            'img/extra/blue.jpg',
            'img/extra/blue.jpg',
            'img/extra/blue.jpg',
            'img/extra/blue.jpg',
            'img/extra/blue.jpg'
        ], function(tex) {
            skyBox.addUniform("u_skyBoxTex", "t3", tex);
            scene.draw();
        });
    }
}

function keypress(ev, gl, canvas, camera, scene){
  if (ev.which == "i".charCodeAt(0)){   //up
    camera.move(1,0,1,0);
  }
  else if (ev.which == "k".charCodeAt(0)){  //down
    camera.move(-1,0,1,0);
  }
  else if(ev.which == "j".charCodeAt(0)){ //left
    camera.move(-1,1,0,0);
  }
  else if(ev.which == "l".charCodeAt(0)){ //right
    camera.move(1,1,0,0);
  }
  else if(ev.which == ""){}

  scene.draw();
}

function keydown(ev, gl, canvas, camera, scene){
    if(ev.keyCode == 37){ //left
        camera.rotate(1,0,1,0);
    }
    else if(ev.keyCode == 38){ //up
        camera.rotate(1,1,0,0);
    }
    else if(ev.keyCode == 39){  //right
        camera.rotate(-1,0,1,0);
    }
    else if(ev.keyCode == 40){  //down
        camera.rotate(-1,1,0,0);
    }

  scene.draw();
}
