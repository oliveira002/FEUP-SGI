import * as THREE from 'three';

/**
 * This class contains walls representation for a square floor
 */
class MyWalls extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} height the height of the wall. Default is `1`
     * @param {number} floor_length the measurement of the side of the floor parallel to the x axis to which the walls are relative to. Default is `1`
     * @param {number} floor_width the measurement of the side of the floor parallel to the z axis to which the walls are relative to. Default is `1`
     * @param {string} wallsTexturePath the path of the texture to be used on the walls. Default `undefined`
     * @param {number} diffuseWallColor the diffuse component of the wall's color. Default `#fdfd96`
     * @param {number} specularWallColor the specular component of the wall's color. Default `#777777`
     * @param {number} wallShininess the shininess component of the wall's color. Default `30`
     */
    constructor(app, height, floor_length, floor_width, wallsTexturePath,wallsHoleTexturePath, wallsDoorTexturePath, diffuseWallColor, specularWallColor, wallShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.height = height || 1
        this.floor_length = floor_length || 1;
        this.floor_width = floor_width || 1;
        this.wallsTexturePath = wallsTexturePath
        this.wallsHoleTexturePath = wallsHoleTexturePath
        this.wallsDoorTexturePath = wallsDoorTexturePath
        this.diffuseWallColor = diffuseWallColor || "#FFFFFF"
        this.specularWallColor = specularWallColor || "#000000"
        this.wallShininess = wallShininess || 0


        if(this.wallsDoorTexturePath) {
            this.wallsDoorTexture = new THREE.TextureLoader().load(this.wallsDoorTexturePath);
            this.wallsDoorTexture.wrapS = THREE.MirroredRepeatWrapping ;
            this.wallsDoorTexture.wrapT = THREE.ClampToEdgeWrapping;
            let wallsTextureRepeatU = 1;
            let wallsTextureRepeatV = 1;
            this.wallsDoorTexture.repeat.set(wallsTextureRepeatU, wallsTextureRepeatV );
        }
        if(this.wallsHoleTexturePath){
            this.wallsHoleTexture = new THREE.TextureLoader().load(this.wallsHoleTexturePath);
            this.wallsHoleTexture.wrapS = THREE.MirroredRepeatWrapping ;
            this.wallsHoleTexture.wrapT = THREE.ClampToEdgeWrapping;
            let wallsTextureRepeatU = 1;
            let wallsTextureRepeatV = 1;
            this.wallsHoleTexture.repeat.set(wallsTextureRepeatU, wallsTextureRepeatV );
        }

        if(this.wallsTexturePath){
            this.wallsTexture = new THREE.TextureLoader().load(this.wallsTexturePath);
            this.wallsTexture.wrapS = THREE.MirroredRepeatWrapping ;
            this.wallsTexture.wrapT = THREE.ClampToEdgeWrapping;
            let wallsTextureRepeatU = 1;
            let wallsTextureRepeatV = 1;
            this.wallsTexture.repeat.set(wallsTextureRepeatU, wallsTextureRepeatV );
        }

        this.wallMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseWallColor, 
            specular: this.specularWallColor, emissive: "#000000", shininess: this.wallShininess, map: this.wallsTexture, transparent: true })
        
        this.wallHoleMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseWallColor, 
                specular: this.specularWallColor, emissive: "#000000", shininess: this.wallShininess, map: this.wallsHoleTexture, transparent: true })
        this.wallDoorMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseWallColor, 
            specular: this.specularWallColor, emissive: "#000000", shininess: this.wallShininess, map: this.wallsDoorTexture, transparent: true })

        let wallX = new THREE.PlaneGeometry(this.floor_length, this.height)
        let wallZ = new THREE.PlaneGeometry(this.floor_width, this.height)
        
        // back wall (looking from x= +inf to x= 0)
        this.backWallMesh = new THREE.Mesh(wallZ, this.wallMaterial)
        this.backWallMesh.translateX(-this.floor_length/2)
        this.backWallMesh.translateY(this.height/2)
        this.backWallMesh.rotateY(Math.PI/2)
        this.add( this.backWallMesh );
        
        // right wall
        this.rightWallMesh = new THREE.Mesh(wallX, this.wallDoorMaterial)
        this.rightWallMesh.translateZ(-this.floor_width/2)
        this.rightWallMesh.translateY(this.height/2)
        this.add( this.rightWallMesh );

        //left wall
        this.leftWallMesh = new THREE.Mesh(wallX, this.wallMaterial)
        this.leftWallMesh.translateZ(this.floor_width/2)
        this.leftWallMesh.translateY(this.height/2)
        this.leftWallMesh.rotateY(Math.PI)
        this.add( this.leftWallMesh );

        //front wall
        this.frontWallMesh = new THREE.Mesh(wallZ, this.wallHoleMaterial)
        this.frontWallMesh.translateX(this.floor_length/2)
        this.frontWallMesh.translateY(this.height/2)
        this.frontWallMesh.rotateY(-Math.PI/2)
        //this.add( this.frontWallMesh );
        this.translateY(-this.height/2)

        this.children.forEach(element => {
            element.receiveShadow = true
        });
    }
}

MyWalls.prototype.isGroup = true;

export { MyWalls };