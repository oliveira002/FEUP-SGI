import * as THREE from "three";
import { degToRad } from "./utils.js"
import { MyAxis } from "./objects/gui/MyAxis.js";
import { MyNurbsBuilder } from "./builders/MyNurbsBuilder.js";
import { MyCar } from "./objects/vehicle/MyCar.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {MyScenery} from './objects/scenery/MyScenery.js'
import { MyShader } from "./MyShader.js";
import { MyHUD} from './objects/gui/MyHUD.js'
import { MyMenu} from './objects/gui/MyMenu.js'

import {MySnow} from './objects/scenery/MySnow.js'
import { MyPowerUp } from "./objects/track/MyPowerUp.js";
import { MyReader } from "./objects/track/MyReader.js";
import { MyFirework } from "./objects/single/MyFirework.js";
import { MyBanana } from "./objects/track/MyBanana.js";
import { MyOil } from "./objects/track/MyOil.js";
import { MyGarage } from "./objects/scenery/MyGarage.js";
import { MySpriteSheet } from "./objects/single/MySpriteSheet.js";
import { MyGame, State } from "./MyGame.js";
import { MyMainMenu } from "./objects/gui/menus/MyMainMenu.js";
import { MyObstaclesGarage } from "./objects/scenery/MyObstaclesGarage.js";
import { MyOpponent } from "./objects/vehicle/MyOpponent.js";
import { MyBillboard } from "./objects/scenery/MyBillboard.js";
import { MyCaution } from "./objects/track/MyCaution.js";
import {MyPodium} from "./objects/scenery/MyPodium.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
  /**
    constructs the object
    @param {MyApp} app The application object
  */
  constructor(app) {
    this.app = app;
    this.builder = new MyNurbsBuilder();
    this.helpersOn = false;
    this.reader = null
    //this.app.scene.add(this.reader)
    this.opponent = null

    // Globals
    this.axis = null;
    this.lights = null;
    this.helpers = null;
    this.materialMap = null;
    this.hud = null;

    // Objects
    this.car = null;
    this.scenery = null;
    this.garage = null;
    this.podium = null;
    this.obsGarage = null
    this.snow = []
    this.powerup = null;
    this.availableLayers = []
    this.pickableObjs = []

    // picking
    this.raycaster = new THREE.Raycaster()
    this.raycaster.near = 1
    this.raycaster.far = 20
    this.intersectedObj = null
    this.pickingColor = "0x00ff00"
    this.spritesheet = null

    // gamestate
    this.game = new MyGame();
    this.myCar = null
    this.opponentCar = null
    this.name = ""
    this.botDifficulty = null
    this.trackName = null
    this.track =  null
    this.clock = null
    this.pickedObs = null
    this.opponentStarted = false

    //this.app.scene.add(this.track);

  }

  /**
   * initializes the contents
   */
  init() {
  
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
    this.app.scene.add( ambientLight );

    this.setupEventListeners();

    if(this.axis === null) {
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    if(this.car === null){
      //this.car = new MyCar(this.app, "Car", null, "Nissan S15", this.reader.track)
      //this.app.scene.add(this.car)
    }
    
    if(this.opponent === null){
      //this.opponent = new MyOpponent(this.app, this.reader.keyPoints, this.reader.trackCurve, "Silvia")
    }

    if(this.scenery === null) {
      this.scenery = new MyScenery(this.app, 100, 100)
      this.scenery.translateY(-33)
      this.app.scene.add(this.scenery)
    }

    if(this.hud === null) {
      //this.hud = new MyHUD(this.app)
      //this.app.scene.add(this.hud)
    }

    if(this.spritesheet === null) {
      this.spritesheet = new MySpriteSheet(15,8, "images/test2.png");
    }

    //this.powerup = new MyPowerUp(this.app)
    //this.app.scene.add(this.powerup)

  
    this.menu = new MyMenu(this.app)
    this.menu.updateCameraByGameState(this.game.state)
    this.app.scene.add(this.menu)
    this.pickableObjs = this.menu.pickableObjs
    this.app.setActiveCamera('Menu')

    
    if(this.garage === null) {
      this.garage = new MyGarage(this.app)
      this.garage.translateX(this.menu.positionOffset + 120)
      this.garage.translateY(-10)
      this.garage.translateZ(-9)
      this.garage.rotateY(-Math.PI / 2)
      this.app.scene.add(this.garage)
    }

    
    if(this.obsGarage === null) {
      this.obsGarage = new MyObstaclesGarage(this.app)
      this.obsGarage.translateX(this.menu.positionOffset + 150)
      this.obsGarage.translateY(-10)
      this.obsGarage.translateZ(-9)
      this.obsGarage.rotateY(-Math.PI / 2)
      this.app.scene.add(this.obsGarage)
    }

    if(this.podium === null) {
     //this.podium = new MyPodium(this.app)
     //this.app.scene.add(this.podium)
    }
    
  
    //this.menu.mainMenu = new MyMainMenu(this.app)
    //this.menu.mainMenu.translateX(-200,0,0)
    //this.app.scene.add(this.menu.mainMenu)
    //this.pickableObjs = this.menu.mainMenu.pickableObjs

    //this.app.scene.add(new MyPowerUp(this.app))
    //this.app.scene.add(new MyOil(this.app))*/

    //console.log(this.reader)
    //this.app.scene.add(new MyOpponent(this.app, this.reader))

    //this.app.scene.add(new MyBillboard(this.app))
  }

  setupEventListeners(){

    function updateCarKeyPressed(event){
      if(this.game.state == State.PLAYING)
        switch (event.key) {
          case 'w':
            if(!this.opponentStarted) {
              this.opponent.startOpponent()
              this.opponentStarted = true
            }
          case 'd':
          case 's':
          case 'a':
          case ' ':
            this.car.updateKeyPressed(event.type, event.key)
            break;
          
          case 'Escape':
            if(event.type == 'keydown') {
              this.hud.stopTimer()
              this.reader.powerups.forEach(pu => {
                pu.stopTimer()
              })

              this.car.stopTimerEffects()
              this.game.state = State.PAUSED
              this.opponent.mixerPause = true
              this.menu.updateCameraByGameState(this.game.state)
              this.app.setActiveCamera('Menu')
            }
            break;
        }
      else if(this.game.state == State.PAUSED) {
        switch (event.key) {
            case 'w':
            case 'd':
            case 's':
            case 'a':
            case ' ':
              this.car.updateKeyPressed(event.type, event.key)
              break;

          case 'Escape':
            if(event.type == 'keydown') {
              this.hud.resumeTimer()
              this.reader.powerups.forEach(pu => {
                pu.resumeTimer()
              })

              this.car.resumeTimerEffects()
              this.game.state = State.PLAYING
              this.opponent.mixerPause = false
              this.app.setActiveCamera('Car')
            }
            break;
        }
      }
      else if(this.game.state == State.CHOOSE_OBSTACLE || this.game.state == State.PLACE_OBSTACLE) {
        switch (event.key) {
          case 'w':
          case 'd':
          case 's':
          case 'a':
          case ' ':
            this.car.updateKeyPressed(event.type, event.key)
            break;
      }}
    }

    function updatePlayerName(event) {
      if (this.game.state === State.NAME_MENU) {
        switch (event.key) {
          case 'Enter':
            this.game.state = State.CHOOSE_GAME_SETTINGS
            this.pickableObjs = this.menu.gameSettingsMenu.pickableObjs
            this.menu.updateCameraByGameState(this.game.state)
            break;
          
          case 'Backspace':
            this.name = this.name.slice(0, -1);
            this.menu.nameMenu.changeName(this.name)
            break;

          default:
            this.name = this.name.concat(event.key)
            this.menu.nameMenu.changeName(this.name)
        }
      }
    }

    function getIntersections(event){
      let pointer = new THREE.Vector2()
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(pointer, this.app.getActiveCamera());
      
      return this.raycaster.intersectObjects(this.pickableObjs);
    }

    function pointerRaycast(event) {
      var intersections = getIntersections.call(this, event)
      this.highlightPickedObject(intersections)
    }
  
    function mouseClickRaycast(event) {
      var intersections = getIntersections.call(this, event)

      if (intersections.length > 0) {
          this.handleClick(intersections[0])
      }
    }

    document.addEventListener('keydown', updateCarKeyPressed.bind(this));
    document.addEventListener('keyup', updateCarKeyPressed.bind(this));

    document.addEventListener('keydown', updatePlayerName.bind(this));

    document.addEventListener("pointermove", pointerRaycast.bind(this));
    document.addEventListener("click", mouseClickRaycast.bind(this));

  }

  update() {
    switch(this.game.state) {

      case State.CHOOSE_GAME_SETTINGS:
        this.menu.gameSettingsMenu.update()
        break;
      case State.NAME_MENU:
        this.menu.nameMenu.update()
        break;
      case State.PAUSED:
        this.menu.pauseMenu.update()
        if(this.opponent) {
          this.opponent.update()
        }
        break;
      case State.PLAYING:
        if(this.car) {
          this.car.update()
          this.car.checkCollisions(this.reader.powerups)
        }
        if(this.opponent) {
          this.opponent.update()
        }
        if(this.reader){
          this.reader.update()
        }
        //this.updateSnow()
        break;
        case State.CHOOSE_OBSTACLE:
          if(this.opponent) {
            this.opponent.update()
          }
          if(this.reader){
            this.reader.update()
          }
          this.car.updateEffects()
          break;
        case State.PLACE_OBSTACLE:
          if(this.opponent) {
            this.opponent.update()
          }
          if(this.reader){
            this.reader.update()
          }
          this.car.updateEffects()
          break;
        
        case State.END:
          if(this.podium) {
            this.podium.update()
          }
    }
    
    if(this.hud) {
      this.hud.update(this.game.state)
    }

    //this.powerup.update()
  }

  updateSnow(){
    if(Math.random()  < 0.05 ) {
      var mesh = new MySnow(this.app,this);
      this.app.scene.add(mesh);
      this.snow.push(mesh);
    }

    for (var i = 0; i < this.snow.length; i++) {
        this.snow[i].update();
    }
  }

  highlightPickedObject(intersections) {
    if (intersections.length > 0) {
        const obj = intersections[0].object
        this.changeObjectProperty(obj)
    } else {
        this.restoreObjectProperty()
    }
  }

  handleClick(intersections) {
    var obj = intersections.object
    this.lastPickedObj = null
    switch(this.game.state) {
      case State.MAIN_MENU: {
        this.game.state = State.NAME_MENU
        this.menu.updateCameraByGameState(this.game.state)
        this.pickableObjs = this.menu.nameMenu.pickableObjs
        break;
      }
      case State.CHOOSE_GAME_SETTINGS: {
        if(obj.parent.parent.name === "Black") {
          this.game.state = State.CHOOSE_CAR_PLAYER
          this.app.setActiveCamera('Garage')
          this.pickableObjs = this.garage.pickableObjs

          const num_track = this.menu.gameSettingsMenu.activeTrack.name
          const bot_difficulty = this.menu.gameSettingsMenu.activeDifficulty.name
          this.botDifficulty = bot_difficulty

          this.reader = new MyReader(this.app, num_track)
          this.app.scene.add(this.reader)
          this.track = this.reader.track

        }
        else {
          this.menu.gameSettingsMenu.handleClick(obj.parent.name)
        }
        break;
      }
      case State.CHOOSE_CAR_PLAYER: {
        obj = this.getObjectParent(obj)
        this.garage.removeCarPickable(this.garage.carMapping[obj.name])
        this.car = new MyCar(this.app,"Car",null,obj.name,this.track)
        this.app.scene.add(this.car)
        this.game.state = State.CHOOSE_CAR_OPP
        break;
      }
      case State.CHOOSE_CAR_OPP: {
        obj = this.getObjectParent(obj)
        this.opponentCar = this.garage.carMapping[obj.name]
        this.opponent = new MyOpponent(this.app,this.reader.keyPoints,this.reader.trackCurve, obj.name)
        this.app.scene.add(this.opponent)

        this.game.state = State.PLAYING
        this.hud = new MyHUD(this.app)
        this.app.scene.remove(this.garage, this.obsGarage)
        this.pickableObjs = []
        this.app.setActiveCamera('Car')
        this.hud.startTimer()
        this.app.scene.add(this.hud)
        
        break;
      }

      case State.CHOOSE_OBSTACLE: {
        obj = this.getObjectParent(obj)
        this.objectPickingEffect(obj, false)
        this.selectedObstacle = this.obsGarage.obsMapping[obj.name]

        this.createObstacle(obj.name)

        this.pickableObjs = [this.reader.track]
        this.game.state = State.PLACE_OBSTACLE
        break;
      }

      case State.PLACE_OBSTACLE: {
        const coords = intersections.point 
        this.pickedObs.position.set(...coords)
        this.app.scene.add(this.pickedObs)

        this.pickableObjs = []
        this.hud.resumeTimer()
        this.game.state = State.PLAYING
        this.opponent.mixerPause = false
        this.app.setActiveCamera('Car')

        this.reader.powerups.forEach(pu => {
          pu.resumeTimer()
        })

        this.car.resumeTimerEffects()
        break;
      }

    }
  }

  createObstacle(name) {
    switch(name){
      case "Banana":
        this.pickedObs = new MyBanana(this.app)
        break;
      
      case "Oil":
        this.pickedObs = new MyOil(this.app)
        break;

      case "Caution":
        this.pickedObs = new MyCaution(this.app, 0.8, 0.14, 1.6)
        break;
    }
  }

  restoreObjectProperty() {
    if (this.lastPickedObj)
      this.objectPickingEffect(this.lastPickedObj, false)
    this.lastPickedObj = null;
  }

  getObjectParent(obj) {
    switch(this.game.state) {
      case(State.CHOOSE_CAR_PLAYER):
      case(State.CHOOSE_CAR_OPP):
        while(obj && !this.garage.checkObjs.includes(obj.name)) {
          obj = obj.parent
        }
        break;
      
      case(State.CHOOSE_OBSTACLE):
        while(obj && !this.obsGarage.checkObjs.includes(obj.name)) {
          obj = obj.parent
        }
        break;
    }
    return obj
  }

  changeObjectProperty(obj) {
    switch(this.game.state){
      case State.MAIN_MENU:
      case State.NAME_MENU:
      case State.CHOOSE_GAME_SETTINGS: {
        break;
      }
      case State.CHOOSE_OBSTACLE: {
        obj = this.getObjectParent(obj)
        break;
      }
      default: {
        obj = this.getObjectParent(obj)
        break
      }
    }

    if(this.lastPickedObj != obj) {
      this.lastPickedObj = obj
      this.objectPickingEffect(obj, true)
    }
  }

  objectPickingEffect(obj, isHover) {
    switch(this.game.state){
      case State.MAIN_MENU: {
        this.menu.mainMenu.switchStart(isHover)
        break;
      }
      case State.NAME_MENU: {
        break;
      }
      case State.CHOOSE_GAME_SETTINGS: {
        var value = isHover ? 1.15 : 1
        if(obj.parent.parent.name === "Black") {
          this.menu.gameSettingsMenu.switchStart(isHover)
        }
        else {
          obj.scale.set(value,value,value)
        }
        break;
      }
      case State.CHOOSE_CAR_PLAYER: {
        var value = isHover ? 0.2 : -0.2
        this.garage.spriteMapping[obj.name].translateY(value)
        break;
      }
      case State.CHOOSE_CAR_OPP: {
        var value = isHover ? 0.2 : -0.2
        this.garage.spriteMapping[obj.name].translateY(value)
        break;
      }
      case State.CHOOSE_OBSTACLE: {
        var value = isHover ? 0.2 : -0.2
        this.obsGarage.spriteMapping[obj.name].translateY(value)
        break;
      }
      default: {}
    }
  }
}

export { MyContents };
