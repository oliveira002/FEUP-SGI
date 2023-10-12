import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

/**
 * This class contains the vase representation
 */
class MyVase extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     */
    constructor(app) {

        super();
        this.app = app;
        this.type = 'Group';

        this.bottom = null
        this.top = null
        this.vaseTexturePath = "textures/spring.png"

        this.recompute()
    }

    initVaseBottom(){
        let points = []

        let coilPoints = 20;
        let curHeight = -this.height/2;
        let heightDelta = this.height / this.coilsNumber / coilPoints;

        for(let i = 0; i <= this.coilsNumber*2*Math.PI; i+= 2*Math.PI/coilPoints){
            points.push(new THREE.Vector3(this.radius * Math.cos(i), this.radius * Math.sin(i), curHeight));
            curHeight += heightDelta;
        }

        let curve = new THREE.CatmullRomCurve3(points)
        let sampledPoints = curve.getPoints(this.numberOfSamples);
        
        this.springCurveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
        if(this.springTexturePath){
            this.springTexture = new THREE.TextureLoader().load(this.springTexturePath);
            this.springTexture.wrapS = THREE.RepeatWrapping;
            this.springTexture.wrapT = THREE.RepeatWrapping;
        }
        this.springLineMaterial = new THREE.LineBasicMaterial( { linewidth: 100, map: this.springTexture,  } )
        this.spring = new THREE.Line( this.springCurveGeometry, this.springLineMaterial )
        this.add(this.spring); 
    }

    initVaseTop(){
        
    }

    recompute() {
        if (this.bottom !== null) 
          this.app.scene.remove(this.bottom);
        this.initVaseBottom();

        if (this.top !== null) 
          this.app.scene.remove(this.top);
        this.initVaseTop();
    }
    
}

MySpring.prototype.isGroup = true;

export { MySpring };