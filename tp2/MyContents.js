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
        this.threeConstants = {
            "LinearMipmapLinearFilter": THREE.LinearMipmapLinearFilter,
            "LinearFilter": THREE.LinearFilter
        }
        
        // materials
        this.materialMap = {}
        this.defaultMat = new THREE.MeshBasicMaterial({color: "#FFFFFF"})

        // textures
        this.textureMap = {}

        // objects and primitives
        this.visitedNodes = new Set()
        this.group = []
        this.groupi = new THREE.Group()
        
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        //this.reader.open("scenes/demo/demo.xml");
		this.reader.open("scenes/SGI_TP2_XML_T03_G02/SGI_TP2_XML_T03_G02_v01.xml");
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
        console.log(data)
        
        this.initGlobals(data)
        this.initTextures(data)
        this.intiMaterials(data)
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        //console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    initGlobals(data){

        if(data.fog!==null)
            this.fog = new THREE.Fog(data.fog.color.getHex(), data.fog.near, data.fog.far)

        //this.initCameras(data)
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

    initOptions(data){

        let descriptors = data.descriptors["globals"]

        let options = data.options
        this.app.scene.add( new THREE.AmbientLight( options["ambient"].getHex(THREE.LinearSRGBColorSpace)) )
        this.app.scene.background = new THREE.Color(options["background"].getHex(THREE.LinearSRGBColorSpace))

    }

    initTextures(data){

        let descriptors = data.descriptors["texture"]

        let textures = data.textures
        Object.keys(textures).forEach(
            (key) => {
                let textureObj = textures[key]
                let texture = new THREE.TextureLoader().load(textureObj.filepath)
                texture.name = textureObj.id
                texture.isVideo = textureObj.isVideo //?? descriptors.find(descriptor => descriptor.name === "isVideo").default
                texture.magFilter = this.threeConstants[textureObj.magFilter]
                texture.minFilter = this.threeConstants[textureObj.minFilter] 
                texture.generateMipmaps = textureObj.mipmaps //?? descriptors.find(descriptor => descriptor.name === "mipmaps").default
                texture.anisotropy = textureObj.anisotropy //?? descriptors.find(descriptor => descriptor.name === "anisotropy").default
                texture.wrapS = THREE.RepeatWrapping
                texture.wrapT = THREE.RepeatWrapping
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
                let texture = this.textureMap[materialObj.textureref]
                let material = new THREE.MeshPhongMaterial({
                    name: materialObj.id,
                    color: materialObj.color.getHex(),
                    specular: materialObj.specular.getHex(),
                    emissive: materialObj.emissive.getHex(),
                    shininess: materialObj.shininess,
                    wireframe: materialObj.wireframe, //?? descriptors.find(descriptor => descriptor.name === "wireframe").default,
                    flatShading: materialObj.shading, //?? descriptors.find(descriptor => descriptor.name === "shading").default === "flat",
                    map: texture, //?? descriptors.find(descriptor => descriptor.name === "textureref").default,
                    side: materialObj.twosided ? THREE.DoubleSide : THREE.FrontSide,
                    bumpMap: this.textureMap[materialObj.bumpref], //?? descriptors.find(descriptor => descriptor.name === "bump_ref").default,
                    bumpScale: materialObj.bumpscale, //?? descriptors.find(descriptor => descriptor.name === "bump_scale").default,
                    
                })
                this.materialMap[materialObj.id] = material
                //console.log(material)
            }
        )
        
    }

    onAfterSceneLoadedAndBeforeRender(data) {
       
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item
        let root = data.nodes.scene
        
        this.iterateNodes(root,this.groupi,["def"])
        console.log(this.lights)
        this.app.scene.add(this.groupi);
        console.log(root)
  

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

    iterateNodes(node, parentGroup, defaultMaterial) {
        if(node.type === "spotlight" || node.type === "pointlight" || node.type === "directionallight") {
            return
        }

        if(node.type === "primitive") {
            return
        }

        this.visitedNodes.add(node.id)
        //console.log("Visited:", node.id)

        let children = node.children

        children.forEach(child => {
            let cur = new THREE.Group();


            if (child.type === "spotlight" || child.type === "pointlight" || child.type === "directionallight") {
                // Handle lights
                this.dealWithLights(child);
            } else if (child.type === "primitive" && child.subtype != "nurbs") {
                // Handle primitives
                let mesh = this.dealWithPrimitive(child, node.materialIds);
                cur.add(mesh);
            } 
            else if(child.type === "primitive" && child.subtype == "nurbs") {
                return
            }
            else if(child.type === "lod") {
                return
            }
            else {
                if(child.materialIds.length === 0) {
                    child.materialIds = (node.materialIds.length === 0) ? defaultMaterial : node.materialIds
                }
                // Recursively iterate for non-light and non-primitive nodes
                this.iterateNodes(child, cur, defaultMaterial);
            }
    
            parentGroup.add(cur);
        });
    
        this.dealWithTransformations(node.transformations, parentGroup);
    }

    dealWithPrimitive(node, material) {
        let mat = this.materialMap[material[0]]
        //mat = new THREE.MeshPhongMaterial({ color: "#FFFFFF", specular: "#FFFFFF",  emissive: "#FFFFFF", side: THREE.DoubleSide})
        switch(node.subtype) {
            case "rectangle": {
                // metrics
                let metrics = node.representations[0]
                let width = Math.abs(metrics.xy1[0] - metrics.xy2[0])
                let height = Math.abs(metrics.xy1[1] - metrics.xy2[1])

                let center = [metrics.xy1[0] + width/2, metrics.xy1[1] + height/2]
                let deltaX = center[0]
                let deltaY = center[1]


                let prim = new THREE.PlaneGeometry(width,height,metrics.parts_x,metrics.parts_y)
                let mesh = new THREE.Mesh(prim, mat)
                mesh.receiveShadow = true
                mesh.castShadow = true
                
                mesh.translateX(deltaX)
                mesh.translateY(deltaY)

                return mesh
            }
            
            case "triangle":{
                return
            }
            case "cylinder":{
                // metrics
                let metrics = node.representations[0]
                let base = metrics.base
                let top = metrics.top
                let height = metrics.height
                let stacks = metrics.stacks
                let slices = metrics.slices
                let thetaLength = metrics.thetalength
                let thetaStart = metrics.thetastart
                let capsClosed = metrics.capsclosed

                let prim = new THREE.CylinderGeometry(top,base,height,slices,stacks,capsClosed,thetaStart,thetaLength)
                let mesh = new THREE.Mesh(prim, mat)
                mesh.receiveShadow = true
                mesh.castShadow = true

                return mesh
            }
            case "sphere": {
                let metrics = node.representations[0]

                let prim = new THREE.SphereGeometry(
                    metrics.radius,
                    metrics.slices,
                    metrics.stacks,
                    metrics.phistart,
                    metrics.philength,
                    metrics.thetastart,
                    metrics.thetalength
                )

                let mesh = new THREE.Mesh(prim, mat)
                mesh.receiveShadow = true
                mesh.castShadow = true

                return mesh
            }
            case "nurbs": {
                return
            }
            case "box": {
                // metrics
                let metrics = node.representations[0]
                let width = Math.abs(metrics.xyz1[0] - metrics.xyz2[0])
                let height = Math.abs(metrics.xyz1[1] - metrics.xyz2[1])
                let depth = Math.abs(metrics.xyz1[2] - metrics.xyz2[2])

                let center = [metrics.xyz1[0] + width/2, metrics.xyz1[1] + height/2, metrics.xyz1[2] + depth/2]
                let deltaX = center[0]
                let deltaY = center[1]
                let deltaZ = center[2]

                let widthSeg = metrics.parts_x
                let heightSeg = metrics.parts_y
                let depthSeg = metrics.parts_z

                let prim = new THREE.BoxGeometry(width,height,depth,widthSeg,heightSeg,depthSeg)
                let mesh = new THREE.Mesh(prim, mat)
                mesh.receiveShadow = true
                mesh.castShadow = true

                mesh.translateX(deltaX)
                mesh.translateY(deltaY)
                mesh.translateZ(deltaZ)

                return mesh
            }
            case "sphere": {
                let metrics = node.representations[0]

                let prim = new THREE.SphereGeometry(
                    metrics.radius,
                    metrics.slices,
                    metrics.stacks,
                    metrics.phistart,
                    metrics.philength,
                    metrica.thetastart,
                    metrics.thetalength
                )
                
                let mesh = new THREE.Mesh(prim, mat)
                mesh.receiveShadow = true
                mesh.castShadow = true

                return mesh
            }
        }
    }

    dealWithLights(node) {

        switch (node.type) {
            case "pointlight": {
                const light = new THREE.PointLight(
                    node.color.getHex(THREE.LinearSRGBColorSpace), 
                    node.intensity, 
                    node.distance, 
                    node.decay
                );
                light.name = node.id
                
                light.position.set(...(node.position));
                light.castShadow = node.castshadow
                light.shadow.camera.far = node.shadowfar
                light.shadow.mapSize.width = node.shadowmapsize
                light.shadow.mapSize.height = node.shadowmapsize
                this.lights[node.id] = light
            
                const lightHelper = new THREE.PointLightHelper(light,"#FFFFFF")
                
                if(node.enabled){
                    this.app.scene.add(light)
                    this.app.scene.add(lightHelper)
                }

                return;
            }
            case "spotlight": {
                let light = new THREE.SpotLight( 
                    node.color.getHex(THREE.LinearSRGBColorSpace), 
                    node.intensity, 
                    node.distance, 
                    this.degrees_to_radians(node.angle), 
                    node.penumbra, 
                    node.decay
                );
                light.name = node.id

                let targetGeo = new THREE.PlaneGeometry(0.001, 0.001)
                let targetMat = new THREE.MeshBasicMaterial({transparent:true})
                let target = new THREE.Mesh(targetGeo, targetMat)
                target.position.set(...(node.target))
                light.target = target

                light.position.set(...(node.position));
                light.castShadow = node.castshadow
                light.shadow.camera.far = node.shadowfar
                light.shadow.mapSize.width = node.shadowmapsize
                light.shadow.mapSize.height = node.shadowmapsize
                this.lights[node.id] = light
                
                const lightHelper = new THREE.SpotLightHelper(light,"#FFFFFF")
                
                if(node.enabled){
                    this.app.scene.add(light)
                    this.app.scene.add(lightHelper)
                }

                return;
            }
            case "directionallight": {
                let light = new THREE.DirectionalLight( 
                    node.color.getHex(THREE.LinearSRGBColorSpace), 
                    node.intensity
                );
                light.name = node.id

                /*let targetGeo = new THREE.PlaneGeometry(0.01, 0.01)
                let targetMat = new THREE.MeshBasicMaterial({transparent:true})
                let target = new THREE.Mesh(targetGeo, targetMat)
                target.position.set(...(node.target))
                light.target = target*/

                light.position.set(...(node.position));
                light.castShadow = node.castshadow
                light.shadow.camera.left = node.shadowleft
                light.shadow.camera.right = node.shadowright
                light.shadow.camera.bottom = node.shadowbottom
                light.shadow.camera.top = node.shadowtop
                light.shadow.camera.far = node.shadowfar
                light.shadow.mapSize.width = node.shadowmapsize
                light.shadow.mapSize.height = node.shadowmapsize
                this.lights[node.id] = light
                
                const lightHelper = new THREE.DirectionalLightHelper(light,"#FFFFFF")
                
                if(node.enabled){
                    this.app.scene.add(light)
                    this.app.scene.add(lightHelper)
                }

                return;
            }
            default:
                return;
        }
    }

    degrees_to_radians(degrees){
        var pi = Math.PI;
        return degrees * (pi/180);
    }

    dealWithTransformations(transformations,group) {
        var pi = Math.PI;
        transformations.forEach(operation => {
           switch(operation.type) {
                case "T": {
                    group.translateX(operation.translate[0])
                    group.translateY(operation.translate[1])
                    group.translateZ(operation.translate[2])
                    break;
                }

                case "R": {
                    group.rotateX(operation.rotation[0] * (pi/180))
                    group.rotateY(operation.rotation[1] * (pi/180))
                    group.rotateZ(operation.rotation[2] * (pi/180))
                    break;
                }

                case "S": {
                    group.scale.set(operation.scale[0],operation.scale[1],operation.scale[2])
                    break;
                }
           }
        });
    }



    update() {
        
    }
}

export { MyContents };