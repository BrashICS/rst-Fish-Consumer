// objects, because I felt like given them a try
const Player = {
  'x': 400,
  'y': 300,
  'action': 0,
  'heldItem': 0,
  'move': (input)=>{
    if (input%2 == 0){
      Player['y'] += (input-3)*3
    } else{
      Player['x'] += (input-2)*3
    }
    for (let gotoGo = 0; gotoGo< 4;gotoGo++){
      let list_Of_Stations = ["walls","cooking","food","delivering"]
      let key = list_Of_Stations[gotoGo]
      for (let i = 0; i<stations[key].length;i++){
        if (SDist(Player['x']+15,0,stations[key][i][0]+(stations[key][i][2]/2),0)<35 && SDist(Player['y']+15,0,stations[key][i][1]+(stations[key][i][2]/2),0)<35){
          if (input%2 == 0){
            Player['y'] -= (input-3)*3
          } else{
            Player['x'] -= (input-2)*3
          }
        }
      }
    }
    let Xoffset = 0
    let Yoffset = 0
    
    if (!(KEYS_DOWN['w'].bool && KEYS_DOWN['s'].bool)){
      if (KEYS_DOWN['w'].bool){
        Yoffset -= 20
      } else if(KEYS_DOWN['s'].bool){
        Yoffset += 20
      }
      Player.LastLook[1] = Yoffset
        
    }
    if (!(KEYS_DOWN['a'].bool && KEYS_DOWN['d'].bool)){
      if (KEYS_DOWN['a'].bool){
        Xoffset -= 20
      } else if(KEYS_DOWN['d'].bool){
        Xoffset += 20
      }
      Player.LastLook[0] = Xoffset
    }
    
  },
  'devCreationTool': {
    "is_active":false,
    "holdingObject":false,
    "holdingWhat":0,},
    /** Wait List;
     * 
     *  0 = cooldown to inteact with objects for devtool;   
     *  1 = For the SetUpStage function when it is either putting the numbers for the "X ID" or the "Y ID" for the wall;   
     *  2 = Cooldown to grab an object;   
     * 
     */
  "Wait": [0,0,0,0,0,0,0,0,0,0,0,0],
  "grab": ()=>{
    if (Player.heldItem == 99) Player.heldItem = 0;
    for (let gotoGo = 0; gotoGo< 4;gotoGo++){
        let list_Of_Stations = ["walls","cooking","food","delivering"]
        let key = list_Of_Stations[gotoGo]
        for (let i = 0; i<stations[key].length;i++){
          if (SDist(Player['x']+15+Player.LastLook[0],0,stations[key][i][0]+(stations[key][i][2]/2),0)<35 && SDist(Player['y']+15+Player.LastLook[1],0,stations[key][i][1]+(stations[key][i][2]/2),0)<35){
            console.log("hit")
            if (Player.heldItem == 0 && key == "food"){
              Player.heldItem = 1
              console.log("grabed")
              
            } else if (key == "cooking"){
              stations[key][i][5] = 0
              if (Player.heldItem == 1 && stations[key][i][3] == 1){
                console.log("cooking")
              stations[key][i][3] = 4
              Player.heldItem = 0
              } else if (Player.heldItem == 0 && stations[key][i][3] == 4){
                stations[key][i][3] = 1
              } else if (Player.heldItem == 0 && stations[key][i][3] == 5){
                Player.heldItem = 2
                stations[key][i][3] = 1
              } else if (Player.heldItem == 0 && stations[key][i][3] == 6){
                Player.heldItem = 99
                stations[key][i][3] = 1
              } 
            } else if (Player.heldItem > 0 && key == "delivering"){
                Player.heldItem = 0
                Player.Score += 300
            }
            Player.Wait[2] = new Date().getTime() +500
          } 
        }
      }
    },
    "LastLook":[0,0],
    "Score": 0

  
}
/** 
 *  0 = X pos;
 *  1 = Y pos;
 *  2 = size of box;
 *  3 = what station type is it;
 *  4 (food) = type of food it gives;
 *  4 (cooking) = type of food put in;
 *  5 (cooking) = time cooking;
 * 
 *  */ 
const stations = {
  'walls': [],
  'food': [],
  'cooking': [],
  'delivering': [],
  'giveNAME': ["walls","cooking","food","delivering"]
}


let UICordinates = [[20,20,60,60,false],[120,20,160,60,0],[220,20,260,60,0],[320,20,360,60,0]]


// this object will keep tack of which keys are held down and do a corrisponding action
const KEYS_DOWN = {
  "w": {bool: false, func: ()=>{Player.move(2) }},
  "s": {bool: false, func: ()=>{Player.move(4) }},
  "a": {bool: false, func: ()=>{Player.move(1) }},
  "d": {bool: false, func: ()=>{Player.move(3) }},
  "f": {bool: false, func: ()=>{if (Player.Wait[2] < new Date().getTime())Player.grab()}},
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


document.querySelector("#giveText").addEventListener("click",()=>{
  let dave = []
  for (let gotoGo = 0; gotoGo< 4;gotoGo++){
    let list_Of_Stations = stations.giveNAME
    let key = list_Of_Stations[gotoGo]
    dave.push(list_Of_Stations[gotoGo],[])
    for (let i = 0; i<stations[key].length;i++){
      dave[(gotoGo*2)+1].push([stations[key][i][0]/10,stations[key][i][1]/10])
    }
  }
  document.querySelector("#levelShowData").textContent = dave
})
/**
 * for testing colours of walls will dhow what is what
 * 
 * red = food;
 * blue = cook;
 * green = deliver;
 * purple = wall;
 */
// Wall and station function because of lazyness
function createLEVEL(){
  if (Player.devCreationTool.is_active){
    colourFills(0)
    rect(20,20,40,40)
    colourFills(1)
    rect(120,20,40,40)
    colourFills(2)
    rect(220,20,40,40)
    colourFills(3)
    rect(320,20,40,40)
  }
  // shows the objects in the level
  
  for (let gotoGo = 0; gotoGo< 4;gotoGo++){
    let list_Of_Stations = stations.giveNAME
    let key = list_Of_Stations[gotoGo]
    for (let i = 0; i<stations[key].length;i++){
      colourFills(stations[key][i][3])
      rect(stations[key][i][0],stations[key][i][1],40,40)
    }
  }
  if (Player.devCreationTool.holdingObject){
    colourFills(Player.devCreationTool.holdingWhat)
    rect(Math.floor(mouseX/40)*40,Math.floor(mouseY/40)*40,40,40)
  }
  
}

/**
 * will run the function when the mouse is clicked
 * when done will check for all ui elements and if they are active then go on to active interactive elements
 */
function mouseClicked(){
  if (Player.devCreationTool.holdingObject && Player.Wait[0]<new Date().getTime()){
    // Checks for name then to toss some coordinates at the array that fits the type of object you put down
    stations[stations.giveNAME[Player.devCreationTool.holdingWhat]].unshift([Math.floor(mouseX/40)*40,Math.floor(mouseY/40)*40,40,Player.devCreationTool.holdingWhat])
    Player.devCreationTool.holdingObject = false
    Player.Wait[0] = new Date().getTime() + 500

  } else if(Player.devCreationTool.is_active && (!Player.devCreationTool.holdingObject) && Player.Wait[0]<new Date().getTime()){
    for (let gotoGo = 0; gotoGo< 4;gotoGo++){
      let key = stations.giveNAME[gotoGo]
      for (let i = 0; i<stations[key].length;i++){
        if (SDist(mouseX,0,stations[key][i][0]+(stations[key][i][2]/2),0)<20 && SDist(mouseY,0,stations[key][i][1]+(stations[key][i][2]/2),0)<20){
          stations[key] = removeFromList(stations[key],i)
        }
      }
    }
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
        Player.Wait[0] = new Date().getTime() + 500 
      } else if( i <8){

      }
    };
  }
    }
    
}

/**
 * type "0" in the second and fourth places if it is a 2 variable{} check;
 *  (x1,y1,x2,y2)
 */
function SDist(value1,value2,value3,value4){
  return Math.sqrt(((value1-value3)**2)+((value2-value4)**2))
}

//because some sets of colours are used more than others and making a function to get them is easier
function colourFills(id){
  if (id == 2){
    fill(0,0,200)
  } else if(id==3){
    fill(0,200,0)
  }else if(id==1){
    fill(200,0,0)
  }else if(id==0){
    fill(100,0,200)
  } else if(id==4){
    fill(200,50,150)
  }else if(id==6){
    fill(100)
  }else if(id==5){
    fill(242,210,189)
  }
}

/**
 * type in the id number second for which id you want to get rid of
 * 
 */
function removeFromList(list,id){
  let TempList = []
  for (let r = 0; r<list.length;r++){
    if (r != id){
      TempList.push(list[r])
    }
  }
  return TempList
}

SetUpLevel("walls,76,40,72,40,68,40,64,40,60,40,80,36,80,32,80,28,80,24,80,20,76,16,72,16,68,16,64,16,60,16,56,16,52,16,48,16,44,16,40,16,36,16,32,16,56,40,52,40,48,40,44,40,40,40,36,40,32,40,80,40,80,16,68,28,64,32,64,24,68,28,64,32,64,24,28,16,28,36,28,40,28,20,68,28,64,32,64,24,cooking,52,36,52,20,food,68,32,68,24,64,28,delivering,28,32,28,28,28,24")
// First Stage "walls,76,40,72,40,68,40,64,40,60,40,80,36,80,32,80,28,80,24,80,20,76,16,72,16,68,16,64,16,60,16,56,16,52,16,48,16,44,16,40,16,36,16,32,16,56,40,52,40,48,40,44,40,40,40,36,40,32,40,80,40,80,16,68,28,64,32,64,24,68,28,64,32,64,24,28,16,28,36,28,40,28,20,68,28,64,32,64,24,cooking,52,36,52,20,food,68,32,68,24,64,28,delivering,28,32,28,28,28,24"
//  "walls,,cooking,,food,56,24,56,20,delivering,56,16"
function SetUpLevel(Code){
  Code = String(Code)+ ","
  let whitchStation = 0
  for (let i=0;i < Code.length;){
    while (Code[i]!="," && i < Code.length){
      i++
    }
    i++
    if (Code[i]!=","){

      let dave = ["",""]
      Player.Wait[1] = 0
      for (;(!isNaN(Code[i]) || Code[i] == ",") && i < Code.length;i++){
        if (Code[i]=="," && Player.Wait[1] == 1){
          dave[0] = Number(dave[0])*10
          dave[1] = Number(dave[1])*10
          dave.push(40,whitchStation)
          if (whitchStation == 1){
            dave.push(0,0)
          } else if (whitchStation == 2) dave.push(0);
          stations[stations.giveNAME[whitchStation]].push(dave)
          dave = ["",""]
          Player.Wait[1] = 0
        } else if (Code[i] == "," && Player.Wait[1] == 0) {
          Player.Wait[1] = 1
        } else {
          dave[Player.Wait[1]] += Code[i]
        }
      }
    } else{
      i++
    }
    whitchStation++
    
  }

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
  rect(Player['x'],Player['y'],30,30)
  KEYS_DOWN["check"]()
  if (Player.devCreationTool.is_active) {
    for (let i = 0; i< 4; i++){
      UICordinates[i][4] = true
    }
    document.querySelector("#giveText").hidden = false
    } else {
      for (let i = 0; i< 4; i++){
        UICordinates[i][4] = false
      }
      document.querySelector("#giveText").hidden = true
    } 
    createLEVEL()
    for (let i = 0; i< stations["cooking"].length;i++){
      if (stations["cooking"][i][3] == 4 || stations["cooking"][i][3] == 5){
        if (stations["cooking"][i][5] > 1000) {
          stations["cooking"][i][3] = 6
        } else if (stations["cooking"][i][5] > 500){
          stations["cooking"][i][3] = 5;
        }
        stations["cooking"][i][5] += 1
      }
    }
    fill(195)
    circle(mouseX,mouseY,30)

}