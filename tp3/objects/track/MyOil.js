import * as THREE from 'three';

class MyOil extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, size) {
        super();
        this.app = app;
        this.type = 'Group';
        this.oilSize = size || 5;
    
        this.oilGeometry = new THREE.BoxGeometry(this.oilSize, this.oilSize, this.oilSize);
    
        this.oilTexturePath = "images/oil.png";
        this.oilTexture = new THREE.TextureLoader().load(this.oilTexturePath);
        this.oilTexture.wrapS = THREE.RepeatWrapping;
        this.oilTexture.wrapT = THREE.RepeatWrapping;
    
        // Create an array of transparent materials
        const transparentMaterial = new THREE.MeshPhongMaterial({
            transparent: true,
            opacity: 0,
            side: THREE.BackSide
        });
    
        // Create a material with the oil texture for the bottom face
        const oilMaterial = new THREE.MeshPhongMaterial({
            map: this.oilTexture,
            transparent: true,
            opacity: 1,
            alphaTest: 0.5,
            side: THREE.BackSide
        });
    
        // Apply materials to each face
        const materials = [
            transparentMaterial, // Right
            transparentMaterial, // Left
            transparentMaterial, // Top
            transparentMaterial, // Bottom
            transparentMaterial, // Front
            oilMaterial  // Back
        ];
    
        this.oil = new THREE.Mesh(this.oilGeometry, materials);
        
        this.oil.translateY(this.oilSize / 2 + 0.2)
        this.oil.rotateX(-Math.PI / 2);
        this.oil.translateZ(0.03);
    
        this.add(this.oil);
        this.name = "Oil";
    }

    getEffect(){
        return this.name
    }
}

MyOil.prototype.isGroup = true;

export { MyOil };