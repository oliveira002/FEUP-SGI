import * as THREE from 'three';


/**
 * This class contains a stack of boxes
 */
class MyBoxStack extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} boxSize size of each crate
     */
    constructor(app, boxSize) {
        super();
        this.app = app;
        this.type = 'Group';
        this.boxSize = boxSize

        this.boxGeo = new THREE.BoxGeometry(this.boxSize,this.boxSize,this.boxSize)

        this.boxTexturePath = "images/box.jpg"

        if(this.boxTexturePath){
            this.boxTexture = new THREE.TextureLoader().load(this.boxTexturePath);
            this.boxTexture.wrapS = THREE.RepeatWrapping;
            this.boxTexture.wrapT = THREE.RepeatWrapping;
        }

        this.boxMaterial = new THREE.MeshPhongMaterial({map: this.boxTexture})
        this.group = new THREE.Group()

        this.box1 = new THREE.Mesh(this.boxGeo,this.boxMaterial)
        this.box2 = new THREE.Mesh(this.boxGeo,this.boxMaterial)
        this.box3 = new THREE.Mesh(this.boxGeo,this.boxMaterial)

        this.group.add(this.box1,this.box2,this.box3)
        this.group.translateY(this.boxSize / 2)
        this.box2.translateX(this.boxSize)
        this.box2.translateZ(this.boxSize / 1.3)
        this.box3.translateY(this.boxSize)
        this.box3.translateX(this.boxSize / 1.2)
        this.box3.translateZ(this.boxSize / 3.5)
        this.box3.rotateY(Math.PI / 12)
        this.add(this.group)
        
        this.children.forEach(element => {
            element.castShadow = true
            //element.receiveShadow = true
        });
    }
}

MyBoxStack.prototype.isGroup = true;

export { MyBoxStack };