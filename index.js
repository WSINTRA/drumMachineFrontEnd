const numberOfDrumPads = 8;
const dropDownDiv = document.querySelector("div.dropdown-content");
const dropDownTag = document.querySelector(".dropdown-content");
const padClassTag = document.querySelector(".pad");
const soundModal = document.getElementById("soundModal");
const kitModal = document.getElementById("kitModal");
const soundBtn = document.getElementById("addSoundBtn");
const kitBtn = document.getElementById("createKitBtn");
const soundSpan = document.getElementById("soundSpan");
const kitSpan = document.getElementById("kitSpan");
const modalDiv = document.getElementById("sound-modal-content");
const listOfSounds = document.querySelector(".listOfSounds");
const drumKitSubmit = document.querySelector("input.submit");
const container3d = document.querySelector("#container");

//These valus determine sphere Geometry
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

//Create some stars
for (var i = 0; i < particles; i++) {
  positionsForStars.push((Math.random() * 2 - 1) * radius);
}
partGeom.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positionsForStars, 3)
);
var particleSystem = new THREE.Points(partGeom, shaderMaterial);

class Sphere {
  constructor(instance, intInd, scene) {
    this.instance = instance;
    this.intInd = intInd;
    this.scene = scene;
  }
  createMesh() {
    return new this.instance();
  }
}

var scene = new THREE.Scene();
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
renderer.setSize(window.innerWidth, window.innerHeight);
container3d.appendChild(renderer.domElement);

// https://animejs.com/
anime.timeline({ loop: false }).add({
  targets: ".ml15 .word",
  scale: [14, 1],
  opacity: [0, 1],
  easing: "easeInOutSine",
  duration: 1800,
});

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

const listSounds = () => {
  return fetch("https://infinite-tundra-44498.herokuapp.com/api/v1/sounds")
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      listOfSounds.innerHTML = "<br><br><form>";
      res.forEach((sound, index) => {
        let soundID = sound.id;
        listOfSounds.innerHTML += `<ul>
            <audio src="${sound.sound_url}" id="${soundID}"></audio>
            <button onclick="document.getElementById('${soundID}').play()">Preview</button>
            Sound Number: ${(index + 1).toString()}
            <input type="checkbox" name="soundSelection" value="${(
              index + 1
            ).toString()}" onclick="return ValidateSoundSelection();">
           <ul>`;
        //Starts to list links to sound files
        //TODO: Create a loading bar whilst this fetches
        console.log(sound.sound_url);
      });
    });
};

const getDrumkitList = (listKits, kitId = 0) => {
  drawPads = !listKits;
  return fetch(`https://infinite-tundra-44498.herokuapp.com/api/v1/drumkits`)
    .then((resp) => {
      return resp.json();
    })
    .then((kits) => {
      if (listKits) {
        dropDownDiv.innerHTML = "";
        kits.forEach((kit, index) => {
          dropDownDiv.innerHTML += `<p class="drum-kit-item"data-id=${index}> ${kit.name} </p>`;
        });
      } else if (drawPads) {
        let soundURLs = kits[kitId].sounds;
        let padArray = [];
        for (let i = 0; i < numberOfDrumPads; i++) {
          padArray.push(soundURLs[i]);
          padClassTag.innerHTML += `
                        <div class="box pad-${i + 1}">${i + 1}
                        <audio id="audio${i + 1}" src="${
            padArray[i].sound_url
          }" ></audio>
                        </div>`;
        }
      }
    });
};

getDrumkitList(true);

dropDownTag.addEventListener("click", (event) => {
  let kitid = event.target.dataset.id;
  let drawPads = false;
  getDrumkitList(drawPads, kitid);
});
// When the user clicks add sound button, open the modal
soundBtn.onclick = function () {
  soundModal.style.display = "block";
};
// When the user clicks on <span> (x), close the modal
soundSpan.onclick = function () {
  soundModal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
document.onclick = function (event) {
  if (event.target == soundModal) {
    soundModal.style.display = "none";
  }
};
kitBtn.onclick = function () {
  listSounds();
  kitModal.style.display = "block";
};
kitSpan.onclick = function () {
  kitModal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == kitModal) {
    kitModal.style.display = "none";
  }
};

modalDiv.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    let soundUrl = event.target.parentElement.querySelector("input").value;
    addNewSound(soundUrl);
  }
});

////////////////////////////////
/////Make sure no more than 8 sounds are selected per drum kit, called from listSound
//////////////////////////////
function ValidateSoundSelection() {
  var checkboxes = document.getElementsByName("soundSelection");
  var numberOfCheckedItems = 0;
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) numberOfCheckedItems++;
  }
  if (numberOfCheckedItems > 8) {
    alert("You can't select more than 8 sounds for your drumKit");
    return false;
  }
}

drumKitSubmit.addEventListener("click", (event) => {
  let checkboxes = document.getElementsByName("soundSelection");
  let numberOfCheckedItems = 0;
  let checkedTrue = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checkedTrue.push(checkboxes[i]);
      numberOfCheckedItems++;
    }
  }
  if (checkedTrue.length === 8) {
    let kitName = document.querySelector("#KitName").value;
    postNewKit(kitName).then((event) => {
      let drumKitId = event.id;
      for (var i = 0; i < checkedTrue.length; i++) {
        let soundiD = checkedTrue[i].parentElement.firstElementChild.id;
        fetch("https://infinite-tundra-44498.herokuapp.com/api/v1/kit_sounds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ drumkit_id: drumKitId, sound_id: soundiD }),
        });
      }
    });
    alert("New drum kit created");
    kitModal.style.display = "none";
  } else if (checkedTrue.length <= 8) {
    alert(
      `You have only selected ${checkedTrue.length} sounds for your drumKit\nPlease select 8`
    );
    return false;
  }
  getDrumkitList(true);
});

// ************************************************************************ //

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

scene.add(particleSystem);
//Opening camera values
camera.position.z = -70;
camera.position.y = 500;
camera.position.x = 10;
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxDistance = 100;

let createNewSphere = (id) => {
  let illuminate = new Sphere(new THREE.Mesh(geometry, material), id, scene);
  return illuminate.instance;
};
for (let i = 1; i <= numberOfDrumPads; i++) {
  scene.add(createNewSphere(i));
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

padClassTag.addEventListener("click", (event) => {
  // debugger
  let sphereLinkToPad = event.target.innerText;
  let padId = event.target.lastElementChild.id;
  playAudioLink(padId);
  if (padId === "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8") {
    scene.children[parseInt(sphereLinkToPad)].scale.x += randomInt(0, 0.3);
    scene.children[parseInt(sphereLinkToPad)].scale.y += randomInt(0, 0.3);
    scene.children[parseInt(sphereLinkToPad)].scale.z += randomInt(0, 0.3);
  }
});

document.addEventListener("keypress", function (e) {
  if (e.key === "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8") {
    let key = e.key;
    document.querySelector(`div.box.pad-${key}`).style.opacity = 1;
    document.getElementById(`audio${key}`).load();
    document.getElementById(`audio${key}`).play();
    scene.children[key].scale.x += 0.1;
    scene.children[key].scale.y += 0.1;
    scene.children[key].scale.z += 0.1;
  }
});
