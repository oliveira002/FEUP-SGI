import * as THREE from 'three';

class MyTrack extends THREE.Object3D {

    constructor(points) {
        super();
        this.type = 'Group';
        this.points = points
        this.path = new THREE.CatmullRomCurve3(this.points);
        this.trackWidth = 4
        this.samples = 500

        this.init()
    }

    init(){
        let geo = new THREE.BufferGeometry();
        let vertices = [];
        let indices = [];
    
        let samplePoints = this.path.getPoints(this.samples);

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

        })

        geo.setIndex(indices);
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geo.computeVertexNormals();
        
        let mat = new THREE.MeshPhongMaterial({color: 0x696969, side: THREE.DoubleSide})
        mat.wireframe = true
        let mesh = new THREE.Mesh(geo, mat);
        this.add(mesh);

        let line = new THREE.BufferGeometry().setFromPoints(samplePoints);
        let mat2 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        let mesh2 = new THREE.Line(line, mat2);
        //this.add(mesh2);
    }
}

MyTrack.prototype.isGroup = true;

export { MyTrack };