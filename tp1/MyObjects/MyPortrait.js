import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

class MyPortrait extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} portraitWidth the width of the portrait in relation to the Y axis. Default `1`
     * @param {number} portraitLength the length of the portrait in relation to the X axis. Default `1`
     * @param {number} portraitDepth the depth of the portrait in relation to the Z axis. Default `0.1`
     * @param {string} portraitTexturePath the path of the texture to be used inside the portrait. Default `undefined`
     * @param {number} horizontalPieceWidth the width of the horizontal part of the portrait's frame. Default `portraitWidth/10`
     * @param {number} horizontalPieceLength the length of the horizontal part of the portrait's frame. Default `9*portraitLength/10`
     * @param {number} verticalPieceWidth the width of the vertical part of the portrait's frame. Default `portraitLength/10`
     * @param {number} verticalPieceLength the length of the vertical part of the portrait's frame. Default `9*portraitWidth/10`
     * @param {number} diffuseFrameColor the diffuse component of the portrait's color. Default `#331800`
     * @param {number} specularFrameColor the specular component of the portrait's color. Default `#777777`
     * @param {number} frameShininess the shininess component of the portrait's color. Default `10`
     */
    constructor(app, portraitWidth, portraitLength, portraitDepth, portraitTexturePath, frameTexturePath, horizontalPieceWidth, horizontalPieceLength, 
                verticalPieceWidth, verticalPieceLength, diffuseFrameColor, specularFrameColor, frameShininess) {

        super();
        this.app = app;
        this.type = 'Group';
        this.portraitWidth = portraitWidth || 2
        this.portraitLength = portraitLength || 3
        this.portraitDepth = portraitDepth || 0.1
        this.horizontalPieceWidth = horizontalPieceWidth || this.portraitWidth/10
        this.horizontalPieceLength = horizontalPieceLength || 9*this.portraitLength/10
        this.verticalPieceWidth = verticalPieceWidth || this.portraitLength/10
        this.verticalPieceLength = verticalPieceLength || 9*this.portraitWidth/10
        this.portraitInnerWidth = this.portraitWidth-2*this.horizontalPieceWidth
        this.portraitInnerLength = this.portraitLength-2*this.verticalPieceWidth
        this.frameTexturePath = frameTexturePath
        this.portraitTexturePath = portraitTexturePath
        this.portraitTexture = null
        this.diffuseFrameColor = diffuseFrameColor || "#331800"
        this.specularFrameColor = specularFrameColor || "#777777"
        this.frameShininess = frameShininess || 10


    
        
        if(this.portraitTexturePath){
            this.portraitTexture = new THREE.TextureLoader().load(portraitTexturePath);
            this.portraitTexture.wrapS = THREE.RepeatWrapping;
            this.portraitTexture.wrapT = THREE.RepeatWrapping;
        }

        if(this.frameTexturePath) {
            this.frameTexture = new THREE.TextureLoader().load(frameTexturePath);
            this.frameTexture.wrapS = THREE.RepeatWrapping;
            this.frameTexture.wrapT = THREE.RepeatWrapping;
            this.frameMaterial = new THREE.MeshPhongMaterial({map: this.frameTexture})
        }
        else {
            this.frameMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseFrameColor, 
                specular: this.specularFrameColor, emissive: "#000000", shininess: this.frameShininess })
        }

        this.portraitInnerMaterial = new THREE.MeshPhongMaterial({ /*color: this.diffuseFrameColor, 
            specular: this.specularFrameColor, emissive: "#000000", shininess: this.frameShininess,*/ map: this.portraitTexture })

        let horizontalFrame = new THREE.BoxGeometry(this.horizontalPieceLength, this.horizontalPieceWidth, this.portraitDepth)
        let verticalFrame = new THREE.BoxGeometry(this.verticalPieceWidth, this.verticalPieceLength, this.portraitDepth)
        let portrait_inner = new THREE.PlaneGeometry(this.portraitInnerLength, this.portraitInnerWidth); 
        
        // bottom horizontal frame piece
        this.bottomHorizontalFrameMesh = new THREE.Mesh(horizontalFrame, this.frameMaterial)
        this.bottomHorizontalFrameMesh.translateX(-this.verticalPieceWidth/2)
        this.bottomHorizontalFrameMesh.translateY(this.horizontalPieceWidth/2)
        this.add( this.bottomHorizontalFrameMesh );

        // top horizontal frame piece
        this.topHorizontalFrameMesh = new THREE.Mesh(horizontalFrame, this.frameMaterial)
        this.topHorizontalFrameMesh.translateX(this.verticalPieceWidth/2)
        this.topHorizontalFrameMesh.translateY((this.horizontalPieceWidth/2 + this.portraitWidth - this.horizontalPieceWidth))
        this.add( this.topHorizontalFrameMesh );

        // right vertical frame piece
        this.rightVerticalFrameMesh = new THREE.Mesh(verticalFrame, this.frameMaterial)
        this.rightVerticalFrameMesh.translateX((this.portraitLength/2 - this.verticalPieceWidth/2))
        this.rightVerticalFrameMesh.translateY(this.verticalPieceLength/2)
        this.add( this.rightVerticalFrameMesh );
        
        // left vertical frame piece
        this.leftVerticalFrameMesh = new THREE.Mesh(verticalFrame, this.frameMaterial)
        this.leftVerticalFrameMesh.translateX(-(this.portraitLength/2 - this.verticalPieceWidth/2))
        this.leftVerticalFrameMesh.translateY(this.verticalPieceLength/2 + this.horizontalPieceWidth)
        this.add( this.leftVerticalFrameMesh );

        //portrait
        this.portraitInnerMesh = new THREE.Mesh(portrait_inner, this.portraitInnerMaterial)
        this.portraitInnerMesh.translateY(this.portraitInnerWidth/2+this.horizontalPieceWidth)
        this.portraitInnerMesh.translateZ(-this.portraitDepth/2)
        this.add(this.portraitInnerMesh)

        this.translateY(-this.portraitWidth/2);
    }
}

MyPortrait.prototype.isGroup = true;

export { MyPortrait };