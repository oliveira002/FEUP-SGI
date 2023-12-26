import * as THREE from 'three';
/**
 * This class contains a shelf representation
 */
class MyShelf extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     * @param {number} shelfHeight shelf height
     * @param {number} shelfDepth shelf depth
     * @param {number} shelfLength shelf length
     * @param {number} shelfTexturePath path to the shelf texture
     * @param {string} diffuseShelfColor material diffuse component
     * @param {string} specularShelfColor material specular component
     * @param {string} shelfShininess material shininess 
     */
    constructor(app, shelfHeight, shelfDepth, shelfLength, shelfTexturePath, diffuseShelfColor, specularShelfColor, shelfShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.shelfHeight = 1
        this.shelfLength = shelfLength || 4
        this.shelfDepth = 1
        this.shelfHeight = shelfHeight
        this.shelfDepth = shelfDepth
        this.shelfTexturePath = shelfTexturePath
        this.diffuseShelfColor = diffuseShelfColor || "#EADDCA"
        this.specularShelfColor = specularShelfColor || "#EADDCA"
        this.shelfShininess = shelfShininess || 10

        
        if(this.shelfTexturePath){
            this.shelfTexture = new THREE.TextureLoader().load(this.shelfTexturePath);
            this.shelfTexture.wrapS = THREE.RepeatWrapping;
            this.shelfTexture.wrapT = THREE.RepeatWrapping;
        }

        this.shelfMaterial = new THREE.MeshPhysicalMaterial({map: this.shelfTexture, metalness: 0.2, roughness: 0.3, side: THREE.DoubleSide })

        var materials = [
            this.shelfMaterial, // Right face
            this.shelfMaterial, // Left face
            this.shelfMaterial, // Top face
            this.shelfMaterial, // Bottom face
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
              }), 
            this.shelfMaterial  // Back face
            ];
         
        var cube = new THREE.BoxGeometry(this.shelfLength, this.shelfHeight * 0.33, this.shelfDepth);

        this.bottomCube = new THREE.Mesh(cube, materials)
        this.add(this.bottomCube)

        this.midCube = new THREE.Mesh(cube, materials)
        this.midCube.translateY(this.shelfHeight * 0.329)
        this.add(this.midCube)

        this.topCube = new THREE.Mesh(cube, materials)
        this.topCube.translateY(this.shelfHeight * 0.658)
        this.add(this.topCube)

        
        this.translateY(this.shelfHeight * 0.33 / 2 + 0.01)

        this.children.forEach(element => {
            element.castShadow = true
            //element.receiveShadow = true
        });
    }
}

MyShelf.prototype.isGroup = true;

export { MyShelf };