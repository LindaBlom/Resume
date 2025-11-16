import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//Create scene, holds all of our 3D objets
const scene = new THREE.Scene();


const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);


//render webgl
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// loaders and orbits
const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping= true;
controls.dampingFactor= 0.15;


const loader_earth = new THREE.TextureLoader();
const loader_cubemap = new THREE.CubeTextureLoader();
loader_cubemap.setPath("./textures/cubemap/space/");

//geometries
const geometry_sphere = new THREE.IcosahedronGeometry(2.0,8)

// textures
const cubeTexture = await loader_cubemap.loadAsync( [
	'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'
] );
scene.background = cubeTexture;

const earthTextureLight = new THREE.MeshStandardMaterial({
    map: loader_earth.load("./textures/earth/earthmap1k.jpg")
});
const earthTextureDark = new THREE.MeshBasicMaterial({
    //color: 0x00ff00,
    transparent: true,
    opacity: 0.2,
    map: loader_earth.load("./textures/earth/earthlights1k.jpg")
});
const earthTextureCloud = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.2,
    map: loader_earth.load("./textures/earth/earthcloudmap.jpg"),
});

//meshes
const earthMeshLight = new THREE.Mesh(geometry_sphere,earthTextureLight);
const earthMeshDark = new THREE.Mesh(geometry_sphere,earthTextureDark);
const earthMeshCloud = new THREE.Mesh(geometry_sphere,earthTextureCloud);
// groups
const earth_group = new THREE.Group();
earth_group.rotation.z= -23.4 * Math.PI/180;

//add to scene
earthMeshCloud.scale.set(1.01,1.01,1.01);
scene.add(earth_group);
earth_group.add(earthMeshLight);
earth_group.add(earthMeshDark);
earth_group.add(earthMeshCloud);



//lights
//const ambient = new THREE.AmbientLight(0xffffff,1);
const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.set(5,3,5);
scene.add(sunlight)

 
//camera
camera.position.z = 5;

function animate(){
    //pass in animate as callback to requestAnimationFrame
    // y och x är tvärtom
    requestAnimationFrame(animate);
    earth_group.rotation.y += 0.001;
    
    renderer.render(scene,camera);
    controls.update();
}
animate();