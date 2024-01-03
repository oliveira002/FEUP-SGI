import * as THREE from 'three';

class MyCheckpoint extends THREE.Object3D {

    constructor(normal, width, number) {
        super();
        this.type = 'Group';
        this.normalDir = normal
        this.width = width
        this.number = number

        this.init()
    }

    init(){
        const geometry = new THREE.PlaneGeometry( this.width, 3 );

        const texture = new THREE.TextureLoader().load('images/checkpoint.png');
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide, 
            map: texture, 
            transparent: true
        });
        //material.visible = false
        //material.wireframe = true

        const plane = new THREE.Mesh( geometry, material );

        // Rotate the plane to face the tangent direction
        //plane.rotateY(this.normalDir.angleTo(new THREE.Vector3(0,0,1)))
        const rotationAxis = new THREE.Vector3(0, 1, 0);
        const angle = Math.atan2(this.normalDir.x, this.normalDir.z);
        plane.setRotationFromAxisAngle(rotationAxis, angle);

        this.add(plane)
    }

    getEffect(){
        return this.number
    }
}

MyCheckpoint.prototype.isGroup = true;

export { MyCheckpoint };