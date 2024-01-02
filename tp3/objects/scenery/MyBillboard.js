import * as THREE from 'three';
import { MyShader } from '../../MyShader.js';

class MyBillboard extends THREE.Object3D {
    /**
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';

        const planeGeometry = new THREE.PlaneGeometry(10, 10,100,100); // Adjust the size as needed

        const planeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.Texture() });

        this.texture = null
        this.billboardPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.billboardPlane.translateY(5)

    

        this.updateInterval = setInterval(() => {
            this.update();
        }, 10000); // 10000 milliseconds = 10 seconds
    }

    waitForShaders() {
		if(this.shader.ready === false) {
			setTimeout(this.waitForShaders.bind(this), 100)
			return;
		}

        this.billboardPlane.material = this.shader.material

        this.add(this.billboardPlane)

	}



    update() {
        const activeCamera = this.app.activeCamera;
        if (activeCamera) {
            const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {depthBuffer: true});
            this.app.renderer.setRenderTarget(renderTarget);
            this.app.renderer.render(this.app.scene, activeCamera);
            this.app.renderer.setRenderTarget(null);

            this.texture = renderTarget.texture;

            this.shader = new MyShader(this.app, 'Billboard Shader', "Billboard Shader", "shaders/billboard.vert", "shaders/billboard.frag", {
                uSampler1: {type: 'sampler2D', value: this.texture},
            })
            

            this.waitForShaders()
        }
    }
    convertToGrayscale(texture) {
        // Get the pixel data from the texture
        var imageData = texture.image;
        
        // Create a canvas and context
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
    
        // Set the canvas size to the texture size
        canvas.width = imageData.width;
        canvas.height = imageData.height;
    
        // Draw the texture onto the canvas
        context.drawImage(imageData, 0, 0, imageData.width, imageData.height);
    
        // Get the pixel data from the canvas
        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
        // Loop through the pixel data and convert to grayscale
        for (let i = 0; i < imageData.data.length; i += 4) {
            const average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] = average;
            imageData.data[i + 1] = average;
            imageData.data[i + 2] = average;
        }
    
        // Update the texture with the grayscale pixel data
        texture.image = imageData;
        texture.needsUpdate = true;
    }

    // Make sure to clear the interval when the billboard is no longer needed
    dispose() {
        clearInterval(this.updateInterval);
    }
}

MyBillboard.prototype.isGroup = true;

export { MyBillboard };