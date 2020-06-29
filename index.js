const container3d = document.getElementById("3D-container");

// https://animejs.com/
anime.timeline({ loop: false }).add({
  targets: "#anim-title",
  scale: [14, 1],
  opacity: [0, 1],
  easing: "easeInOutSine",
  duration: 1800,
});
const preSavedSounds = [];
let preBuiltDrumKits = [];
let newPadsArray = [];

const getDrumkitList = () => {
  preBuiltDrumKits = [];
  return fetch(`https://infinite-tundra-44498.herokuapp.com/api/v1/drumkits`)
    .then((resp) => {
      return resp.json();
    })
    .then((kits) => {
      kits.forEach((kit) => {
        preBuiltDrumKits.push(kit);
      });
    });
};
//Initial fetch of all kits, fills preBuiltDrumKits array
getDrumkitList()

const getSoundsList = () => {
  return fetch("https://infinite-tundra-44498.herokuapp.com/api/v1/sounds")
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      res.forEach((sound) => preSavedSounds.push(sound));
    });
};
getSoundsList();

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

class drumKit {
    constructor(kitTitle, kitSounds){
        this.kitTitle = kitTitle;
        this.kitSounds = kitSounds;
    }
    push(sound){
        this.kitSounds.push(sound)
    }
}

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
  try {
    audio.play();
  } catch (err) {
    console.log(err);
  }
}

function showDrumKit(id) {
  let name = preBuiltDrumKits[id].name;
  let soundsArray = preBuiltDrumKits[id].sounds;
  var x = document.getElementById("menu-links");
  let length = x.children.length;
  x.innerHTML = createNewKit(name, soundsArray);
}

var prevHeading;
function showDropDownMenu(Heading) {
  var x = document.getElementById("menu-links");
  if (Heading === "Drum Kits") {
    console.log(preBuiltDrumKits)
    for (let i = 0; i < preBuiltDrumKits.length; i++) {
      x.innerHTML += `<div class="menu-link-item" onclick="showDrumKit('${i}')">${preBuiltDrumKits[i].name}</div>`;
    }
  }
  if (Heading === "Create New Kit") {
    newPadsArray = [];
    console.log(preSavedSounds, newPadsArray);
    x.innerHTML = componentToAddNewKit(preSavedSounds);
  }
  if (x.style.display === "grid") {
    x.style.display = "none";
    x.previousElementSibling.innerHTML = x.previousElementSibling.innerHTML.replace(
      `<h4 class="subtitle">${prevHeading}</h4>`,
      " "
    );
    x.innerHTML = ``;
  } else {
    x.previousElementSibling.innerHTML += `<h4 class="subtitle">${Heading}</h4>`;
    x.style.display = "grid";
  }
  prevHeading = Heading;
}

function createNewKit(KitName, kitSounds) {
  let strikePads = "";
  for (let i = 0; i < kitSounds.length; i++) {
    strikePads += `<div class="strike-pad" onclick="playAudioLink('${i}')">
                        <h3>${i + 1}</h3>
                        <audio id="${i}">
                            <source src="${
                              kitSounds[i].sound_url
                            }" type="audio/mpeg">
                        </audio> 
                        </div>`;
  }
  return `<h1>${KitName}</h1>
    <div class="drum-pads">
        ${strikePads}
    </div>`;
}

document.addEventListener("keypress", function (e) {
  if (e.key === "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8") {
    let key = e.key - 1;
    var audio = document.getElementById(`${key}`);
    audio.play();
    scene.children[key + 1].scale.x += 0.1;
    scene.children[key + 1].scale.y += 0.1;
    scene.children[key + 1].scale.z += 0.1;
  }
});

//This function for preview in dropDown
const playAudio = () => {
  let id = document.getElementById("selected-sound").value;
  let url = preSavedSounds[id].sound_url;
  new Audio(url).play();
};

const drawTempPad=(newPadsArray)=>{
    let tempKit = document.getElementById("temp-kit");
    let sounds = []
    newPadsArray.forEach(pad=>{
       sounds.push(pad.sound)
    })
    let kitTitle = document.getElementById('drum-kit-title').value;
    tempKit.innerHTML = createNewKit(kitTitle, sounds);
}
const saveNewKitToDB=()=>{
    let kitTitle = document.getElementById('drum-kit-title').value;
    if(!kitTitle.length >0 ){
        alert("Your kit must have a title, try again")
        return null
    }
    //Here we go,
    postNewKit(kitTitle).then((newKit) => {
        let drumKitId = newKit.id;
        
        for (var i = 0; i < newPadsArray.length; i++) {
          let soundID = newPadsArray[i].sound.id
          fetch("https://infinite-tundra-44498.herokuapp.com/api/v1/kit_sounds", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ drumkit_id: drumKitId, sound_id: soundID }),
          }).then(res=>res.json())
        }
      })
          //For now just alert the return
          //TODO: Error check and confirm
          .then(newKit=>alert("kit added"))
          //reset the array and repopulate
          .then(()=>getDrumkitList());
}

const pushNewPadToTemp=()=>{
    let id = document.getElementById("selected-sound").value;
    if (newPadsArray.length < 8){
    newPadsArray.push( {'sound':preSavedSounds[id]} )
    //When new pad is added, render a small pad on screen to represent it
      drawTempPad(newPadsArray);
      if(newPadsArray.length == 8){
        let tempKit = document.getElementById("temp-kit");
        tempKit.innerHTML += `<div class="icon" onclick="saveNewKitToDB()">
        <h4 style="padding: 1rem;"><i class="fa fa-plus-square-o" aria-hidden="true"></i>Save Kit</h4>
      </div> `
      }
    }
    
}

function componentToAddNewKit(preSavedSounds) {
  const createOptionsFromList = () => {
    let optionString = "";
    preSavedSounds.forEach(
      (sound,index) =>
        (optionString += `<option value='${
          index
        }'>${faker.random.word()}</option>`)
    );
    return optionString;
  };
  //lists the current sounds, so far 60 sound files
  //Best way to arrange them is in a library
  //That requires some sort of ordering
  const component = `<form class="form-newkit"><div class="form-group">
    <label for="drum-kit-title">Kit Title</label>
    <input type="text" class="form-control" id="drum-kit-title" placeholder="Your new kit">
  </div>
  <div class="form-group">
    <label for="selected-sound">Sound select</label>
    <select class="form-control" id="selected-sound">
      ${createOptionsFromList()}
    </select>
    
    <div class="icon" onclick="playAudio()">
    <i class="fa fa-play" aria-hidden="true"></i>
    Preview sound
  </div>
  <div class="icon" onclick="pushNewPadToTemp()">
  <h4 style="padding: 1rem;"><i class="fa fa-plus-square-o" aria-hidden="true"></i>Add Sound to Pad</h4>
</div>  
</form>
</div></form><div class="temp-pads" id="temp-kit"></div>`;
  return component;
}
