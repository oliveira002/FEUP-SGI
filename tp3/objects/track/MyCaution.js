import * as THREE from 'three';


/**
 * This class contains a caution sign representation
 */
class MyCaution extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     * @param {number} width 
     * @param {number} depth 
     * @param {number} height 
     * @param {string} cautionTexturePath the path to the caution texture 
     */
    constructor(app, width, depth, height, cautionTexturePath) {
        super();
        this.app = app;
        this.type = 'Group';
        this.width = width
        this.depth = depth || 4
        this.height = height
        this.cautionTexturePath = "images/caution.jpg"

        this.cautionTexture = new THREE.TextureLoader().load("images/caution.jpg");

        this.material = new THREE.MeshPhongMaterial({ color: "#fcba03", 
            specular: "#acba03", map: this.cautionTexture})
        
        this.materialNormal = new THREE.MeshPhongMaterial({ color: "#fcba03", 
            specular: "#acba03"})
        

        var materials = [
            this.materialNormal, // Right face
            this.materialNormal, // Left face
            this.material, // Top face
            this.materialNormal, // Bottom face
            this.materialNormal,
            this.materialNormal  // Back face
            ];

        let piece = new THREE.BoxGeometry(this.width, this.depth, this.height)

        this.first = new THREE.Mesh(piece, materials)
        this.first.translateZ(this.depth)
        this.first.translateY(Math.sin(Math.PI / 3) * (this.height / 2) )
        this.first.rotateX(Math.PI / 3)

        this.snd = new THREE.Mesh(piece, materials)
        this.snd.translateY(Math.sin(Math.PI / 3) * (this.height / 2))
        this.snd.translateZ(-Math.cos(Math.PI / 3) * (this.height / 2) - this.depth)
        this.snd.rotateX(-Math.PI / 3)
        this.snd.rotateX(Math.PI)
        this.snd.rotateZ(Math.PI)
        //this.snd.translateY(Math.cos(Math.PI / 3) * (this.height / 2))))

        this.add(this.snd)
        this.add(this.first)

        this.translateZ(Math.cos(Math.PI / 3) * (this.height / 2) - this.depth)
        this.translateY(-Math.sin(Math.PI /3) * (this.height / 2))

        this.children.forEach(element => {
            element.castShadow = true
            element.receiveShadow = true
        });

        this.name = "Caution"
    }
}

MyCaution.prototype.isGroup = true;

export { MyCaution };