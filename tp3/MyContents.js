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
    //this.reader = new MyReader(this.app,"Portimão")

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
    this.carMapping = {}
    this.myCar = null
    this.opponentCar = null
    this.turn = 1
    //this.track = this.reader.track
    //this.app.scene.add(this.track);

  }

  /**
   * initializes the contents
   */
  init() {
  
    const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
    this.app.scene.add( ambientLight );

    this.setupEventListeners();

    if(this.axis === null) {
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    if(this.car === null){
      this.car = new MyCar(this.app, "Car")
      this.car.scale.set(0.05, 0.05, 0.05)
      this.app.scene.add(this.car)
    }
    
    if(this.scenery === null) {
      this.scenery = new MyScenery(this.app, 100, 100)
      this.scenery.translateY(-33)
      //this.app.scene.add(this.scenery)
    }

    if(this.hud === null) {
      this.hud = new MyHUD(this.app)
      this.app.scene.add(this.hud)
    }

    if(this.spritesheet === null) {
      this.spritesheet = new MySpriteSheet(15,8, "images/test2.png");
    }

    /*
    if(this.garage === null) {
      this.garageGroup = new THREE.Group()
      this.garage = new MyGarage(this.app)
      this.garageGroup.add(this.garage)
      this.initCars()
      this.initCarSprites()
      this.garageGroup.translateX(-500)
      this.app.scene.add(this.garageGroup)
    }*/

    this.menu = new MyMenu(this.app)
    //this.menu.translateX(500,0,0)
    this.app.scene.add(this.menu)
    this.pickableObjs = this.menu.pickableObjs
    this.app.setActiveCamera('Menu')

    //this.menu.mainMenu = new MyMainMenu(this.app)
    //this.menu.mainMenu.translateX(-200,0,0)
    //this.app.scene.add(this.menu.mainMenu)
    //this.pickableObjs = this.menu.mainMenu.pickableObjs

    //this.app.scene.add(new MyPowerUp(this.app))
    //this.app.scene.add(new MyOil(this.app))

  }

  setupEventListeners(){

    function updateCarKeyPressed(event){
      if(this.game.state == State.PLAYING)
        switch (event.key) {
          case 'w':
          case 'd':
          case 's':
          case 'a':
            this.car.updateKeyPressed(event.type, event.key)
            break;
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
          const obj = intersections[0].object
          this.handleClick(obj)
      }
    }

    document.addEventListener('keydown', updateCarKeyPressed.bind(this));
    document.addEventListener('keyup', updateCarKeyPressed.bind(this));

    document.addEventListener("pointermove", pointerRaycast.bind(this));
    document.addEventListener("click", mouseClickRaycast.bind(this));

  }

  update() {
    this.car.update()
    this.hud.update()
    //this.updateSnow()
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

  handleClick(obj) {
    switch(this.game.state) {
      case State.MAIN_MENU: {
        this.lastPickedObj = null
        this.game.state = State.CHOOSE_GAME_SETTINGS
        this.menu.updateCameraByGameState(this.game.state)
        this.pickableObjs = this.menu.gameSettingsMenu.pickableObjs
        break;
      }
      case State.CHOOSE_GAME_SETTINGS: {
        if(obj.parent.parent.name === "Black") {
          this.game.state = State.CHOOSE_CAR_PLAYER
        }
        else {
          this.menu.gameSettingsMenu.handleClick(obj.parent.name)
        }
        break;
      }
      case State.CHOOSE_CAR_PLAYER: {
        obj = this.getObjectParent(obj)
        this.chooseCar(obj)
        break;
      }
    }
  }

  chooseCar(obj) {
    if(this.turn === 1) {
      this.myCar = this.carMapping[obj.name]
      console.log(this.myCar)
      this.turn += 1
    }
    else if(this.turn === 2) {
      this.opponentCar = this.carMapping[obj.name]
      console.log(this.opponentCar)
      this.turn += 1
    }
  }

  restoreObjectProperty() {
    if (this.lastPickedObj)
      this.objectPickingEffect(this.lastPickedObj, false)
    this.lastPickedObj = null;
  }

  getObjectParent(obj) {
    var checkObjs = ["truck","sedan"]
    while(obj && !checkObjs.includes(obj.name)) {
      obj = obj.parent
    }

    return obj
  }

  changeObjectProperty(obj) {
    switch(this.game.state){
      case State.MAIN_MENU:
      case State.CHOOSE_GAME_SETTINGS: {
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
        var mapping = {"truck": this.pickupSprite, "sedan": this.casualSprite}
        mapping[obj.name].translateY(value)
        break;
      }
      default: {}
    }
  }


  initCars() {

    const loader = new GLTFLoader();

    loader.load(
      'images/pickup_truck.glb',
      (gltf) => {
          this.truck = gltf.scene
          this.truck.scale.set(1.25,1.25,1.25)
          this.truck.rotateY(Math.PI / 2.15)
          this.truck.translateX(3.5)
          this.truck.translateZ(1)
          this.truck.name = "truck"
          this.garageGroup.add(this.truck); 
          this.pickableObjs.push(this.truck)
          this.carMapping["truck"] = this.truck

      },
      (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
          console.log('An error happened', error);
      }
  );

    loader.load(
      'images/low-poly_sedan_car.glb',
      (gltf) => {
          this.sedan = gltf.scene
          this.sedan.scale.set(0.55,0.55,0.55)
          this.sedan.rotateY(Math.PI / 1.9)
          this.sedan.translateX(-3.5)
          this.sedan.translateZ(2)
          this.sedan.name = "sedan"
          this.garageGroup.add(this.sedan); 
          this.pickableObjs.push(this.sedan)
          this.carMapping["sedan"] = this.sedan
      },
      (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
          console.log('An error happened', error);
      }
    );
  }

  initCarSprites() {
    this.pickupSprite = this.spritesheet.createTextGroup("Truck");
    this.pickupSprite.translateY(2.6)
    this.pickupSprite.translateZ(-2.9)
    this.pickupSprite.translateX(2.5)
    this.pickupSprite.rotateY(Math.PI / 2)

    this.casualSprite = this.spritesheet.createTextGroup("Sedan")
    this.casualSprite.translateY(3)
    this.casualSprite.translateZ(3.6)
    this.casualSprite.translateX(2.5)
    this.casualSprite.rotateY(Math.PI / 2)

    this.garageGroup.add(this.pickupSprite,  this.casualSprite)
  }
}

export { MyContents };
