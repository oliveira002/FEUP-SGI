import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyTree extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';


        this.tex1 = new THREE.TextureLoader().load('images/trunk.jpg');
        this.tex1.wrapS = THREE.RepeatWrapping;
        this.tex1.wrapT = THREE.RepeatWrapping;

        this.tex2 = new THREE.TextureLoader().load('images/leaf.jpg');
        this.tex2.wrapS = THREE.RepeatWrapping;
        this.tex2.wrapT = THREE.RepeatWrapping;


        var trunkGeo = new THREE.CylinderGeometry(0.5, 0.5,7,7,7)
        var leafGeo = new THREE.SphereGeometry(2, 8, 8)

        var trunkMat = new THREE.MeshPhongMaterial({map: this.tex1})
        var leafMat = new THREE.MeshPhongMaterial({map: this.tex2})

        var trunk = new THREE.Mesh(trunkGeo, trunkMat)
        trunk.translateY(3.5)
        this.add(trunk)

        var leaf1 = new THREE.Mesh(leafGeo, leafMat)
        leaf1.translateX(2)
        leaf1.translateY(3)

        var leaf2 = new THREE.Mesh(leafGeo, leafMat)
        leaf2.translateZ(2)
        leaf2.translateY(3)


        var leaf3 = new THREE.Mesh(leafGeo, leafMat)
        leaf3.translateX(-2)
        leaf3.translateY(3)

        var leaf4 = new THREE.Mesh(leafGeo, leafMat)
        leaf4.translateZ(-2)
        leaf4.translateY(3)

        var leaf5 = new THREE.Mesh(leafGeo, leafMat)
        leaf5.translateY(5)

        var leafs = [leaf1, leaf2, leaf3, leaf4, leaf5]
        leafs.forEach(e => {
            e.translateY(3)
            this.add(e)
        })
    }
}

MyTree.prototype.isGroup = true;

export { MyTree };