import * as THREE from "three";
import { degToRad } from "./utils.js"
import { MyAxis } from "./objects/gui/MyAxis.js";
import { MyNurbsBuilder } from "./builders/MyNurbsBuilder.js";
import { MyCar } from "./objects/vehicle/MyCar.js";
import {MyScenery} from './objects/scenery/MyScenery.js'
import { MyShader } from "./MyShader.js";
import { MyHUD} from './objects/gui/MyHUD.js'
import {MySnow} from './objects/scenery/MySnow.js'
import { MyPowerUp } from "./objects/track/MyPowerUp.js";
import { MyReader } from "./objects/track/MyReader.js";
import { MyFirework } from "./objects/single/MyFirework.js";
import { MyBanana } from "./objects/track/MyBanana.js";

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
    this.reader = new MyReader(this.app,"track2")

    // Globals
    this.axis = null;
    this.lights = null;
    this.helpers = null;
    this.materialMap = null;
    this.hud = null;

    // Objects
    this.car = null;
    this.scenery = null;
    this.snow = []
    this.powerup = null;
    this.track = this.reader.track
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
      this.app.scene.add(this.car)
    }

    
    if(this.scenery === null) {
      this.scenery = new MyScenery(this.app, 100, 100)
      //this.app.scene.add(this.scenery)
    }

    if(this.hud === null) {
      this.hud = new MyHUD(this.app)
      this.app.scene.add(this.hud)
    }
    
    //this.app.scene.add(new MyPowerUp(this.app))
    this.app.scene.add(new MyBanana(this.app))

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
}

export { MyContents };
