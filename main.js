import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//Create scene, holds all of our 3D objets
const scene = new THREE.Scene();


const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
const radius = 10.0;

//render webgl
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// loaders and orbits


const loader_cubemap = new THREE.CubeTextureLoader();
loader_cubemap.setPath("./textures/cubemaps/space/");
const loader_bunny = new GLTFLoader();


//geometries
const geometry_sphere = new THREE.IcosahedronGeometry(radius,10);
const geometry_wireframe = new THREE.WireframeGeometry(geometry_sphere);
const gltfBunny = await loader_bunny.loadAsync( './textures/characters/stanford_bunny.glb' );
const bunny = gltfBunny.scene;
//console.log(bunny.position);
//console.log(bunny.getWorldPosition(new THREE.Vector3()));


// add wireframe that follows the earth

// slightly scale up to avoid z-fighting with the solid mesh



// textures
const cubeTexture = await loader_cubemap.loadAsync( [
	'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'
] );
scene.background = cubeTexture;
const earthTextureGrass = new THREE.MeshStandardMaterial({
    color: 0x8AEB83, 
});
const bunnyTexture = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF, 
});
const wireframeTexture = new THREE.LineBasicMaterial({ color: 0x000000 });

//meshes
const earthMesh = new THREE.Mesh(geometry_sphere,earthTextureGrass);
const earthWireframe = new THREE.LineSegments(geometry_wireframe,wireframeTexture);

// groups
const earth_group = new THREE.Group();

//add to scene
scene.add(earth_group);
earth_group.add(earthMesh);

earth_group.add(earthWireframe);
scene.add(bunny);

bunny.position.y = radius;
bunny.rotation.y= -Math.PI/2;
earthWireframe.scale.set(1.002, 1.002, 1.002);



//lights
const ambient = new THREE.AmbientLight(0xffffff,0.2);
scene.add(ambient);


//camera
const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping= true;
controls.dampingFactor= 0.15;


camera.position.set(0,radius+2.0,0);

console.log("Bunny world direction:");
console.log(bunny.getWorldDirection(new THREE.Vector3()));



const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});


function followCam(){
    const bunnyPos = bunny.getWorldPosition(new THREE.Vector3());
    camera.position.z = bunny.position.z + 0.5;
    camera.position.y = bunny.position.y + 0.5;
    camera.lookAt(bunnyPos);
    const normal = bunnyPos.clone().normalize();
    camera.up.copy(normal);
}
function moveEarth(){
    const up = bunny.getWorldPosition(new THREE.Vector3()).normalize();
    const  forward = bunny.getWorldDirection(new THREE.Vector3()).normalize();
    const right = forward.clone().cross(up).normalize();
    
 
    
        if (keys['w']) earth_group.rotateOnWorldAxis(forward, Math.PI * -0.001);
        if (keys['s']) earth_group.rotateOnWorldAxis(forward, Math.PI * 0.001);
        if (keys['a']) earth_group.rotateOnWorldAxis(up, Math.PI * -0.01);
        if (keys['d']) earth_group.rotateOnWorldAxis(up, Math.PI * 0.01);
        if (keys['q']) earth_group.rotateOnWorldAxis(right, Math.PI * 0.001);
        if (keys['e']) earth_group.rotateOnWorldAxis(right, Math.PI * -0.001);
    
}


console.log(bunny.position);
console.log(earthMesh.position);
function animate(){
    //pass in animate as callback to requestAnimationFrame
    requestAnimationFrame(animate);
    
    moveEarth();
    followCam();
    renderer.render(scene,camera);
    controls.update();
}
animate();