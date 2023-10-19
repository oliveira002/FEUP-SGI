import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { Line2 } from 'three/addons/lines/Line2.js';

/**
 * This class contains spring representation
 */
class MySpring extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     * @param {number} radius spring radius
     * @param {number} height spring height
     * @param {number} coilsNumber spring amount of coils
     */
    constructor(app, radius, height, coilsNumber) {

        super();
        this.app = app;
        this.type = 'Group';

        this.radius = radius || 0.06
        this.height = height || 0.5
        this.coilsNumber = coilsNumber || 10

        this.spring = null
        this.numberOfSamples = 200
        this.springTexturePath = "textures/spring.png"

        this.recompute()
    }

    initSpring(){
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
        this.springCurveGeometry = new THREE.TubeGeometry( curve, this.numberOfSamples, 0.007, this.numberOfSamples, false );
        if(this.springTexturePath){
            this.springTexture = new THREE.TextureLoader().load(this.springTexturePath);
            this.springTexture.wrapS = THREE.RepeatWrapping;
            this.springTexture.wrapT = THREE.RepeatWrapping;
        }
        this.springLineMaterial = new THREE.LineBasicMaterial( { map: this.springTexture, side:THREE.DoubleSide } )
        this.spring = new THREE.Mesh( this.springCurveGeometry, this.springLineMaterial )
        this.add(this.spring); 

        this.children.forEach(element => {
            element.castShadow = true
            //element.receiveShadow = true
        });
    }

    recompute() {
        if (this.spring !== null) 
          this.app.scene.remove(this.spring);
        this.initSpring();
    }
    
}

MySpring.prototype.isGroup = true;

export { MySpring };