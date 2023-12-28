import * as THREE from "three";
import { degToRad } from "./utils.js"
import { MyAxis } from "./objects/gui/MyAxis.js";
import { MyNurbsBuilder } from "./builders/MyNurbsBuilder.js";
import { MyCar } from "./objects/vehicle/MyCar.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Make sure to import GLTFLoader
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
    this.controlPtsOn = false;
    //this.reader = new MyReader(this.app,"track2")

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
    this.pointer = new THREE.Vector2()
    this.intersectedObj = null
    this.pickingColor = "0x00ff00"
    this.spritesheet = null

    // gamestate
    this.carMapping = {}
    this.myCar = null
    this.opponentCar = null
    this.turn = 1
    this.state = "MENU" // 1 if my car 2 if opponent car
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
      //this.app.scene.add(this.car)
    }

    
    if(this.scenery === null) {
      //this.scenery = new MyScenery(this.app, 100, 100)
      //this.app.scene.add(this.scenery)
    }

    if(this.hud === null) {
      this.hud = new MyHUD(this.app)
      this.app.scene.add(this.hud)
    }

    if(this.spritesheet === null) {
      this.spritesheet = new MySpriteSheet(15,8, "images/test2.png");
    }

    if(this.garage === null) {
      //this.garage = new MyGarage(this.app)
      //this.app.scene.add(this.garage)
      //this.initCars()
      //this.initCarSprites()
    }

    this.menu = new MyMenu(this.app)
    this.app.scene.add(this.menu)
    console.log(this.menu)

    //this.app.scene.add(new MyPowerUp(this.app))
    //this.app.scene.add(new MyOil(this.app))

  }

  setupEventListeners(){
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'w':
        case 'd':
        case 's':
        case 'a':
          this.car.updateKeyPressed(event.type, event.key)
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'w':
        case 'd':
        case 's':
        case 'a':
          this.car.updateKeyPressed(event.type, event.key)
          break;
      }
    });

    document.addEventListener("pointermove", this.onPointerMove.bind(this));
    document.addEventListener("click", this.onMouseClick.bind(this));

  }

  displayHelpers() {
    if (this.helpersOn) {

      if(!this.lights) return

      Object.keys(this.lights).forEach((key) => {
        let light = this.lights[key];
        let helper;

        switch (light.type) {
          case "PointLight":
            helper = new THREE.PointLightHelper(light);
            break;
          case "SpotLight":
            helper = new THREE.SpotLightHelper(light);
            break;
          case "DirectionalLight":
            helper = new THREE.DirectionalLightHelper(light);
            break;
        }

        this.app.scene.add(helper);
        this.helpers.push(helper);
      });
    } else {

      if(!this.helpers) return

      this.helpers.forEach((helper) => {
        this.app.scene.remove(helper);
        helper.dispose();
      });

      this.helpers = [];
    }
  }

  getControlPointsObjects(controlPoints) {
    let group = new THREE.Group();

    let sphereGeometry = new THREE.SphereGeometry(0.07, 20, 20);

    let colorOffset = 0x00;
    for (let i = 0; i < controlPoints.length; i++) {
      let row = controlPoints[i];
      let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000 + colorOffset,
      });

      for (let j = 0; j < row.length; j++) {
        let point = row[j];
        let controlPoint = new THREE.Mesh(sphereGeometry, sphereMaterial);
        controlPoint.position.set(...point);
        group.add(controlPoint);
      }
      colorOffset += 0x00ffff / controlPoints.length;
    }

    return group;
  }


  update() {
    this.car.update()
    this.hud.update()
    //this.updateSnow()
    //this.powerup.update
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

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

    var intersects = this.raycaster.intersectObjects(this.menu.pickableObjs);
    this.pickingHelper(intersects)

  }

  onMouseClick(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());
    var intersects = this.raycaster.intersectObjects(this.menu.pickableObjs);

    if (intersects.length > 0) {
        const obj = intersects[0].object
        this.handleClick(obj)
    }
  }

  handleClick(obj) {
    switch(this.state) {
      case "MENU":
        if(obj.parent.parent.name === "Black") {
          this.state = "GARAGE"
        }
        else {
          this.menu.handleClick(obj.parent.name)
        }
        break;
      
      case "GARAGE":
        obj = this.getAllObject(obj)
        this.chooseCar(obj)
        break;
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

  pickingHelper(intersects) {
    if (intersects.length > 0) {
        const obj = intersects[0].object
        this.changeObjectProperty(obj)
    } else {
        this.restoreObjectProperty()
    }
  }

  restoreObjectProperty() {
    if (this.lastPickedObj)
      this.objectPickingEffect(this.lastPickedObj, false)
    this.lastPickedObj = null;
  }

  getAllObject(obj) {
    var checkObjs = ["truck","sedan"]
    while(obj && !checkObjs.includes(obj.name)) {
      obj = obj.parent
    }

    return obj
  }

  changeObjectProperty(obj) {
    if(this.state === "MENU") {
      if (this.lastPickedObj != obj) {
        this.lastPickedObj = obj
        this.objectPickingEffect(obj, true)
      }
    }
    else {
      obj = this.getAllObject(obj)
      if (this.lastPickedObj != obj) {
        this.lastPickedObj = obj
        this.objectPickingEffect(obj, true)
      }
    }
  }

  objectPickingEffect(obj, isHover) {
    if(this.state === "MENU") {
      var value = isHover ? 1.15 : 1
      console.log(obj)
      if(obj.parent.parent.name === "Black") {
        this.menu.switchStart(isHover)
      }
      else {
        obj.scale.set(value,value,value)
      }
    }
    else {
      var value = isHover ? 0.2 : -0.2
      var mapping = {"truck": this.pickupSprite, "sedan": this.casualSprite}
      mapping[obj.name].translateY(value)
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
          this.app.scene.add(this.truck); 
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
          this.app.scene.add(this.sedan); 
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

    this.app.scene.add(this.pickupSprite,  this.casualSprite)
  }
}

export { MyContents };
