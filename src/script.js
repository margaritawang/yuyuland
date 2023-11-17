import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { generateGalaxy } from './galaxy'
THREE.ColorManagement.enabled = false

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
const yewButtFabric = textureLoader.load('/textures/yewFabric.jpg')
const yewFabric = textureLoader.load('/textures/yewFabric2.jpg')
yewButtFabric.wrapS = THREE.RepeatWrapping
yewFabric.wrapS = THREE.RepeatWrapping
yewButtFabric.wrapT = THREE.MirroredRepeatWrapping
yewFabric.wrapT = THREE.RepeatWrapping
yewFabric.repeat.x = 5
yewFabric.repeat.y = 10
yewButtFabric.repeat.x = 3
// yewButtFabric.repeat.y= 

yewButtFabric.magFilter = THREE.NearestFilter



/**
 * Materials
 */
const yewDressMaterial = new THREE.MeshBasicMaterial({ map: yewButtFabric })
const mouthMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
const yewFaceMaterial = new THREE.MeshBasicMaterial({ map: yewFabric })

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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// spot light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)


// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10 ,Math.PI * 0.3)
spotLight.position.set(0,2,2)


scene.add(spotLight)
// scene.add(spotLight.target)

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.5, 10 ,Math.PI * 0.3)
pointLight.position.set(-1,1,0)

scene.add(pointLight)

/**
 * Materials
 */
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xffb6c1})
planeMaterial.roughness = 0.7
// gui.add(planeMaterial, 'metalness').min(0).max(1).step(0.001)
// gui.add(planeMaterial, 'roughness').min(0).max(1).step(0.001)


/**
 * Objects
 */
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    planeMaterial
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

// plane.receiveShadow = true

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5,1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent:true,
        alphaMap: simpleShadow
    })
)

sphereShadow.rotation.x = - Math.PI /2
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphereShadow)

/**
 * Yew body parts
 */
const yewHead = new THREE.Group()

const yewHeadBase = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    yewFaceMaterial
)

const yewEar1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 32, 32),
    yewFaceMaterial
)

const yewEar2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 32, 32),
    yewFaceMaterial
)

const yewDot = new THREE.Mesh(
    new THREE.CircleGeometry( 0.025, 32 ),
    new THREE.MeshStandardMaterial( { color: 0xff0000 } )
)
const yewNose = new THREE.Mesh(
    new THREE.SphereGeometry( 0.05, 32, 32 ),
    new THREE.MeshStandardMaterial( { color: 0xff0000, roughness:0, emissive: 0xff0000 } )
)

const yewEyeMaterial = new THREE.MeshStandardMaterial( { color: 0x000000 } )
yewEyeMaterial.roughness = 0

const yewEyeRight = new THREE.Mesh(
    new THREE.SphereGeometry( 0.045, 32, 32 ),
    yewEyeMaterial
)
const yewEyeLeft = new THREE.Mesh(
    new THREE.SphereGeometry( 0.045, 32, 32 ),
    yewEyeMaterial 
)

yewEar1.position.set(-0.3,0.2)
yewEar2.position.set(0.3,0.2)

yewDot.position.set(0,0.25,0.25)
yewDot.rotation.x = -Math.PI/4

yewNose.position.set(0, 0, 0.35)

yewEyeRight.position.set(-0.1,0.12, 0.295)
yewEyeLeft.position.set(0.14,0.12, 0.3)

// Mouth
const vertices = new Float32Array( [
	0, 0, 0, // v0
	0, 0.075, 0,  // v1
	-0.075, 0.05, 0, // v2
	0.075, 0.05, 0 // v3
] );

const indices = [
	0, 1, 0,
	0, 2, 0,
	0, 3, 0,
];

const mouthGeometry = new THREE.BufferGeometry();
mouthGeometry.setIndex( indices );
mouthGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

const yewMouth = new THREE.Line( mouthGeometry, mouthMaterial );
yewMouth.position.set(0, -0.18, 0.3)
yewMouth.rotation.x = Math.PI/6

yewHead.add(yewHeadBase,yewEar1,yewEar2,yewNose,yewEyeRight,yewEyeLeft,yewDot,yewMouth)

/**
 * Yew hat
 */
const yewHat = new THREE.Group()
const yewHatBase  = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.17, 0.1),
    yewDressMaterial)
const yewHatTrunk = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.6, 32),
    yewDressMaterial)
const yewHatTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 32, 32),
    new THREE.MeshBasicMaterial({ map: yewFabric }))
      

yewHatTrunk.position.y = 0.25
yewHatTip.position.y = 0.55
yewHat.add(yewHatBase,yewHatTrunk,yewHatTip)


/**
 * Yew Body
 */
const yewBody = new THREE.Group()
const yewHand1 = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.13, 0.2, 32),
    new THREE.MeshBasicMaterial({ map: yewFabric }))

const yewHand2 = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.13, 0.2, 32),
    new THREE.MeshBasicMaterial({ map: yewFabric }))
    
const yewChest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 0.25),
    new THREE.MeshBasicMaterial({ map: yewFabric }))

const yewBoob = new THREE.Mesh(
    new THREE.CircleGeometry( 0.035, 32 ),
    new THREE.MeshBasicMaterial( { color: 0xff0000 } )
)

yewHand1.position.set(- 0.4, 0.1)
yewHand1.rotation.z = Math.PI / 2 - 0.3
yewHand2.position.set(0.4, 0.1)
yewHand2.rotation.z = -(Math.PI / 2 - 0.3)
yewBoob.position.set(0,0.05,0.25)
yewBody.add(yewHand1,yewHand2,yewChest,yewBoob)

/**
 * Yew butt
 */
const yewButt =  new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 32),
    yewDressMaterial
)

yewHat.position.y = 1.2
yewHead.position.y = 0.85
yewBody.position.y = 0.5

/**
 * Group
 */
const group = new THREE.Group()
group.add(yewButt,yewHead,yewHat,yewBody)
scene.add(group,plane)

generateGalaxy(scene)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor(0xffb6c1)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // update yew group
    group.position.x = Math.cos(elapsedTime) * 3 + Math.sin(elapsedTime) * 3
    group.position.z = Math.sin(elapsedTime) * 3
    group.position.y = Math.abs(Math.sin(elapsedTime * 3)) //+ Math.cos(elapsedTime) * 3) 

    group.rotation.x = elapsedTime * 6
    group.rotation.y = - elapsedTime 

    // Update the shadow
    sphereShadow.position.x = group.position.x
    sphereShadow.position.z = group.position.z
    sphereShadow.material.opacity = (1 - group.position.y) * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()