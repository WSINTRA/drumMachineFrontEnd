const container3d = document.getElementById("3D-container");
const previousBuiltDrumKits = [];

const getDrumkitList = () => {
    return fetch(`https://infinite-tundra-44498.herokuapp.com/api/v1/drumkits`)
      .then((resp) => {
        return resp.json();
      })
      .then((kits) => {
        kits.forEach(kit=>{
            previousBuiltDrumKits.push(kit)
        });
    });
  };
getDrumkitList()

const numberOfDrumPads = 8;
const sphereRadius = 5;
const widthSegments = 2;
const heightSegments = 2;
let geometry = new THREE.SphereGeometry(
  sphereRadius,
  widthSegments,
  heightSegments
);
let material = new THREE.MeshNormalMaterial({ wireframe: true });

//Texture for stars
var tex = new THREE.TextureLoader().load(
  "https://static.wixstatic.com/media/6641d6_b083a3071334433f809d9daf8bba0fcb~mv2.png"
);
var particles = 100000;
var radius = 2200;
var positionsForStars = [];
var colorsOfStars = [];
var sizesOfStars = [];
var color = new THREE.Color();
var shaderMaterial = new THREE.PointsMaterial({
  size: 10,
  sizeAttenuation: false,
  alphaTest: 0.5,
  transparent: true,
  map: tex,
});
var partGeom = new THREE.BufferGeometry();
var scene = new THREE.Scene();
//Create some stars
for (var i = 0; i < particles; i++) {
  positionsForStars.push((Math.random() * 2 - 1) * radius);
}
partGeom.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positionsForStars, 3)
);
var particleSystem = new THREE.Points(partGeom, shaderMaterial);
scene.add(particleSystem);
// PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
// fov — Camera frustum vertical field of view.
// aspect — Camera frustum aspect ratio.
// near — Camera frustum near plane.
// far — Camera frustum far plane.
var camera = new THREE.PerspectiveCamera(
  75, //fov
  window.innerWidth / window.innerHeight, //aspect
  0.1, //near
  1000 //far
);
var renderer = new THREE.WebGLRenderer();
container3d.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);


camera.position.z = -70;
camera.position.y = 500;
camera.position.x = 10;
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxDistance = 100;
// try {

// } catch (err) {
//     // alert("This website is made with WebGL that has failed to render, please check your browser settings")
//   console.log(err);
// }

//Opening camera values

class Sphere {
  constructor(instance) {
    this.instance = instance;
  }
}
// https://animejs.com/
// anime.timeline({ loop: false }).add({
//   targets: ".ml15 .word",
//   scale: [14, 1],
//   opacity: [0, 1],
//   easing: "easeInOutSine",
//   duration: 1800,
// });

const postNewKit = (kitName) => {
  return fetch("https://infinite-tundra-44498.herokuapp.com/api/v1/drumkits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name: kitName }),
  }).then((res) => {
    return res.json();
  });
};

const addNewSound = (soundUrl) => {
  return fetch("https://infinite-tundra-44498.herokuapp.com/api/v1/sounds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ sound_url: soundUrl }),
  }).then((res) => {
    return res.json();
  });
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let createNewSphere = () => {
  let illuminate = new Sphere(new THREE.Mesh(geometry, material));
  return illuminate.instance;
};

for (let i = 1; i <= numberOfDrumPads; i++) {
  scene.add(createNewSphere());
  scene.children[i].position.y = 20 * Math.cos(i * 360) + 0;
  scene.children[i].position.z = 23 * Math.sin(i * 360) + 0;
}
function TurnCamera() {
  camera.position.x -= 0.1;
}
function TurnSpheres() {
  for (let i = 1; i <= numberOfDrumPads; i++) {
    scene.children[i].rotation.y += 0.023 * Math.cos(i / 8) + 0;
  }
}
var animate = function () {
  requestAnimationFrame(animate);
  TurnCamera();
  TurnSpheres();
  controls.update();
  renderer.render(scene, camera);
};
animate();

function playAudioLink(value) {
  var audio = document.getElementById(`${value}`);
  audio.play();
}

function showDropDownMenu() {
    var x = document.getElementById("menu-links");
    for(let i=0; i<previousBuiltDrumKits.length;i++){
          x.innerHTML += `<div class="menu-link-item">${previousBuiltDrumKits[i].name}</div>`
      }
    if (x.style.display === "grid") {
      x.style.display = "none";
      x.previousElementSibling.innerHTML = x.previousElementSibling.innerHTML.replace('<h4 class="subtitle">Drum Kits</h4>' , " ");
      x.innerHTML = ``
    } else {
      x.previousElementSibling.innerHTML += '<h4 class="subtitle">Drum Kits</h4>'
      x.style.display = "grid";
    }
  }