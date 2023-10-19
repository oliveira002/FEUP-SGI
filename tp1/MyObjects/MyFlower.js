import * as THREE from 'three';
import { MyApp } from '../MyApp.js';


/**
 * This class contains a flower representation
 */
class MyFlower extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} maxRadius the radius of the top part of the plate. Default is `1`
     * @param {number} height the height of the plate. Default is `radius/5`
     * @param {number} diffusePlateColor the diffuse component of the plate's color. Default `#FFFFFF`
     * @param {number} specularPlateColor the specular component of the plate's color. Default `#FFFFFF`
     * @param {number} plateShininess the shininess component of the plate's color. Default `30` 
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        this.flowerRadius = 0.3

        this.flowerTexture = new THREE.TextureLoader().load("textures/flower.jpg");
            this.flowerTexture.wrapS = THREE.RepeatWrapping;
            this.flowerTexture.wrapT = THREE.RepeatWrapping;
        
        this.petalsTexture = new THREE.TextureLoader().load("textures/petals.jpg");
            this.petalsTexture.wrapS = THREE.RepeatWrapping;
            this.petalsTexture.wrapT = THREE.RepeatWrapping;

            this.petalMaterial = new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,
                color: "#8A2BE2",  
                shininess: 50,   
              });
        
        this.flowerMaterial = new THREE.MeshPhongMaterial({shininess: 10, side: THREE.DoubleSide, map: this.flowerTexture})


        this.stalkMaterial = new THREE.MeshPhongMaterial({ color: "#0d5901", 
        specular: "#0d5901", emissive: "#0d5901", shininess: 10, side: THREE.DoubleSide})

        this.petalGeo = new THREE.CircleGeometry(this.flowerRadius);

        this.flow = new THREE.Mesh(this.petalGeo, this.flowerMaterial);
        this.flow.translateY(-0.01)
        this.flow.rotateX(Math.PI / 2)

        const points = [new THREE.Vector3(1.032,0.652,0),new THREE.Vector3(0.904,0.634,0),new THREE.Vector3(0.692,0.87,0),new THREE.Vector3(0.703,-0.224,0)]
        const curve = new THREE.CubicBezierCurve3(...points);
        const geometry = new THREE.TubeGeometry(curve, points.length * 10,0.02,8,false);


        this.stalkMesh = new THREE.Mesh( geometry, this.stalkMaterial);
        this.stalkMesh.rotateX(Math.PI)
        this.stalkMesh.rotateY(Math.PI / 2)
        this.stalkMesh.scale.set(1,1.4,1)
        this.stalkMesh.translateX(0.9)
        this.stalkMesh.translateY(-1.04)
        this.stalkMesh.rotateZ(Math.PI / 2)
        
        for (let i = 0; i < 8; i++) {
            let petalMesh = new THREE.Mesh(this.petalGeo, this.petalMaterial);
            petalMesh.rotation.x = Math.PI / 2;
    
            petalMesh.rotation.z = i * Math.PI  / 4 - Math.PI / 2;
      
            let radius = 0.3;
            petalMesh.position.set(radius * Math.cos(i * Math.PI  / 4), 0, radius * Math.sin(i * Math.PI  / 4));
            
            this.add(petalMesh)
          }
        
          this.scale.set(0.3,0.3,0.3)
          this.add(this.stalkMesh)
          this.add(this.flow)

          this.children.forEach(element => {
            element.castShadow = true
            element.receiveShadow = true
        });
    }
}

MyFlower.prototype.isGroup = true;

export { MyFlower };