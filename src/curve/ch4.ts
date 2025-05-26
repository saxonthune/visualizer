import * as THREE from 'three';

const TAU = Math.PI * 2;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock();

renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setAnimationLoop( animate );
let lastFrameTime = 0;
requestAnimationFrame( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

const cubeGeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );

const colors = [
    0x00ff00, // green
    0x0000ff, // blue
    0xff0000, // red
    0xffff00, // yellow
    0xff00ff, // magenta
    0x00ffff, // cyan
    0xff8000, // orange
    0x8000ff, // purple
]

const pathStart = new THREE.Vector3( -7, 4, -12 );
const pathEnd = new THREE.Vector3( 2, -0.5, 0 );
const pathLength = pathStart.distanceTo(pathEnd);
const A = getTransformationMatrixOld(pathStart, pathEnd);

const cubes = initObjects(40, 80, A);
cubes.forEach((cube) => {
    scene.add(cube);
});

// add spheres on each point
const sphereGeometry = new THREE.SphereGeometry( 0.1, 32, 32 );
const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const sphereStart = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphereStart.position.copy( pathStart );
scene.add( sphereStart );
const sphereEnd = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphereEnd.position.copy( pathEnd );
scene.add( sphereEnd );
const lineGeometry = new THREE.BufferGeometry().setFromPoints( [
    pathStart,
    pathEnd,
] );
const lineMaterial = new THREE.LineBasicMaterial( { color: 0xcc006f } );
const line = new THREE.Line( lineGeometry, lineMaterial );
scene.add( line );


function animate() {
    requestAnimationFrame( animate );

    const elapsedTime = clock.getElapsedTime();
    const t = elapsedTime / 10 % 1;

    if (elapsedTime - lastFrameTime < 1/120) {
        //requestAnimationFrame(animate);
        return;
    }

    lastFrameTime = elapsedTime;

    cubes.forEach((cube) => {
        cube.position.copy( mapCurveToBasis(pathStart, pathLength, A, t, cube.userData.r_init, cube.userData.h_init) );
        cube.rotation.x += 0.01 * (0);
        cube.rotation.y += -0.01 * (0);
    });
    renderer.render( scene, camera );
}

function initObjects(rows: number, cols: number, matrix: THREE.Matrix3): THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] {
    const objects = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cube = new THREE.Mesh( cubeGeometry, new THREE.MeshBasicMaterial( { color: colors[((i+j) % colors.length)] } ) );
            cube.userData.r_init = i / rows;
            cube.userData.h_init = j / cols;
            cube.position.copy( mapCurveToBasis(pathStart, pathLength, matrix, 0, cube.userData.r_init, cube.userData.h_init) );
            objects.push(cube);
        }
    }
    return objects;
}

function getTransformationMatrixOld(start: THREE.Vector3, end: THREE.Vector3): THREE.Matrix3 {
    const direction= end.clone().sub(start).normalize();
    const directionBasis = direction.clone().normalize();

    const e1 = new THREE.Vector3(1, 0, 0);
    const basis1 = e1.clone()
        .sub((directionBasis.clone().multiplyScalar(directionBasis.clone().dot(e1))))
        .normalize();
    const basis2 = new THREE.Vector3().crossVectors(directionBasis, basis1).normalize();

    return new THREE.Matrix3().set(
        basis1.x, basis2.x, directionBasis.x,
        basis1.y, basis2.y, directionBasis.y,
        basis1.z, basis2.z, directionBasis.z,
    );
}

function mapCurveToBasis(start: THREE.Vector3, lineLength: number, rotation: THREE.Matrix3, t: number, r_init: number, h_init: number): THREE.Vector3 {
    const [x, y, h] = getCylindricalPosition(t, r_init, h_init);
    const point = new THREE.Vector3(x, y, h*lineLength);
    point.applyMatrix3(rotation);
    point.add(start);

    return point;
}

function getCylindricalPosition(t: number, r_init: number, h_init: number): THREE.Vector3 {
    const [radius, angle] = getPolarPosition(t, r_init, h_init);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const h = (t + h_init) % 1;
    return new THREE.Vector3(x, y, h);

}

function getPolarPosition(t: number, r_init: number, h_init: number): [number, number] {
    //const radiusdefaultdistance = 1.4 
    //const radiusdefaultdistance = 1 + 0.3 * math.sin(2.5*(h_init*2*math.pi));
    const radiusDefaultDistance = 0.8 + 0.3 * Math.sin(((t+h_init) % 1 * 3.5)*TAU);

    const period = 1.8;
    const radiusCurveMagnitude = 0.2;
    //const radius = Math.sin(2*Math.PI*period * (t + r_init/2)) * radiusCurveMagnitude + radiusDefaultDistance;
    const radius = Math.sin((h_init + t) % 1 * period * TAU) * radiusCurveMagnitude + radiusDefaultDistance;

    const anglePeriod = 1.0;
    const angle = (t + r_init) % 1 * anglePeriod * TAU;

    return [radius, angle];
}

