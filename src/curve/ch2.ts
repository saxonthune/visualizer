import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );

const colors = [
    0x00ff00, // green
    0x0000ff, // blue
    0xff0000, // red
    0xffff00, // yellow
    0xff00ff, // magenta
]
const positions = [
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 1, 1, 1 ),
    new THREE.Vector3( -1, -1, -1 ),
    new THREE.Vector3( 2, 2, 2 ),
    new THREE.Vector3( -2, -2, -2 ),
]

const cubes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] = [];

for (let i = 0; i < 5; i++) {
    const cube = new THREE.Mesh( cubeGeometry, new THREE.MeshBasicMaterial( { color: colors[i] } ) );
    cube.position.copy( positions[i] );
    cubes.push( cube );
    scene.add( cube );
}

camera.position.z = 5;

const lineStart = new THREE.Vector3( -4, -3, 0 );
const lineEnd = new THREE.Vector3( 4, 3, 0 );

function updateCubePosition(cube: THREE.Mesh, factor: number = 1, step: number = 0) {

    const speed = 0.2 + factor * 0.05;
    const t = (step * speed) % 1;
    const radius = Math.sin(step * 2 + factor) * 1.2;

    const newPosition = new THREE.Vector3().lerpVectors(lineStart, lineEnd, t);

    if (radius === 0) {
        cube.position.copy(newPosition);
    }

    const direction = lineEnd.clone().sub(lineStart).normalize();
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0)
        .normalize()
        .multiplyScalar(radius)
        .multiplyScalar(radius);
    newPosition.add(perpendicular);

    cube.position.copy(newPosition);
}

function animate() {
    const time = Date.now() * 0.001;

    cubes.forEach((cube, i) => {
        updateCubePosition(cube, time, i+1);

        cube.rotation.x += 0.01 * (i * 0.5 + 1);
        cube.rotation.y += -0.01 * (i * 0.5 + 1);
    });
    renderer.render( scene, camera );
}
