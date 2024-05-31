// objects, because I felt like given them a try
const Player = {
  'x': 400,
  'y': 300,
  'action': 0,
  'heldItem': 0,
  'move': (input)=>{
    if (input%2 == 0){
      Player['y'] += (input-3)*4
      
    } else{
      Player['x'] += (input-2)*4
    }
  },
  'devCreationTool': {
    "is_active":false,
    "holdingObject":false,
    "holdingWhat":0,},
  "Wait": [0,0,0,0,0,0,0,0,0,0,0,0]
}

const stations = {
  'walls': [],
  'food': [],
  'cooking': [],
  'delivering': [],
}


let UICordinates = [[20,20,60,60,false],[120,20,160,60,0],[220,20,260,60,0],[320,20,360,60,0]]


// this object will keep tack of which keys are held down and do a corrisponding action
const KEYS_DOWN = {
  "w": {bool: false, func: ()=>{Player.move(2) }},
  "s": {bool: false, func: ()=>{Player.move(4) }},
  "a": {bool: false, func: ()=>{Player.move(1) }},
  "d": {bool: false, func: ()=>{Player.move(3) }},
  "l": {bool: false, func: ()=>{}},
  "p": {bool: false, func: ()=>{if (KEYS_DOWN['l'].bool){Player.devCreationTool.is_active= true}}},
  "r": {bool: false, func: ()=>{Player.devCreationTool.is_active = false}},
  // this one I needed to get a bit of help. this just goes trough all the keys and 
  // checks if their boolien state is true or false then does the function if true
  'check':()=>  {Object.keys(KEYS_DOWN).forEach(key=> {
    if (KEYS_DOWN[key].bool){
      KEYS_DOWN[key].func()
    }
  })}
}

// the event listiners ahead will set the key to "true" when it is first pressed down, and "false" when you stop holding it down
window.addEventListener("keydown",(event)=>{
  if (KEYS_DOWN[event.key]){
    KEYS_DOWN[event.key].bool = true
  }
})

window.addEventListener("keyup",(event)=>{
  if (KEYS_DOWN[event.key]){
    KEYS_DOWN[event.key].bool = false
  }
})

/**
 * for testing colours of walls will dhow what is what
 * 
 * blue = food;
 * red = cook;
 * green = deliver;
 * purple = wall;
 */
// Wall and station function because of lazyness
function createLEVEL(){
  if (Player.devCreationTool.is_active){
    fill(0,0,200)
    rect(20,20,40,40)
    fill(0,200,0)
    rect(120,20,40,40)
    fill(200,0,0)
    rect(220,20,40,40)
    fill(100,0,200)
    rect(320,20,40,40)
  }
  // shows the objects in the level
  
  for (let gotoGo = 0; gotoGo< 4;gotoGo++){
    let list_Of_Stations = ["walls","cooking","food","delivering"]
    let key = list_Of_Stations[gotoGo]
    for (let i = 0; i<stations[key].length;i++){
      console.loog(stations[key][i])
    }
  }
  if (Player.devCreationTool.holdingObject){
    rect(Math.floor(mouseX/40)*40,Math.floor(mouseY/40)*40,40,40)
  }
  
}

/**
 * will run the function when the mouse is clicked
 * when done will check for all ui elements and if they are active then go on to active interactive elements
 */
function mouseClicked(){
  if (Player.devCreationTool.holdingObject&& Player.Wait[0]<new Date().getTime()){
    stations.walls.unshift([Math.floor(mouseX/40)*40,Math.floor(mouseY/40)*40,Math.ceil(mouseX/40)*40,Math.ceil(mouseY/40)*40,Player.devCreationTool.holdingWhat])
    console.log(stations.walls[0])
    Player.devCreationTool.holdingObject = false
  }
  for (let i = 0; i<UICordinates.length;i++){
    if (UICordinates[i][4]){
      let mxy = [(UICordinates[i][0]+UICordinates[i][2])/2,(UICordinates[i][1]+UICordinates[i][3])/2]
    if (SDist(mxy[0],0,mouseX,0) < SDist(mxy[1],0,mouseY,0)){
      mxy[0] = SDist(mxy[1],0,mouseY,0)
      mxy[1] = Math.abs((UICordinates[i][1] - UICordinates[i][3])/2)
    } else {
      mxy[0] = SDist(mxy[0],0,mouseX,0)
      mxy[1] = Math.abs((UICordinates[i][0] - UICordinates[i][2])/2)
    }
    if (mxy[0]<=mxy[1]&& Player.Wait[0]<new Date().getTime()){
      if (i<4){
        Player.devCreationTool.holdingObject = true
        Player.devCreationTool.holdingWhat = i
        console.log(Player.devCreationTool)
        Player.Wait[0] = new Date().getTime() + 1000 
      } else if( i <8){

      }
    };
  }
    }
    
}

/**
 * type "0" in the second and fourth places if it is a 2 variable check;
 *  (x1,y1,x2,y2)
 */
function SDist(value1,value2,value3,value4){
  return Math.sqrt(((value1-value3)**2)+((value2-value4)**2))
}

//-----------------------------------------------------------------------------------------------------
function setup(){
  createCanvas(1200,800)
}


function draw(){
  background(135)
  fill(255)
  rect(120,80,960,640)

  fill(195)
  rect(Player['x'],Player['y'],30,50)
  KEYS_DOWN["check"]()
  circle(mouseX,mouseY,30)
  if (Player.devCreationTool.is_active) {
    for (let i = 0; i< 4; i++){
      UICordinates[i][4] = true
    }
    } else {
      for (let i = 0; i< 4; i++){
        UICordinates[i][4] = false
      }
    } 
    createLEVEL()
  
}