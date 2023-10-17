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
    constructor(app, windowWidth, windowLength, windowDepth, landscapeTexturePath, horizontalPieceWidth, horizontalPieceLength, 
                verticalPieceWidth, verticalPieceLength, diffuseFrameColor, specularFrameColor, frameShininess) {

        super();
        this.app = app;
        this.type = 'Group';
        this.windowWidth = windowWidth || 2
        this.windowLength = windowLength || 3
        this.windowDepth = windowDepth || 0.1
        this.horizontalPieceWidth = horizontalPieceWidth || this.windowWidth/10
        this.horizontalPieceLength = horizontalPieceLength || 9*this.windowLength/10
        this.verticalPieceWidth = verticalPieceWidth || this.windowLength/10
        this.verticalPieceLength = verticalPieceLength || 9*this.windowWidth/10
        this.landscapeTexturePath = landscapeTexturePath
        this.landscapeTexture = null
        this.diffuseFrameColor = diffuseFrameColor || "#331800"
        this.specularFrameColor = specularFrameColor || "#777777"
        this.frameShininess = frameShininess || 10
        this.framePath = "textures/rusty.jpg"

        this.frame = new MyPortrait(this.app, this.windowWidth, this.windowLength, this.windowDepth, 
            this.landscapeTexturePath,this.framePath, this.horizontalPieceWidth, this.horizontalPieceLength, 
            this.verticalPieceWidth, this.verticalPieceLength, this.diffuseFrameColor, this.specularFrameColor, this.frameShininess)
        this.add(this.frame)
        
    }
}

MyWindow.prototype.isGroup = true;

export { MyWindow };