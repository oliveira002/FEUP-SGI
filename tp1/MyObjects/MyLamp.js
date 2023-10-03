import * as THREE from 'three';
import { MyApp } from '../MyApp.js';




class MyLamp extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, pieceRadius, lampHeight, bulbRadius, diffuseLampColor, specularLampColor, lampShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.pieceRadius = pieceRadius || 1
        this.lampHeight = lampHeight || 1
        this.bulbRadius = bulbRadius || 1
        this.diffuseLampColor = diffuseLampColor || "#F0E5D8"
        this.specularLampColor = specularLampColor || "#777777"
        this.lampShininess = lampShininess || 10

        this.lampMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseLampColor, 
            specular: this.specularLampColor, emissive: "#000000", shininess: this.lampShininess })
        
        // points
        const points = [];
        for ( let i = 0; i < 10; i ++ ) {
            points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
        }
    
        let top_piece = new THREE.CylinderGeometry(this.pieceRadius,this.pieceRadius * 0.7,this.lampHeight * 0.1)
        let wire = new THREE.CylinderGeometry(this.pieceRadius * 0.2,this.pieceRadius * 0.2,this.lampHeight * 0.5)
        let sec_piece = new THREE.CylinderGeometry(this.pieceRadius * 0.7,this.pieceRadius,this.lampHeight * 0.1)
        let bulb  = new THREE.LatheGeometry(points)

        // top cylinder
        this.bottomPiece = new THREE.Mesh(sec_piece, this.lampMaterial)
        this.bottomPiece.translateY(this.lampHeight * 0.1 / 2)
        this.add( this.bottomPiece);

        // wire
        this.cable = new THREE.Mesh(wire, this.lampMaterial)
        this.cable.translateY(this.lampHeight * 0.5 / 2)
        this.add( this.cable);

        // top cylinder
        this.topPiece = new THREE.Mesh(top_piece, this.lampMaterial)
        this.topPiece.translateY(this.lampHeight * 0.9 / 2)
        this.add( this.topPiece);

        // bottom
        this.lightBulb = new THREE.Mesh(bulb,this.lampMaterial)
        this.lightBulb.rotateX(Math.PI)
        this.lightBulb.scale.set(0.014,0.014,0.014)
        this.lightBulb.translateY(this.lampHeight * 0.3 / 4.4)
        this.add(this.lightBulb)

        this.translateY(-this.lampHeight * 0.35 / 2);
    }
}

MyLamp.prototype.isGroup = true;

export { MyLamp };