import * as THREE from 'three';
import { MyCheckpoint } from './MyCheckpoint.js';

class MyTrack extends THREE.Object3D {

    constructor(points) {
        super();
        this.type = 'Group';
        this.points = points
        this.path = new THREE.CatmullRomCurve3(this.points);
        this.trackLen = this.path.getLength()
        this.trackWidth = 6
        this.samples = 500
        this.checkpoints = []
        this.carStart = this.points[this.points.length-3]
        this.carStartDir = this.points[0].clone().sub(this.carStart)

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.scale.set(0.2, 0.2, 0.2)
        sphere.position.set(...this.carStart)
        this.add( sphere );

        this.init()
        this.initCheckpoints()
    }

    init(){
        let geo = new THREE.BufferGeometry();
        let vertices = [];
        let indices = [];
        let UVCoords = [];
    
        let samplePoints = this.path.getPoints(this.samples);
        let currentUV = 0
        samplePoints.forEach( (point, index) => {

            // Get the tangent of the curve at each point
            let tangent = this.path.getTangent(index / samplePoints.length);

            // Since curve always in the XZ plane, normal is always [0,1,0]
            let normal = new THREE.Vector3(0, 1, 0);

            // Calculate binormal from tangent and normal and normalize it
            let binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

            // Project curve point outwards and inwards by scaling the binormal by half of the track's width in both directions and adding it to the point
            let outer = binormal.multiplyScalar(this.trackWidth / 2).clone().add(point);
            let inner = binormal.multiplyScalar(-1).clone().add(point);

            vertices.push(...outer, ...inner)


            if(index < samplePoints.length - 1){
                indices.push(
                    index*2, index*2+1, (index+1)*2, 
                    index*2+1, (index+1)*2+1, (index+1)*2
                );
            }

            if(index > 0) {
                currentUV += point.distanceTo(samplePoints[index - 1]);
            }
            let len = currentUV / this.trackLen;

            UVCoords.push(
                0, len, 
                1, len
            ); 

        })

        geo.setIndex(indices);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(UVCoords, 2));  
        geo.computeVertexNormals();
        
        const texture = new THREE.TextureLoader().load('images/asphalt.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 40);

        let mat = new THREE.MeshPhongMaterial({color: 0x696969, side: THREE.DoubleSide, map: texture, bumpMap: texture})
        let mesh = new THREE.Mesh(geo, mat);
        this.add(mesh);

        let line = new THREE.BufferGeometry().setFromPoints(samplePoints);
        let mat2 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        let mesh2 = new THREE.Line(line, mat2);
        //this.add(mesh2);
    }

    initCheckpoints(){
        let samplePoints = this.path.getSpacedPoints(10);
        samplePoints = samplePoints.slice(0, 10);

        samplePoints.forEach( (point, index) => {

            // Get the tangent of the curve at each point
            let tangent = this.path.getTangentAt(index / samplePoints.length).normalize();

            let checkpointWidth = this.trackWidth + 2

            let plane = new MyCheckpoint(tangent, checkpointWidth, index)
            let pos = new THREE.Vector3(point.x, point.y+3/2, point.z)
            plane.position.set(...pos)
        
            const boundingBox = new THREE.Box3().setFromObject(plane);
            plane.children[0].geometry.boundingBox = boundingBox

            const arrowHelper = new THREE.ArrowHelper( tangent, pos, 3, 0xffff00 );
            //this.add( arrowHelper );

            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.scale.set(0.2, 0.2, 0.2)
            sphere.position.set(...pos)
            //this.add( sphere );

            this.add(plane)
            this.checkpoints.push(plane)
        })

    }


}

MyTrack.prototype.isGroup = true;

export { MyTrack };