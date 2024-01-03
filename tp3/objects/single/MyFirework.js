import * as THREE from 'three'

class MyFirework extends THREE.Object3D {

    constructor(app) {
        super()
        this.app = app
        this.done = false 
        this.dest = [] 
        
        this.vertices = null
        this.colors   = null
        this.geometry = null
        this.points   = null
        
        this.material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        
        this.height = 10
        this.speed = 60


        const color = new THREE.Color();
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), THREE.MathUtils.randFloat(0.1, 0.9), THREE.MathUtils.randFloat(0.1, 0.9));
        this.fireworkColor = color

        this.launch() 

    }

    /**
     * compute particle launch
     */

    launch() {
        var color = new THREE.Color(this.fireworkColor);
        let colors = [ color.r, color.g, color.b ]

        let x = THREE.MathUtils.randFloat( -5, 5 ) 
        let y = THREE.MathUtils.randFloat( this.height * 0.9, this.height * 1.1)
        let z = THREE.MathUtils.randFloat( -5, 5 ) 
        this.dest.push( x, y, z ) 
        let vertices = [0,0,0]
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        this.points = new THREE.Points( this.geometry, this.material )
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.add( this.points )  
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {
        this.remove(this.points);
        const explosionGeometry = new THREE.BufferGeometry();
        const explosionVertices = [];
        const explosionColors = [];

        for (let i = 0; i < n; i++) {
            const theta = THREE.MathUtils.randFloat(rangeBegin, rangeEnd);
            const phi = THREE.MathUtils.randFloat(0, Math.PI * 2);
            const radius = THREE.MathUtils.randFloat(1, 2);

            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            explosionVertices.push(x + origin[0], y + origin[1], z + origin[2]);

            const color = new THREE.Color();
            color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), THREE.MathUtils.randFloat(0.1, 0.9), THREE.MathUtils.randFloat(0.1, 0.9));
            explosionColors.push(color.r, color.g, color.b);
        }

        explosionGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(explosionVertices), 3));
        explosionGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(explosionColors), 3));

        const explosionMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: this.fireworkColor,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        });

        const explosionPoints = new THREE.Points(explosionGeometry, explosionMaterial);
        explosionPoints.castShadow = true;
        explosionPoints.receiveShadow = true;
        this.add(explosionPoints);

        // Optionally, you can dispose of the explosion geometry and material after a certain time
        setTimeout(() => {
            explosionPoints.geometry.dispose();
            explosionPoints.material.dispose();
            this.remove(explosionPoints);
            this.done = true
        }, 500);
    }
    
    /**
     * cleanup
     */
    reset() {
        this.remove( this.points )  
        this.dest     = [] 
        this.vertices = null
        this.colors   = null 
        this.geometry = null
        this.points   = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {
        
        // do only if objects exist
        if( this.points && this.geometry )
        {
            let verticesAtribute = this.geometry.getAttribute( 'position' )
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions 
            let j = 0
            for( let i = 0; i < vertices.length; i+=3 ) {
                vertices[i  ] += ( this.dest[i  ] - vertices[i  ] ) / this.speed
                vertices[i+1] += ( this.dest[i+1] - vertices[i+1] ) / this.speed
                vertices[i+2] += ( this.dest[i+2] - vertices[i+2] ) / this.speed
            }
            verticesAtribute.needsUpdate = true
            
            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( vertices[1] ) > ( this.dest[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 10, this.height * 0.05, this.height * 0.5) 
                    return 
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            if( count > 1 ) {
                // fade out exploded particles 
                this.material.opacity -= 0.015 
                this.material.needsUpdate = true
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 )
            {
                this.reset() 
                this.done = true 
                return 
            }
        }
    }
}

MyFirework.prototype.isGroup = true;
export { MyFirework }