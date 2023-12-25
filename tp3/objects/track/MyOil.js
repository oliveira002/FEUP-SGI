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
        this.oilSize = size || 5

        this.oilGeometry = new THREE.PlaneGeometry(this.oilSize,this.oilSize)
        this.oilTexturePath = "images/oil.png"

        this.oilTexture = new THREE.TextureLoader().load(this.oilTexturePath);
        this.oilTexture.wrapS = THREE.RepeatWrapping;
        this.oilTexture.wrapT = THREE.RepeatWrapping;

        this.oilMaterial = new THREE.MeshPhysicalMaterial({
            map: this.oilTexture,
            transparent: true,
            opacity: 0.9,
            alphaTest: 0.5,
            roughness: 0.9
          });

        this.oil = new THREE.Mesh(this.oilGeometry,this.oilMaterial)
        this.oil.rotateX(-Math.PI / 2)
        this.oil.translateZ(0.03)

        this.add(this.oil)
    }
}

MyOil.prototype.isGroup = true;

export { MyOil };