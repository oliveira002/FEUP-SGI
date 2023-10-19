import * as THREE from 'three';
import { MyApp } from '../MyApp.js';




class MyBulb extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {boolean} isTurnedOn whether the bulb is emitting light or not. Default `false`
     * @param {number} bulbRadius the radius of the bulb. Default is `0.1`
     * @param {number} diffuseBulbColor the diffuse component of the bulb's color. Default `#FFFFCC`
     * @param {number} specularBulbColor the specular component of the bulb's color. Default `#777777`
     * @param {number} bulbShininess the shininess component of the bulb's color. Default `10`
     * @param {number} diffuseBulbSupportColor the diffuse component of the bulb's support color. Default `#8A8B8F`
     * @param {number} specularBulbSupportColor the specular component of the bulb's support color. Default `#777777`
     * @param {number} bulbSupportShininess the shininess component of the bulb's support color. Default `10`
     */
    constructor(app, isTurnedOn, bulbRadius, bulbTexturePath, diffuseBulbColor, specularBulbColor, bulbShininess, diffuseBulbSupportColor, specularBulbSupportColor, bulbSupportShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.isTurnedOn = isTurnedOn || false
        this.bulbRadius = bulbRadius || 0.05
        this.bulbHeight = this.bulbRadius*3
        this.bulbTexturePath = bulbTexturePath
        this.bulbGlassHeight = this.bulbHeight * 0.9
        this.bulbBottomRadiusBottom = this.bulbRadius/2
        this.bulbBottomRadiusTop = this.bulbRadius*Math.sin(Math.PI/4)
        this.bulbBottomHeight = (this.bulbGlassHeight-(this.bulbRadius*(1+Math.cos(Math.PI/4))))
        this.bulbSupportRadius = this.bulbBottomRadiusBottom
        this.bulbSupportHeight = this.bulbHeight * 0.1
        this.diffuseBulbColor = diffuseBulbColor || "#FFFFCC"
        this.specularBulbColor = specularBulbColor || "#777777"
        this.bulbShininess = bulbShininess || 10
        this.diffuseBulbSupportColor = diffuseBulbSupportColor || "#8A8B8F"
        this.specularBulbSupportColor = specularBulbSupportColor || "#777777"
        this.bulbSupportShininess = bulbSupportShininess || 10

        if(this.bulbTexturePath){
            this.bulbTexture = new THREE.TextureLoader().load(this.bulbTexturePath);
            this.bulbTexture.wrapS = THREE.RepeatWrapping;
            this.bulbTexture.wrapT = THREE.RepeatWrapping;
        }

        if(this.bulbTexture) {
            this.bulbMaterial = new THREE.MeshPhongMaterial({map : this.bulbTexture})
        }
        else {
            this.bulbMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseBulbColor, 
                specular: this.specularBulbColor, emissive: "#000000", shininess: this.bulbShininess})
        }
        this.bulbSupportMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseBulbSupportColor, 
            specular: this.specularBulbSupportColor, emissive: "#000000", shininess: this.bulbSupportShininess })
        
        this.bulbTop = new THREE.SphereGeometry(this.bulbRadius, undefined, undefined, undefined, undefined, undefined, Math.PI-Math.PI/4);
        this.bulbBottom = new THREE.CylinderGeometry(this.bulbBottomRadiusTop, this.bulbBottomRadiusBottom, this.bulbBottomHeight)
        this.bulbSupport = new THREE.CylinderGeometry(this.bulbSupportRadius, this.bulbSupportRadius, this.bulbSupportHeight)
        
        this.bulbSupportMesh = new THREE.Mesh(this.bulbSupport, this.bulbSupportMaterial)
        this.bulbSupportMesh.translateY(this.bulbSupportHeight/2)
        this.add(this.bulbSupportMesh)

        this.bulbBottomMesh = new THREE.Mesh(this.bulbBottom, this.bulbMaterial)
        this.bulbBottomMesh.translateY(this.bulbSupportHeight + Math.abs(this.bulbBottomHeight/2))
        this.add(this.bulbBottomMesh)

        this.bulbMesh = new THREE.Mesh(this.bulbTop,this.bulbMaterial)
        this.bulbMesh.translateY(this.bulbSupportHeight + Math.abs(this.bulbBottomHeight) + (this.bulbRadius - (this.bulbRadius*(1-Math.cos(Math.PI/4)))))
        this.add(this.bulbMesh)

        const group = new THREE.Group();
        

        if(this.isTurnedOn){
            // add a point light on top of the model
            //const pointLight = new THREE.PointLight( 0xffffff, 125, 0 );
            //pointLight.position.set( 0, -(this.bulbSupportHeight + this.bulbBottomHeight + (this.bulbRadius - this.bulbRadius*(1-Math.cos(Math.PI/4)))), 0 );
            //this.add( pointLight );

            this.targetGeo = new THREE.PlaneGeometry(0.01, 0.01)
            this.targetMat = new THREE.MeshBasicMaterial({transparent:true})
            this.target = new THREE.Mesh(this.targetGeo, this.targetMat)
            this.target.position.set(6, 0, 4.45)
            this.add(this.target)

            const spotLight = new THREE.SpotLight( 0xffffff, 300, 0, Math.PI/10, 0, 0);
            spotLight.position.set( 6, -(this.bulbSupportHeight + this.bulbBottomHeight + (this.bulbRadius - this.bulbRadius*(1-Math.cos(Math.PI/4)))), 4.45);
            spotLight.target = this.target
            spotLight.castShadow = true;
            this.add(spotLight)
            
            // add a point light helper for the previous point light -> if the light's position is updated, the helper's position isn'
            const lightHelper = new THREE.SpotLightHelper( spotLight)
            this.add( lightHelper );

            console.log("AHAHAHAH")
        }

        this.rotateX(Math.PI)

        group.translateY(-this.bulbHeight/2);
    }
}

MyBulb.prototype.isGroup = true;

export { MyBulb };