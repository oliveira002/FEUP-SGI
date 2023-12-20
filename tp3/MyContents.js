import * as THREE from "three";
import { degToRad } from "./utils.js"
import { MyAxis } from "./objects/gui/MyAxis.js";
import { MyNurbsBuilder } from "./builders/MyNurbsBuilder.js";
import { MyCar } from "./objects/vehicle/MyCar.js";

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

    // Globals
    this.axis = null;
    this.lights = null;
    this.helpers = null;
    this.materialMap = null;

    // Objects
    this.floor = null;
    this.car = null;
  }

  /**
   * initializes the contents
   */
  init() {

    this.setupEventListeners();

    if(this.axis === null) {
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    if(this.floor === null){
      let geo = new THREE.PlaneGeometry(100, 100)
      let mat = new THREE.MeshBasicMaterial({
        color: 0xaa0000
      })

      this.floor = new THREE.Mesh(geo, mat)
      this.floor.rotateX(degToRad(-90))

      this.app.scene.add(this.floor)
    }

    if(this.car === null){
      this.car = new MyCar()
      this.app.scene.add(this.car)
    }

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
  }
}

export { MyContents };
