import * as THREE from 'three';

class MyOpponent extends THREE.Object3D {

    constructor(app, keyPoints) {
        super();
        this.app = app;
        this.type = 'Group';
        this.keyPoints = keyPoints

        this.boxMesh = null
        this.boxMeshSize = 0.5
        this.boxEnabled = false
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)


        //console.log(keyPoints)
    }

    init() {
        this.buildBox()
    }

    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize + 0.3);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;

        this.app.scene.add(this.boxMesh)
    }
}

MyOpponent.prototype.isGroup = true;

export { MyOpponent };