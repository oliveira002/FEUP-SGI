import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';

class MyWindow extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} windowWidth the width of the window in relation to the Y axis. Default `1`
     * @param {number} windowLength the length of the window in relation to the X axis. Default `1`
     * @param {number} windowDepth the depth of the window in relation to the Z axis. Default `0.1`
     * @param {string} landscapeTexturePath the path of the texture to be used as a landscape. Default `undefined`
     * @param {number} horizontalPieceWidth the width of the horizontal part of the portrait's frame. Default `portraitWidth/10`
     * @param {number} horizontalPieceLength the length of the horizontal part of the portrait's frame. Default `9*portraitLength/10`
     * @param {number} verticalPieceWidth the width of the vertical part of the portrait's frame. Default `portraitLength/10`
     * @param {number} verticalPieceLength the length of the vertical part of the portrait's frame. Default `9*portraitWidth/10`
     * @param {number} diffuseFrameColor the diffuse component of the portrait's color. Default `#331800`
     * @param {number} specularFrameColor the specular component of the portrait's color. Default `#777777`
     * @param {number} frameShininess the shininess component of the portrait's color. Default `10`
     */
    constructor(app, width, height, depth, frameTexturePath, outsideTexturePath, diffuseFrameColor, specularFrameColor, frameShininess) {

        super();
        this.app = app;
        this.type = 'Group';
        this.width = width || 2
        this.height = height || 3
        this.depth = depth || 0.1
        this.frameTexturePath = frameTexturePath
        this.diffuseFrameColor = diffuseFrameColor || "#331800"
        this.specularFrameColor = specularFrameColor || "#777777"
        this.frameShininess = frameShininess || 10
        this.outsideTexturePath = outsideTexturePath
        
        if(this.outsideTexturePath){
            this.outsideTexture = new THREE.TextureLoader().load(this.outsideTexturePath);
            this.outsideTexture.wrapS = THREE.RepeatWrapping;
            this.outsideTexture.wrapT = THREE.RepeatWrapping;
        }

        if(this.frameTexturePath){
            this.frameTexture = new THREE.TextureLoader().load(this.frameTexturePath);
            this.frameTexture.wrapS = THREE.RepeatWrapping;
            this.frameTexture.wrapT = THREE.RepeatWrapping;
        }

        this.outsideMaterial = new THREE.MeshPhongMaterial({map: this.outsideTexture, side: THREE.DoubleSide })
        this.frameMaterial = new THREE.MeshPhysicalMaterial({map: this.frameTexture, metalness: 0.2, roughness: 0.3, side: THREE.DoubleSide })
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: "#000000", 
            specular: "#000000", emissive: "#000000", side: THREE.DoubleSide})
        let top = new THREE.BoxGeometry(this.width,this.height * 0.1,this.depth)
        let side = new THREE.BoxGeometry(this.depth,this.height * 0.8,this.width*0.1)
        let bar = new THREE.CylinderGeometry(0.05,0.05,0.8*this.height)
        let view = new THREE.PlaneGeometry(this.width*0.8,this.height*0.8)

        this.topMesh = new THREE.Mesh(top, this.frameMaterial)

        this.leftMesh = new THREE.Mesh(side, this.frameMaterial)
        this.leftMesh.translateX(-0.55*this.width + this.width*0.1)
        this.leftMesh.translateY(-0.45*this.height)
        this.leftMesh.rotateY(Math.PI / 2)

        this.rightMesh = new THREE.Mesh(side, this.frameMaterial)
        this.rightMesh.translateX(0.45*this.width)
        this.rightMesh.translateY(-0.45*this.height)
        this.rightMesh.rotateY(Math.PI / 2)
        
        this.bottomMesh = new THREE.Mesh(top, this.frameMaterial)
        this.bottomMesh.translateY(-0.90*height)

        this.planeView = new THREE.Mesh(view,this.outsideMaterial)
        this.planeView.translateY(-0.45*this.height)
        this.planeView.translateX(0.01)
        this.planeView.translateZ(this.depth / 2)

        this.add( this.topMesh,this.bottomMesh,this.leftMesh,this.rightMesh,this.planeView);
        this.translateY(-0.05*this.height)

        let offsetX = 0.2
        for(let i = 0; i < 10; i++) {
            this.barMesh = new THREE.Mesh(bar, this.frameMaterial)
            this.barMesh.translateY(-0.45*this.height)
            this.barMesh.translateX(this.width * 0.4 - offsetX)
            this.barMesh.translateZ(-this.depth/2 + 0.05)
            offsetX += 0.25
            this.add(this.barMesh)
        }
        this.rotateY(Math.PI / 2)
        this.translateY(0.5*this.height)

    }
}

MyWindow.prototype.isGroup = true;

export { MyWindow };