// OPENING TEXT ANIMATION JS ******************************************************************************
const numberOfDrumPads = 8;

anime.timeline({loop: false})
  .add({
    targets: '.ml15 .word',
    scale: [14,1],
    opacity: [0,1],
    easing: "easeOutCirc",
    duration: 1800
  });
  
/////////////////////////////////////////
///   END OF OPENING TEXT ANIMATION  //// ***********************************************************************
////////////////////////////////////////

///////////////////////////////////
// DROP DOWN OFF OF OPENING TEXT //
///////////////////////////////////

const dropDownDiv = document.querySelector('div.dropdown-content');

const getDrumkitNames = () => {
return fetch(`https://infinite-tundra-44498.herokuapp.com/api/v1/drumkits`)
.then((resp) => {
      return resp.json()
}).then((resp) => {
    let x = 0;
    dropDownDiv.innerHTML = ""
     resp.forEach((kit) => {
      
           
           dropDownDiv.innerHTML += `<p class="drum-kit-item"data-id=${x}> ${kit.name} </p>`
           x++;
     })
})
}
const dropDownTag = document.querySelector('.dropdown-content')
dropDownTag.addEventListener('click', (event) => {
    let kitid = event.target.dataset.id
    fetchByDrop(kitid)
})
getDrumkitNames()
////////////////////////////
// END OF DROP DOWN LOGIC //
////////////////////////////
////////////////////////////////
//////NEW DB CODE BEGINS
///////////////////////////////
const padClassTag = document.querySelector('.pad')
function fetchByDrop(dropdown) {
let drumkitURL = "https://infinite-tundra-44498.herokuapp.com/api/v1/drumkits"
fetch(drumkitURL)
.then( resp =>  resp.json() )
.then( kits => {
    let soundURLs = kits[dropdown].sounds
   
      let pad1 = soundURLs[0]
      let pad2 = soundURLs[1]
      let pad3 = soundURLs[2]
      let pad4 = soundURLs[3]
      let pad5 = soundURLs[4]
      let pad6 = soundURLs[5]
      let pad7 = soundURLs[6]
      let pad8 = soundURLs[7]
      let padArray = []
      let x = 1
      padArray.push(pad1,pad2,pad3,pad4,pad5,pad6,pad7,pad8)
      padClassTag.innerHTML = ''
      padArray.forEach((url) => {   
      padClassTag.innerHTML += `<div class="box pad-${x}">${x}
     
      <audio id="audio${x}" src="${url.sound_url}" ></audio>

      </div>`
      x++ 
})
})
};


// fetchByDrop()


///////////////////////////////////////////////
// STARTING LOGIC BEHIND MODAL FOR ADD SOUND //
///////////////////////////////////////////////

// Get the modal

const soundModal = document.getElementById('soundModal');
const kitModal = document.getElementById('kitModal');

// Get the button that opens the modal
const soundBtn = document.getElementById("addSoundBtn");
const kitBtn = document.getElementById("createKitBtn");

// Get the <span> element that closes the modal
const soundSpan = document.getElementById("soundSpan");
const kitSpan = document.getElementById("kitSpan");



// When the user clicks the button, open the modal 
soundBtn.onclick = function() {
  soundModal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
soundSpan.onclick = function() {
    soundModal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
document.onclick = function(event) {
    if (event.target == soundModal) {
      soundModal.style.display = "none";
    }
}


kitBtn.onclick = function() {
    listSounds()
    kitModal.style.display = "block";
}

kitSpan.onclick = function() {
    kitModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == kitModal) {
      kitModal.style.display = "none";
    }
  }
//////////////////////////////////////////////
// ENDING LOGIC BEHIND MODAL FOR ADD SOUND ///
//////////////////////////////////////////////


// CREATE SOUND FROM 'ADD SOUND' BUTTON //
const modalDiv = document.getElementById('sound-modal-content')

const addNewSound = (soundUrl) => {
    
    return fetch('https://infinite-tundra-44498.herokuapp.com/api/v1/sounds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },

        body: JSON.stringify({'sound_url': soundUrl})
    }).then((res) => {
        return res.json();
    })
}

modalDiv.addEventListener('click', (event) => {
    if(event.target.tagName === 'BUTTON') {
        let soundUrl = event.target.parentElement.querySelector('input').value;
        addNewSound(soundUrl);
    }
})
//////ADD NEW KIT FUNCTION
const addNewKit = (kitName) => {
   return fetch("https://infinite-tundra-44498.herokuapp.com/api/v1/drumkits", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify( { "name": kitName } ) 
       })
    .then((res) => {
        
        return res.json();
    })
}

/////List Sounds function
let listOfSounds = document.querySelector(".listOfSounds")

const listSounds = () => {
    return fetch('https://infinite-tundra-44498.herokuapp.com/api/v1/sounds')
    .then( ( response ) => { 
        return response.json() } )
    .then((res) => {
       
        let x = 1
        listOfSounds.innerHTML = "<br><br><form>"
        res.forEach((sound) => { 
          
////SOME LOGIC HERE TO WRITE INDEX PAGE
            let soundID = sound.id
            listOfSounds.innerHTML += `<ul>
           
            <audio src="${sound.sound_url}" id="${soundID}"></audio>
            <button onclick="document.getElementById('${soundID}').play()">Preview</button>
            Sound Number: ${x.toString()}

            <input type="checkbox" name="soundSelection" value="${x.toString()}" onclick="return ValidateSoundSelection();">

           <ul>`
            console.log(sound.sound_url)
            x++}
            )
           
            
    })
}
////////////////////////////////
/////Make sure no more than 8 buttons are clicked per drum kit
//////////////////////////////
function ValidateSoundSelection()  
{  
    var checkboxes = document.getElementsByName("soundSelection");  
    var numberOfCheckedItems = 0;  
    for(var i = 0; i < checkboxes.length; i++)  
    {  
        if(checkboxes[i].checked)  
            numberOfCheckedItems++;  
    }  
    if(numberOfCheckedItems > 8)  
    {  
        alert("You can't select more than 8 sounds for your drumKit");  
        return false;  
    }  
}  

///////////////////create listener for drumkit creation
let drumKitSubmit = document.querySelector('input.submit')

drumKitSubmit.addEventListener('click', (event) => {
var checkboxes = document.getElementsByName("soundSelection"); 
var numberOfCheckedItems = 0; 
var checkedTrue = []
    for(var i = 0; i < checkboxes.length; i++)  
     {  
        if(checkboxes[i].checked)  
          {
            checkedTrue.push(checkboxes[i])
            numberOfCheckedItems++;
          }
    }  
   if (checkedTrue.length === 8) {
    let kitName = document.querySelector('#KitName').value
        addNewKit(kitName).then((event) => { 
        ///////////////////////////
        //ADDED ^ NEW KIT TO THE DB
        ///////////////////////////
        ///Then to build new kit using kitSound
            let drumKitId = event.id 
            for (var i = 0; i < checkedTrue.length; i++)
        {
        let soundiD = checkedTrue[i].parentElement.firstElementChild.id
        fetch('https://infinite-tundra-44498.herokuapp.com/api/v1/kit_sounds', { 
                    method:'POST',
                     headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'  },
            body: JSON.stringify( { drumkit_id: drumKitId, sound_id: soundiD } ) 
 
                                  })
                  
        }

        })
      alert("New drum kit created"); 
      kitModal.style.display = "none"; 
      
//////////make the box close on this click
                  
//////END OF checkedTrue length statement/////
}
else if (checkedTrue.length <= 8)
{
    alert(`You have only selected ${checkedTrue.length} sounds for your drumKit\nPlease select 8`);  
        return false;  

} 
getDrumkitNames()
    })
                                                    
// ************************************************************************ //




///////////////////////
////BEGIN 3D scene creation
///////////////////////
const container3d = document.querySelector('#container')
//SCene
var scene = new THREE.Scene();

//camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
//renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container3d.appendChild( renderer.domElement );


function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
///Start building geomatry///////

let geometry = new THREE.SphereGeometry(randomIntFromInterval(4,10),randomIntFromInterval(5,10),randomIntFromInterval(4,40))
let material = new THREE.MeshNormalMaterial({wireframe: true})

///// 8 spheres for each pad
class Sphere{
    constructor(instance, intInd, scene){
        this.instance = instance
        this.intInd = intInd
        this.scene = scene
    }
    
    createMesh(){
        return new this.instance
    }
}
// newSphere = new Sphere((new THREE.Mesh(geometry, material)), 1, scene)

// let sphere1 = new THREE.Mesh(geometry, material)
// scene.add(newSphere.instance)
// let sphere2 = new THREE.Mesh(geometry, material)
// scene.add(sphere2)

// let sphere3 = new THREE.Mesh(geometry, material)
// scene.add(sphere3)

// let sphere4 = new THREE.Mesh(geometry, material)
// scene.add(sphere4)
// let sphere5 = new THREE.Mesh(geometry, material)
// scene.add(sphere5)
// let sphere6 = new THREE.Mesh(geometry, material)
// scene.add(sphere6)
// let sphere7 = new THREE.Mesh(geometry, material)
// scene.add(sphere7)
// let sphere8 = new THREE.Mesh(geometry, material)
// scene.add(sphere8)

//Create some particles
//////////////////////
var tex = new THREE.TextureLoader().load("https://static.wixstatic.com/media/6641d6_b083a3071334433f809d9daf8bba0fcb~mv2.png");
  // load the texture
var partGeom
var particleSystem
var particles = 100000;
var radius = 3000;
var positions = [];
var colors = [];
var sizes = [];
partGeom = new THREE.BufferGeometry();
var color = new THREE.Color();
var shaderMaterial = new THREE.PointsMaterial( { 
    size: 10,
    sizeAttenuation: false,
    alphaTest: 0.5, 
    transparent: true,
    map: tex  } );

for ( var i = 0; i < particles; i ++ ) {
            positions.push( ( Math.random() * 2 - 1 ) * radius );
            // positions.push( ( Math.random() * 2 - 1 ) * radius );
            // positions.push( ( Math.random() * 2 - 1 ) * radius );
            color.setHSL( i / particles, 1.0, 0.5 );
            colors.push( color.r, color.g, color.b );
            //was 200 ??
            // sizes.push( i * 200 );
        }

partGeom.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
partGeom.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
partGeom.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 4 ).setUsage( true ) );

particleSystem = new THREE.Points( partGeom, shaderMaterial );
scene.add( particleSystem );

camera.position.z = -70;
camera.position.y = 0;
camera.position.x = 0;

let controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.maxDistance = 100

let createNewSphere = (id)=> {
    let illuminate = new Sphere((new THREE.Mesh(geometry, material)), id, scene)
    return illuminate.instance
}
for(let i=0; i<numberOfDrumPads; i++){
    scene.add (createNewSphere(i))
}

var animate = function () {

    requestAnimationFrame( animate );

while (camera.position.x >= 400 ){
    camera.position.x = -100
}
camera.position.x += 0.1
    
    /////////////////
    //This t1 value effects how randomly violent the spheres will be
    // t1 += 0.0052;  
    // t1 = Math.random(0.0052,0.0059);
    for(let i=1; i<numberOfDrumPads-1;i++){
        let t1 = Math.random(0.0052,0.0053);
        t1 += i
    scene.children[i].rotation.x += Math.random(0.0001,0.002);
    // scene.children[i].rotation.z += 0.002
    scene.children[i].position.y = 20*Math.cos(t1) + 0;
    scene.children[i].position.z = 20*Math.sin(t1) + 0;
    }   
    controls.update()

    renderer.render( scene, camera );
};

 function playAudioLink(value){
       var audio = document.getElementById(`${value}`);
       audio.play();
                 }

animate();

padClassTag.addEventListener('click', (event) => {
    // debugger
    let sphereLinkToPad = event.target.innerText
    let padId = event.target.lastElementChild.id
    playAudioLink(padId);
    if(padId === '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8'){
    scene.children[parseInt(sphereLinkToPad)].scale.x += 0.1;
    scene.children[parseInt(sphereLinkToPad)].scale.y += 0.1;
    scene.children[parseInt(sphereLinkToPad)].scale.z += 0.1;
    }
})

document.addEventListener('keypress', function (e) {
    if (e.key === '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8') {
        let key = e.key;
        document.querySelector(`div.box.pad-${key}`).style.opacity = 1
        document.getElementById(`audio${key}`).load()
        document.getElementById(`audio${key}`).play()
        scene.children[key].scale.x += 0.1
        scene.children[key].scale.y += 0.1
        scene.children[key].scale.z += 0.1
    }

});
