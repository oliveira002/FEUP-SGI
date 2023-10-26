import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app

        // globals
        this.axis = null
        this.fog = null
        this.lights = []
        this.cameras = []
        

        // materials
        this.materialMap = {}
        this.defaultMat = new THREE.MeshBasicMaterial({color: "#FFFFFF"})

        // textures
        this.textureMap = {}

        // objects and primitives
        this.visitedNodes = []
        this.primitives = []
        
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");		
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.initGlobals(data)
        this.initTextures(data)
        this.intiMaterials(data)
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        //console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    initGlobals(data){

        this.fog = new THREE.Fog(data.fog.color.getHex(), data.fog.near, data.fog.far)

        this.initCameras(data)
        this.initLights(data)
        this.initOptions(data)

    }

    initCameras(data){
        
        let orthoDescriptors = data.descriptors["orthogonal"]
        let perspDescriptors = data.descriptors["perspective"]

        let cameras = data.cameras
        Object.keys(cameras).forEach(
            (key) => {
                let camera
                let cameraObj = cameras[key]
                switch(cameraObj.type){
                    case "perspective":
                        const aspect = window.innerWidth / window.innerHeight;
                        camera = new THREE.PerspectiveCamera(
                            cameraObj.angle,
                            aspect,
                            cameraObj.near,
                            cameraObj.far,
                        )
                        break;
                    case "orthogonal":
                        camera = new THREE.OrthographicCamera( 
                            cameraObj.left, 
                            cameraObj.right, 
                            cameraObj.top, 
                            cameraObj.bottom, 
                            cameraObj.near, 
                            cameraObj.far,
                        );
                        break;
                }
                
                camera.position.set(...cameraObj.location)
                this.app.controls.target = new THREE.Vector3(...cameraObj.target)

                if (cameraObj.name = data.activeCameraId){
                    this.app.activeCameraName = data.activeCameraId
                    this.app.activeCamera = camera
                }

                this.app.cameras[cameraObj.id] = camera
                //console.log(camera)
            }
        )
    }

    initLights(data){

        let spotDescriptors = data.descriptors["spotlight"]
        let pointDescriptors = data.descriptors["pointlight"]
        let dirDescriptors = data.descriptors["directionallight"]

    }

    initOptions(data){

        let descriptors = data.descriptors["globals"]

        let options = data.options
        this.app.scene.add( new THREE.AmbientLight( options["ambient"].getHex() ) )
        this.app.scene.background = options["background"]

    }

    initTextures(data){

        let descriptors = data.descriptors["texture"]

        let textures = data.textures
        Object.keys(textures).forEach(
            (key) => {
                let textureObj = textures[key]
                let texture = new THREE.TextureLoader().load(textureObj.filepath)
                texture.name = textureObj.id
                texture.isVideo = textureObj.isVideo ?? descriptors.find(descriptor => descriptor.name === "isVideo").default
                texture.magFilter = textureObj.magFilter ?? THREE.LinearFilter
                texture.minFilter = textureObj.minFilter ?? THREE.LinearMipmapLinearFilter
                texture.generateMipmaps = textureObj.mipmaps ?? descriptors.find(descriptor => descriptor.name === "mipmaps").default
                texture.anisotropy = textureObj.anisotropy ?? descriptors.find(descriptor => descriptor.name === "anisotropy").default
                this.textureMap[textureObj.id] = texture
                //console.log(texture)
            }
        )
        
    }

    intiMaterials(data){

        let descriptors = data.descriptors["material"]

        let materials = data.materials
        Object.keys(materials).forEach(
            (key) => {
                let materialObj = materials[key]
                let material = new THREE.MeshPhongMaterial({
                    name: materialObj.id,
                    color: materialObj.color.getHex(),
                    specular: materialObj.specular.getHex(),
                    emissive: materialObj.emissive.getHex(),
                    shininess: materialObj.shininess,
                    wireframe: materialObj.wireframe ?? descriptors.find(descriptor => descriptor.name === "wireframe").default,
                    flatShading: materialObj.shading ?? descriptors.find(descriptor => descriptor.name === "shading").default === "flat",
                    map: this.textureMap[materialObj.textureref] ?? bump_redescriptors.find(descriptor => descriptor.name === "textureref").default,
                    //texlength_s
                    //texlength_t
                    side: materialObj.twosided ? THREE.DoubleSide : THREE.FrontSide,
                    //bumpMap: this.textureMap[materialObj.bump_ref] ?? descriptors.find(descriptor => descriptor.name === "bump_ref").default,
                    bumpScale: materialObj.bump_scale ?? descriptors.find(descriptor => descriptor.name === "bump_scale").default,
                    
                })
                this.materialMap[materialObj.id] = material
                //console.log(material)
            }
        )
        
    }

    onAfterSceneLoadedAndBeforeRender(data) {
       
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item
        console.log(data)
        let root = data.nodes.scene
        //this.iterateNodes(root, "default", [])
        console.log(this.primitives)
        console.log(this.lights)

        this.output(data.options)
        //console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        //console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        //console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        //console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    //console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        //console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }
    }

    iterateNodes(node, materialID, transformations) {

        if(node.children[0].type === "primitive") {
            node.material = materialID
            this.primitives.push({node,transformations})
            return
        }

        if(node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
            this.lights.push(node)
            return
        }
        
        let curMaterial = node.materialIds[0]
        let curTransformation = node.transformations
        
        if(!curTransformation) {
            curTransformation = []
        }

        let res = transformations.concat(curTransformation)

        if(!curMaterial) {
            curMaterial = materialID
        }

        this.visitedNodes.push(node.id)
        //console.log("Visited:", node.id)

        let children = node.children

        children.forEach(neighbor => {
            if(!this.visitedNodes.includes(neighbor.id)) {
                this.iterateNodes(neighbor,curMaterial,res)
            }
        });
    }

    update() {
        
    }
}

export { MyContents };