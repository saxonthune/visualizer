import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const lineGeometry = new THREE.BufferGeometry().setFromPoints( [
    new THREE.Vector3( -1.5, 0, 0 ),
    new THREE.Vector3( 1, 0.2, 0 ),
    new THREE.Vector3( 0, -1, 0 ),
]
);

const lineMaterial = new THREE.LineBasicMaterial( { color: 0xcc006f } );
const line = new THREE.LineLoop( lineGeometry, lineMaterial );
scene.add( line );

camera.position.z = 5;

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += -0.01;
    renderer.render( scene, camera );
}
