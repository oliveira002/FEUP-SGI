import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyBulb } from './MyBulb.js';




class MyLamp extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {boolean} isTurnedOn whether the light bulb inside the lamp is turned on or not. Default `false`
     * @param {number} pieceRadius the radius of the top and bottom lamp supports. Default is `0.1`
     * @param {number} lampHeight the total height of the lamp. Default is `2`
     * @param {number} diffuseLampColor the diffuse component of the lamp's color. Default `#F0E5D8`
     * @param {number} specularLampColor the specular component of the lamps's color. Default `#777777`
     * @param {number} lampShininess the shininess component of the lamp's color. Default `10`
     */
    constructor(app, isTurnedOn, pieceRadius, lampHeight, diffuseLampColor, specularLampColor, lampShininess) {
        super();
        this.app = app;
        this.isTurnedOn = isTurnedOn || false
        this.type = 'Group';
        this.pieceRadius = pieceRadius || 0.1
        this.lampHeight = lampHeight || 2
        this.bottomPieceHeight = this.lampHeight*0.1
        this.topPieceHeight = this.lampHeight*0.1
        this.wireLength = this.lampHeight*0.5
        this.bulbCoverHeight = this.lampHeight*0.3
        this.bulbRadius = 0.1
        this.bulbHeight = this.bulbRadius*3
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
        let bot_piece = new THREE.CylinderGeometry(this.pieceRadius * 0.7,this.pieceRadius,this.lampHeight * 0.1)
        let bulbCover  = new THREE.LatheGeometry(points)

        // bulb cover
        this.bulbCoverMesh = new THREE.Mesh(bulbCover,this.lampMaterial)
        this.bulbCoverMesh.material.side = THREE.DoubleSide
        this.bulbCoverMesh.translateY(0.472) // there's no way to calculate a lathe's height afaik, which means we have to translate it until it seems right. This also means the lampHeight is not guaranteed.
        this.bulbCoverMesh.rotateX(Math.PI)
        this.bulbCoverMesh.scale.set(0.014,0.014,0.014)
        this.add(this.bulbCoverMesh)

        // bottom cylinder
        this.bottomPieceMesh = new THREE.Mesh(bot_piece, this.lampMaterial)
        this.bottomPieceMesh.translateY(this.bulbCoverHeight + this.bottomPieceHeight / 2)
        this.add( this.bottomPieceMesh);

        // wire
        this.wireMesh = new THREE.Mesh(wire, this.lampMaterial)
        this.wireMesh.translateY(this.bulbCoverHeight + this.bottomPieceHeight + this.wireLength / 2)
        this.add( this.wireMesh);

        // top cylinder
        this.topPieceMesh = new THREE.Mesh(top_piece, this.lampMaterial)
        this.topPieceMesh.translateY(this.bulbCoverHeight + this.bottomPieceHeight + this.wireLength + this.topPieceHeight / 2)
        this.add( this.topPieceMesh);


        this.bulb = new MyBulb(this, this.isTurnedOn)
        this.bulb.translateY(-(this.bulbHeight/2 + 0.375))
        this.add(this.bulb)
        

        this.translateY(-this.lampHeight/2);
    }
}

MyLamp.prototype.isGroup = true;

export { MyLamp };