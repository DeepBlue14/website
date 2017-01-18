/* 
 * File: graphics.js
 * Author: James Kuczynski
 * File Description: This file implements the dynamic background using
 * 					 Three.js, a WebGL library for creating 3D elements.
 * 
 * Created: 11/29/2016 by J.K.
 * Last Modified: 12/06/2016 by J.K.
 */


"use strict";

// check to see if the user has WebGL enabled on their browser
if (!Detector.webgl)
    Detector.addGetWebGLMessage();

// variables for the background animation
var container;
//var stats;
var camera;
var scene;
var renderer;
var geometry;
var pointLight;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// variables for snowflake animation            
var materials = [];
var parameters;
var i;
var h;
var sprite;
var size;

//start the UI
init();
animate();

/**
 * Initializes the 3D graphcs for the background objects and adds them
 * to the web page. 
 */
function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 2000;

    var r = "res/";
    var urls = [
        r + "posx.jpg", r + "negx.jpg",
        r + "posy.jpg", r + "negy.jpg",
        r + "posz.jpg", r + "negz.jpg"
    ];

    // the camera (i.e. user) will be situated in the center of a 3D cube structure
    // refraction mapping prevents corners from being seen.
    var textureCube = new THREE.CubeTextureLoader().load(urls);
    textureCube.mapping = THREE.CubeRefractionMapping;

    scene = new THREE.Scene();
    scene.background = textureCube;
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // LIGHTS
    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    pointLight = new THREE.PointLight(0xffffff, 2);
    scene.add(pointLight);

    // light representation
    var sphere = new THREE.SphereGeometry(100, 16, 8);

    var mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xffffff}));
    mesh.scale.set(0.05, 0.05, 0.05);
    pointLight.add(mesh);


    //create the 3D renderer and add it to the web page
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //statistics
    //stats = new Stats();
    //container.appendChild(stats.dom);

    geometry = new THREE.Geometry();

    var textureLoader = new THREE.TextureLoader();

    var sprite1 = textureLoader.load(r + "snowflake.png");
    var sprite2 = textureLoader.load(r + "snowflake.png");
    var sprite3 = textureLoader.load(r + "snowflake.png");
    var sprite4 = textureLoader.load(r + "snowflake2.png");
    var sprite5 = textureLoader.load(r + "snowflake2.png");

    //create snowflakes (the ... * 10000 sets initial position)
    for (i = 0; i < 100000; i++) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 10000 - 1000;
        vertex.y = Math.random() * 10000 - 1000;
        vertex.z = Math.random() * 10000 - 1000;

        geometry.vertices.push(vertex);
    }


    parameters = [
        [[1.0, 0.2, 0.5], sprite2, 20],
        [[0.95, 0.1, 0.5], sprite3, 15],
        [[0.90, 0.05, 0.5], sprite1, 10],
        [[0.85, 0, 0.5], sprite5, 8],
        [[0.80, 0, 0.5], sprite4, 5]
    ];

    for (i = 0; i < parameters.length; i++) {

        sprite = parameters[i][1];
        size = parameters[i][2];

        materials[i] = new THREE.PointsMaterial({size: size, 
                                                 map: sprite, 
                                                 blending: THREE.AdditiveBlending,
                                                 depthTest: false,
                                                 transparent: true});

        var particles = new THREE.Points(geometry, materials[i]);
        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        scene.add(particles);
    }
    
    window.addEventListener('resize', onWindowResize, false);
}

/**
 * Resizes the 3D elements when the page is resized.
 * 
 */
function onWindowResize() {

    windowHalfX = window.innerWidth / 2,
            windowHalfY = window.innerHeight / 2,
            camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Function the three.js API calls to update the UI.
 */
function animate() {

    requestAnimationFrame(animate);

    render();
    //stats.update(); // update the statistics element
}

/**
 * Re-renders the 3D elements.  Also contains  
 */
function render() {

    // get time to update snow.
    var time = Date.now() * 0.00005;

    for (i = 0; i < scene.children.length; i++) {

        var object = scene.children[i];

        // rotate snow
        if(object instanceof THREE.Points) {

            object.rotation.x = time * (i < 4 ? i + 1 : -(i + 1)); //up and down
            object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1)); //left and right
            object.rotation.z = time * (i < 4 ? i + 1 : -(i + 1)); //forward and backward
        }
    }

    // rotate woods box left in a circle
    camera.rotation.y += 0.001;

    renderer.render(scene, camera);
}
