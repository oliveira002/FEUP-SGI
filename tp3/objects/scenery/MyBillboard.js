import * as THREE from 'three';
import { MyShader } from '../../MyShader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Make sure to import GLTFLoader


const outdoorVertexShader  = await fetch('shaders/billboard.vert').then(r => r.text());
const outdooFragmentShader  = await fetch('shaders/billboard.frag').then(r => r.text());

class MyBillboard extends THREE.Object3D {
    /**
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';

        this.planeGeometry = new THREE.PlaneGeometry(14.8, 6.4,100,100); // Adjust the size as needed

        const loader = new GLTFLoader();
        loader.load(
            'images/billboard_hoarding_free_lowpoly_model_download.glb',
            (gltf) => {
                var model = gltf.scene

                model.position.set(0,0,0)
                model.scale.set(1.2,1.8,1.2)
                this.add(model)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );


        this.updateInterval = setInterval(() => {
            this.update();
        }, 1000); 
    }


    update() {
        if(this.billboardPlane) {
            this.remove(this.billboardPlane)
        }

        const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        renderTarget.texture.minFilter = THREE.NearestFilter;
        renderTarget.texture.magFilter = THREE.NearestFilter;
        renderTarget.stencilBuffer = false;
        renderTarget.depthBuffer = true;
        renderTarget.depthTexture = new THREE.DepthTexture();
        renderTarget.depthTexture.format = THREE.DepthFormat;
        renderTarget.depthTexture.type = THREE.UnsignedShortType;
    
        this.app.getActiveCamera().near = 0.2;
        this.app.getActiveCamera().far = 40;
    
        this.app.renderer.setRenderTarget(renderTarget);
        this.app.renderer.render(this.app.scene, this.app.getActiveCamera());

        this.texture = renderTarget.texture;
        this.depthTexture = renderTarget.depthTexture;

        this.app.renderer.setRenderTarget(null);

        this.outdoorShaderMaterial = new THREE.ShaderMaterial({
            vertexShader: outdoorVertexShader,
            fragmentShader: outdooFragmentShader,
            uniforms: {
                cameraNear: { value: this.app.activeCamera.near },
                cameraFar: { value: this.app.activeCamera.far },
                tDiffuse: { value:  this.texture },
                tDepth: { value: this.depthTexture }
                
            },
        });

        this.billboardPlane = new THREE.Mesh(this.planeGeometry, this.outdoorShaderMaterial)
        this.billboardPlane.translateY(13.3)
        this.billboardPlane.translateZ(0.5)

        this.add(this.billboardPlane)

        this.app.getActiveCamera().near = 0.1;
        this.app.getActiveCamera().far = 500;
    }

}

MyBillboard.prototype.isGroup = true;

export { MyBillboard };