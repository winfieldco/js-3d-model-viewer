import * as THREE from 'three'
import OBJLoader from 'three-obj-loader'
const OrbitControls = require('three-orbit-controls')(THREE)
OBJLoader(THREE)

const hasWebkitFullScreen = 'webkitCancelFullScreen' in document
const hasMozFullScreen = 'mozCancelFullScreen' in document
const scene = new THREE.Scene()
let renderer = null
let element = null
let camera = null

const setCamera = (aspect) => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  camera.position.z = 5
  camera.aspect = aspect
  camera.updateProjectionMatrix()
  return camera
}

const setLights = (scene) => {
  const ambient = new THREE.AmbientLight(0xffffff, 0.25)
  const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
  const keyLight = new THREE.DirectionalLight(
    new THREE.Color('#EEEEEE'),
    0.5
  )
  const fillLight = new THREE.DirectionalLight(
    new THREE.Color('#EEEEEE'),
    0.75
  )

  keyLight.position.set(-100, 0, 100)
  fillLight.position.set(100, 0, 100)
  backLight.position.set(100, 0, -100).normalize()
  ambient.intensity = 0.25

  scene.add(ambient)
  scene.add(keyLight)
  scene.add(fillLight)
  scene.add(backLight)
  return { keyLight, fillLight, backLight, ambient }
}

const setControls = (camera, renderer) => {
  const controls = new OrbitControls(
    camera,
    renderer.domElement
  )
  controls.enableZoom = true
  return controls
}

const setRenderer = (width, height) => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(new THREE.Color('hsl(0, 0%, 10%)'))
  return renderer
}

const render = (element, renderer, scene, camera) => {
  element.appendChild(renderer.domElement)
  const animate = () => {
    window.requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
  return scene
}

const prepareScene = (domElement) => {
  const width = domElement.offsetWidth
  const height = domElement.offsetHeight

  element = domElement
  camera = setCamera(width / height)
  renderer = setRenderer(width, height)
  setLights(scene)
  setControls(camera, renderer)
  render(element, renderer, scene, camera)
  window.addEventListener('resize', onWindowResize, false)
}

const loadObject = (url) => {
  const objLoader = new THREE.OBJLoader()
  const material = new THREE.MeshPhongMaterial({ color: 0xbbbbcc })
  objLoader.load(url, (obj) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material
      }
    })
    scene.add(obj)
  })
  return objLoader
}

const clearScene = () => {
  scene.children.forEach((obj) => {
    if (obj.type === 'Group') {
      scene.remove(obj)
    }
  })
}

const goFullScreen = () => {
  if (hasWebkitFullScreen) {
    return element.webkitRequestFullScreen()
  } else if (hasMozFullScreen) {
    return element.mozRequestFullScreen()
  } else {
    return false
  }
}

const onWindowResize = () => {
  const width = element.offsetWidth
  const height = element.offsetHeight
  const aspect = width / height
  camera.aspect = aspect
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

export { prepareScene, loadObject, clearScene, goFullScreen }