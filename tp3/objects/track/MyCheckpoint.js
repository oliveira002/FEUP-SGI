import * as THREE from 'three';

class MyCheckpoint extends THREE.Object3D {

    constructor(normal, width, number) {
        super();
        this.type = 'Group';
        this.normal = normal
        this.width = width
        this.number = number

        this.init()
    }

    init(){
        const geometry = new THREE.PlaneGeometry( this.width, 3 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
        //material.visible = false

        const plane = new THREE.Mesh( geometry, material );
        plane.rotateY(new THREE.Vector3(0,0,1).angleTo(this.normal))

        this.add(plane)
    }

    getEffect(){
        return this.number
    }
}

MyCheckpoint.prototype.isGroup = true;

export { MyCheckpoint };