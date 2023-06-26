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

//Fog
const fog = new THREE.Fog(0x262837,5,20)
scene.fog = fog

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

const bricksColor = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusion = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormal = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughness = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColor = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusion = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg')

grassColor.repeat.set(8,8)
grassAmbientOcclusion.repeat.set(8,8)
grassNormal.repeat.set(8,8)
grassRoughness.repeat.set(8,8)

grassColor.wrapS = THREE.RepeatWrapping
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping

grassColor.wrapT = THREE.RepeatWrapping
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping

const material = new THREE.MeshStandardMaterial()
//door mat



/**
 * House
 */

//axes helper
const axesHelper = new THREE.AxesHelper( 10 );
// scene.add( axesHelper );

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20,50,50),
    new THREE.MeshStandardMaterial({ 
        map:grassColor,
        aoMap:grassAmbientOcclusion,
        normalMap:grassNormal,
        roughnessMap:grassRoughness
     })
)
floor.material.aoMapIntensity=2.5
floor.geometry.setAttribute('uv2', new THREE.BufferAttribute(floor.geometry.attributes.uv.array,2))
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
    new THREE.MeshStandardMaterial({
        map:bricksColor,
        aoMap:bricksAmbientOcclusion,
        normalMap:bricksNormal,
        roughnessMap:bricksRoughness
    })
)
walls.material.aoMapIntensity=2.5
walls.geometry.setAttribute('uv2', new THREE.BufferAttribute(walls.geometry.attributes.uv.array,2))
gui.add(walls.material,'aoMapIntensity',0.1,10,.1).name('walls AO')

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
    new THREE.PlaneGeometry(2.2,2,50,50),
    new THREE.MeshStandardMaterial({
        map:doorColor,
        transparent:true,
        alphaMap:doorAlpha,
        aoMap:doorAmbient,
        displacementMap:doorHeight,
        displacementScale:0.1,
        normalMap:doorNormal,
        metalnessMap:doorMetal,
        roughnessMap:doorRoughness
    })
)

door.geometry.setAttribute('uv2', new THREE.BufferAttribute(door.geometry.attributes.uv.array,2))
door.material.aoMapIntensity=2.5
gui.add(door.material,'aoMapIntensity',0.1,10,.1).name('door AO')

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

    tomb.castShadow= true
    tombCap.castShadow = true
    tomb.receiveShadow= true
    tombCap.receiveShadow= true
    // remember we define "aTomb" as and indiviual tombstone we still need to and this to the group of tombstones
    tombs.add(aTomb)  
}
  


/**
 * Lights
 */
const folder = gui.addFolder( 'Light' );


// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
folder.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name( 'amb intensity' )
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.12)
moonLight.position.set(4, 5, - 2)

const moonLighthelper = new THREE.DirectionalLightHelper(moonLight)
// scene.add(moonLighthelper)

folder.add(moonLight, 'intensity').min(0).max(1).step(0.001).name( 'moon intensity' )
folder.add(moonLight.position, 'x').min(- 5).max(5).step(0.001).name( 'moon x' )
folder.add(moonLight.position, 'y').min(- 5).max(5).step(0.001).name( 'moon y' )
folder.add(moonLight.position, 'z').min(- 5).max(5).step(0.001).name( 'moon z' )
scene.add(moonLight)


//door light
const doorLight= new THREE.PointLight(0xff7d46,1,7)
doorLight.position.set(0,2.2,2.7)
house.add(doorLight)



/**
 * Ghosts
 * 
 */

const ghost1 = new THREE.PointLight(0xff00ff,2,3)
const g1helper = new THREE.PointLightHelper(ghost1)


const ghost2 = new THREE.PointLight(0x00ffff,2,3)
const g2helper = new THREE.PointLightHelper(ghost2)

const ghost3 = new THREE.PointLight(0xffff00,2,3)
const g3helper = new THREE.PointLightHelper(ghost3)

scene.add(ghost1,ghost2,ghost3)
// scene.add(g1helper,g2helper,g3helper)
 


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
renderer.setClearColor(0x262837)

/**
 * Shadows
 */
renderer.shadowMap.enabled= true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow=true
roof.castShadow=true
bush1.castShadow=true
bush2.castShadow=true
bush3.castShadow=true
bush4.castShadow=true
tombs.castShadow=true

floor.receiveShadow = true
walls.receiveShadow= true

doorLight.shadow.mapSize.width =256
doorLight.shadow.mapSize.height =256
doorLight.shadow.mapSize.far =7

ghost1.shadow.mapSize.width =256
ghost1.shadow.mapSize.height =256
ghost1.shadow.mapSize.far =7

ghost2.shadow.mapSize.width =256
ghost2.shadow.mapSize.height =256
ghost2.shadow.mapSize.far =7

ghost3.shadow.mapSize.width =256
ghost3.shadow.mapSize.height =256
ghost3.shadow.mapSize.far =7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    //ghost animation
    const g1Angle = elapsedTime * .5
    ghost1.position.x = Math.cos(g1Angle) * 4
    ghost1.position.z = Math.sin(g1Angle) * 4
    ghost1.position.y = Math.sin(g1Angle*3)

    const g2Angle = -elapsedTime * .3
    ghost2.position.x = Math.cos(g2Angle) * 5
    ghost2.position.z = Math.sin(g2Angle) * 5
    ghost2.position.y = Math.sin(g1Angle*4) + Math.sin(g1Angle*2.5)

    const g3Angle = elapsedTime * .18
    ghost3.position.x = Math.cos(g3Angle) * (7+ Math.sin(elapsedTime *.32))
    ghost3.position.z = Math.sin(g3Angle) * (7+ Math.sin(elapsedTime *.5))
    ghost3.position.y = Math.sin(g1Angle*4) + Math.sin(g1Angle*2.5)





    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()