import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */


const textureLoader = new THREE.TextureLoader()

const doorColor = textureLoader.load('/textures/door/color.jpg')
const doorAlpha = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbient = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeight = textureLoader.load('/textures/door/height.jpg')
const doorNormal = textureLoader.load('/textures/door/normal.jpg')
const doorMetal = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughness = textureLoader.load('/textures/door/roughness.jpg')
//const matcap = textureLoader.load('/textures/matcaps/1.png')
//const gradient = textureLoader.load('/textures/gradients/3.jpg')

const material = new THREE.MeshStandardMaterial()


/**
 * House
 */

//axes helper
const axesHelper = new THREE.AxesHelper( 10 );
scene.add( axesHelper );

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

//house group
const house = new THREE.Group()
scene.add(house)

// walls
const wallWidth = 4
const wallHeight= 2.5
const wallDepth= 4
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(wallWidth,wallHeight,wallDepth),
    new THREE.MeshStandardMaterial({color:0xac8e82})
)
//console.log(walls)
walls.position.y = wallHeight*0.5

house.add(walls)

// roof

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:0xb35f45})
)
roof.position.y = wallHeight + 1/2 
roof.rotation.y = Math.PI*.25
house.add(roof)

//door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.MeshStandardMaterial({color:0xffffff})
)
door.position.z = wallWidth/2 +0.001 // to stop z-fighting
door.position.y = 2/2
house.add(door)

//bushes

const bushGeo = new THREE.SphereGeometry(1,16,16)
const bushMat = new THREE.MeshStandardMaterial({color:0x89c854})

const bush1 = new THREE.Mesh(bushGeo,bushMat)
bush1.scale.set(.5,.5,.5)
bush1.position.set(.8,.2,2.2)

const bush2 = new THREE.Mesh(bushGeo,bushMat)
bush2.scale.set(.25,.25,.25)
bush2.position.set(1.4,0.1,2.1)

const bush3 = new THREE.Mesh(bushGeo,bushMat)
bush3.scale.set(.4,.4,.4)
bush3.position.set(-.8,.1,2.2)

const bush4 = new THREE.Mesh(bushGeo,bushMat)
bush4.scale.set(.15,.15,.15)
bush4.position.set(-1,.05,2.6)

house.add(bush1,bush2,bush3,bush4)

// tombstones
const tombs =new THREE.Group()
scene.add(tombs)

const tombHeight =.8

const tombGeo = new THREE.BoxGeometry(.6,.8,.2)
const tombCapGeo = new THREE.CylinderGeometry( .3, .3, .2, 50 ); 
const tombMat = new THREE.MeshStandardMaterial({color:0xb2b6b1})

for(let i=0;i<50;i++){
    let angle = Math.random() * 2 * Math.PI   // gets a random value from 0->2PI 
    let radius = 3+ Math.random()*6
    let x= Math.sin(angle)* radius  
    let z= Math.cos(angle)* radius

    // this group will include the box base and the sylinder capstone
    const aTomb = new THREE.Group()

    let tomb = new THREE.Mesh(tombGeo,tombMat)
    tomb.position.y=tombHeight/2  // position box
    
    let tombCap =  new THREE.Mesh(tombCapGeo,tombMat)
    tombCap.rotation.x= -Math.PI*.5  // rotate vertical
    tombCap.position.y= tombHeight   // orientate on top of box

    aTomb.add(tomb,tombCap)
    //all these translations will by applied to box and cylinder together as one object
    aTomb.position.set(x,-.1,z)
    aTomb.rotation.y=(Math.random() -0.5)* 0.4
    aTomb.rotation.z=(Math.random() -0.5)* 0.4

    // remember we define "aTomb" as and indiviual tombstone we still need to and this to the group of tombstones
    tombs.add(aTomb)  
}
  


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)

const moonLighthelper = new THREE.DirectionalLightHelper(moonLight)
scene.add(moonLighthelper)

gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()