import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
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
]

const pathStart = new THREE.Vector3( -7, 4, -8 );
const pathEnd = new THREE.Vector3( 1, -0.5, 4 );
const pathLength = pathStart.distanceTo(pathEnd);
const A = getTransformationMatrixOld(pathStart, pathEnd);

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

const cubes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] = [];
const offsets: number[] = [];

for (let i = 0; i < 6; i++) {
    offsets.push( Math.PI * i / 6 )
    const cube = new THREE.Mesh( cubeGeometry, new THREE.MeshBasicMaterial( { color: colors[i] } ) );
    cube.position.copy( mapCurveToBasis(pathStart, pathLength, A, 0, offsets[i]) );
    cubes.push( cube );
    scene.add( cube );
}

camera.position.z = 5;

function getPolarPosition(t: number, offset: number): [number, number] {
    const radiusDefaultDistance = 0.8;
    const radiusCurveMagnitude = 0.4;
    const period = 20;

    const radius = Math.sin(period  * (t + offset/2)) * radiusCurveMagnitude + radiusDefaultDistance;
    //const radius = radiusDefaultDistance
    const angle = t * Math.PI * 2 + offset * 2;

    return [radius, angle];
}

function getCylindricalPosition(t: number, offset: number): THREE.Vector3 {
    const [radius, angle] = getPolarPosition(t, offset);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return new THREE.Vector3(x, y, t);

}

function mapCurveToBasis(start: THREE.Vector3, lineLength: number, rotation: THREE.Matrix3, t: number, offset: number): THREE.Vector3 {
    const [x, y] = getCylindricalPosition(t, offset);
    const point = new THREE.Vector3(x, y, t*lineLength);
    point.applyMatrix3(rotation);
    point.add(start);

    return point;
}

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    const t = elapsedTime / 10 % 1;

    cubes.forEach((cube, i) => {
        //updateCubePosition(cube, time, i+1);
        cube.position.copy( mapCurveToBasis(pathStart, pathLength, A, t, offsets[i]) );

        cube.rotation.x += 0.01 * (i * 0.5 + 1);
        cube.rotation.y += -0.01 * (i * 0.5 + 1);
    });
    renderer.render( scene, camera );
}
