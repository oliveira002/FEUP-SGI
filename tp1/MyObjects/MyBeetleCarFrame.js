import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';

/**
 * This class contains walls representation for a square floor
 */
class MyBeetleCarFrame extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     * @param {number} frameWidth 
     * @param {number} frameLength 
     * @param {number} frameDepth 
     * @param {string} frameTexturePath 
     * @param {number} frameHorizontalPieceWidth 
     * @param {number} frameHorizontalPieceLength 
     * @param {number} frameVerticalPieceWidth 
     * @param {number} frameVerticalPieceLength 
     */
    constructor(app, frameWidth, frameLength, frameDepth, frameTexturePath, frameHorizontalPieceWidth, frameHorizontalPieceLength, 
      frameVerticalPieceWidth, frameVerticalPieceLength) {

        super();
        this.app = app;
        this.type = 'Group';

        this.frameWidth = frameWidth || 1
        this.frameLength = frameLength || 1
        this.frameDepth = frameDepth || 0.1
        this.frameTexturePath = frameTexturePath
        this.horizontalPieceWidth = frameHorizontalPieceWidth || this.frameWidth/10
        this.horizontalPieceLength = frameHorizontalPieceLength || 9*this.frameLength/10 
        this.verticalPieceWidth = frameVerticalPieceWidth || this.frameLength/10
        this.verticalPieceLength = frameVerticalPieceLength || 9*this.frameWidth/10

        this.carRadius = 0.9 * Math.min(this.frameWidth, this.frameLength) - 2 * Math.min(this.horizontalPieceWidth, this.verticalPieceLength)

        this.carColor = 0xFF0000
        this.beetleTrunk = null
        this.beetleWindshield = null
        this.beetleHood = null
        this.beetleFenderLeft = null
        this.beetleFenderRight = null
        this.beetleWheelLeft = null
        this.beetleWheelRight = null
        this.beetleBottom = null
        this.numberOfSamples = 20
      
        this.frame = new MyPortrait(app, this.frameWidth, this.frameLength, this.frameDepth, this.frameTexturePath)
        this.add(this.frame)

        this.recompute()
    }

    initTrunk(){
        this.trunkRadius = 8 * this.carRadius / 16
        let points = []

        for(let i = Math.PI/2; i<= Math.PI; i+= Math.PI/2/10){
            points.push(new THREE.Vector3(this.trunkRadius*Math.cos(i), this.trunkRadius*Math.sin(i), -(this.frameDepth/2)+0.01))
        }

        let position = new THREE.Vector3(0,0,0)
        let curve = new THREE.CatmullRomCurve3(points)
        let sampledPoints = curve.getPoints(this.numberOfSamples);
        
        this.trunkCurveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.trunkLineMaterial = new THREE.LineBasicMaterial( { color: this.carColor } )
        this.beetleTrunk = new THREE.Line( this.trunkCurveGeometry, this.trunkLineMaterial )
        this.beetleTrunk.position.set(...position)
        
        this.add(this.beetleTrunk);
    }

    initWindshield(){
        this.windshieldRadius = 4 * this.carRadius / 16
        let points = []

        for(let i = 0; i<= Math.PI/2; i+= Math.PI/2/10){
            points.push(new THREE.Vector3(this.windshieldRadius*Math.cos(i), this.windshieldRadius*Math.sin(i), -(this.frameDepth/2)+0.01))
        }

        let position = new THREE.Vector3(0,this.trunkRadius/2,0)
        let curve = new THREE.CatmullRomCurve3(points)
        let sampledPoints = curve.getPoints(this.numberOfSamples);
        
        this.windshieldCurveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        this.windshieldLineMaterial = new THREE.LineBasicMaterial( { color: this.carColor } )
        this.beetleWindshield = new THREE.Line( this.windshieldCurveGeometry, this.windshieldLineMaterial )
        this.beetleWindshield.position.set(...position)
        
        this.add(this.beetleWindshield);
    }

    initHood(){

      let position = new THREE.Vector3(this.windshieldRadius,0,0)

      this.beetleHood = new THREE.Line( this.windshieldCurveGeometry, this.windshieldLineMaterial )
      this.beetleHood.position.set(...position)

      this.add(this.beetleHood)

    }

    initFenders(){
      this.fenderRadius = 3 * this.carRadius / 16
      let points = []

      for(let i = 0; i<= Math.PI; i+= Math.PI/20){
        points.push(new THREE.Vector3(this.fenderRadius*Math.cos(i), this.fenderRadius*Math.sin(i), -(this.frameDepth/2)+0.01))
      }

      let positionL = new THREE.Vector3(-(this.trunkRadius - this.fenderRadius),0,0)
      let positionR = new THREE.Vector3(this.trunkRadius - this.fenderRadius,0,0)
      let curve = new THREE.CatmullRomCurve3(points)
      let sampledPoints = curve.getPoints(this.numberOfSamples);

      this.wheelCurveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
      this.wheelLineMaterial = new THREE.LineBasicMaterial( { color: this.carColor } )
      
      this.beetleFenderLeft = new THREE.Line( this.wheelCurveGeometry, this.wheelLineMaterial )
      this.beetleFenderLeft.position.set(...positionL)
      this.add(this.beetleFenderLeft)

      this.beetleFenderRight = new THREE.Line( this.wheelCurveGeometry, this.wheelLineMaterial )
      this.beetleFenderRight.position.set(...positionR)
      this.add(this.beetleFenderRight)

    }

    initWheels(){
      this.wheelRadius = 2 * this.carRadius / 16
      let points = []

      for(let i = 0; i<= 2*Math.PI; i+= Math.PI/20){
        points.push(new THREE.Vector3(this.wheelRadius*Math.cos(i), this.wheelRadius*Math.sin(i), -(this.frameDepth/2)+0.01))
      }

      let positionL = new THREE.Vector3(-(this.trunkRadius - this.fenderRadius),0,0)
      let positionR = new THREE.Vector3(this.trunkRadius - this.fenderRadius,0,0)
      let curve = new THREE.CatmullRomCurve3(points)
      let sampledPoints = curve.getPoints(this.numberOfSamples);

      this.wheelCurveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
      this.wheelLineMaterial = new THREE.LineBasicMaterial( { color: this.carColor } )
      
      this.beetleWheelLeft = new THREE.Line( this.wheelCurveGeometry, this.wheelLineMaterial )
      this.beetleWheelLeft.position.set(...positionL)
      this.add(this.beetleWheelLeft)

      this.beetleWheelRight = new THREE.Line( this.wheelCurveGeometry, this.wheelLineMaterial )
      this.beetleWheelRight.position.set(...positionR)
      this.add(this.beetleWheelRight)
    }

    initBottom(){
      let points = [
        new THREE.Vector3(-2 * this.carRadius / 16, 0, -(this.frameDepth/2)+0.01),
        new THREE.Vector3(2 * this.carRadius / 16, 0, -(this.frameDepth/2)+0.01),
      ];

      let position = new THREE.Vector3(0, 0, 0)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      this.beetleBottom = new THREE.Line(geometry,new THREE.LineBasicMaterial({ color: 0xff0000 }));
      this.beetleBottom.position.set(...position)
      this.add(this.beetleBottom)
    }

    recompute() {
        if (this.beetleTrunk !== null) 
          this.app.scene.remove(this.beetleTrunk);
        this.initTrunk();
    
        if (this.beetleWindshield !== null)
          this.app.scene.remove(this.beetleWindshield)
        this.initWindshield()
    
        if (this.beetleHood !== null)
          this.app.scene.remove(this.beetleHood)
        this.initHood()
    
        if(this.beetleFenderLeft !== null)
          this.app.scene.remove(this.beetleFenderLeft)

        if(this.beetleFenderRight !== null)
          this.app.scene.remove(this.beetleFenderRight)
        this.initFenders()

        if(this.beetleWheelLeft !== null)
        this.app.scene.remove(this.beetleWheelLeft)

        if(this.beetleWheelRight !== null)
          this.app.scene.remove(this.beetleWheelRight)
        this.initWheels()

        if(this.beetleBottom !== null)
          this.app.scene.remove(this.beetleBottom)
        this.initBottom()

        let car_parts = [
          this.beetleTrunk, 
          this.beetleWindshield, 
          this.beetleHood, 
          this.beetleFenderLeft,
          this.beetleFenderRight,
          this.beetleWheelLeft,
          this.beetleWheelRight,
          this.beetleBottom
        ]

        car_parts.forEach(part => {
          part.translateY(this.wheelRadius)
          part.translateY(-(this.trunkRadius+this.wheelRadius)/2)
        });

    }
    
}

MyBeetleCarFrame.prototype.isGroup = true;

export { MyBeetleCarFrame };