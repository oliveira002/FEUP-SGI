import * as THREE from "three";
import { MyAxis } from "./objects/gui/MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MyNurbsBuilder } from "./builders/MyNurbsBuilder.js";
/**
 *  This class contains the contents of out application
 */
class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */
  constructor(app) {
    this.app = app;
    this.builder = new MyNurbsBuilder();
    this.polygonMaterialNr = 1;
    this.helpersOn = false;
    this.controlPtsOn = false;

    // Globals
    this.axis = null;
    this.root = null;
    this.fog = null;
    this.skyBox = null;
    this.sceneGroup = null;
    this.THREEConstants = {
      NearestFilter: THREE.NearestFilter,
      NearestMipmapNearestFilter: THREE.NearestMipmapNearestFilter,
      NearestMipmapLinearFilter: THREE.NearestMipmapLinearFilter,
      LinearFilter: THREE.LinearFilter,
      LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
      LinearMipmapLinearFilter: THREE.LinearMipmapLinearFilter,
    };
    this.options = {
      minFilters: {
        NearestFilter: THREE.NearestFilter,
        NearestMipMapLinearFilter: THREE.NearestMipMapLinearFilter,
        NearestMipMapNearestFilter: THREE.NearestMipMapNearestFilter,
        "LinearFilter ": THREE.LinearFilter,
        "LinearMipMapLinearFilter (Default)": THREE.LinearMipMapLinearFilter,
        LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
      },
      magFilters: {
        NearestFilter: THREE.NearestFilter,
        "LinearFilter (Default)": THREE.LinearFilter,
      },
    };
    this.lightTypes = ["spotlight", "pointlight", "directionallight"];
    this.lights = [];
    this.helpers = [];

    // Materials
    this.materialMap = {
      default: new THREE.MeshBasicMaterial({ color: "#FFFFFF" }),
    };

    // Textures
    this.textureMap = [];

    // Objects and Primitives
    this.nurbsPoints = [];

    this.reader = new MyFileReader(app, this, this.onSceneLoaded);
    this.reader.open("scene/scene.xml");
    //this.reader.open("SGI_TP2_XML_T03_G02/scene.xml");
  }

  /**
   * initializes the contents
   */
  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }
  }

  /**
   * Called when the scene xml file load is complete
   * @param {MySceneData} data the entire scene data object
   */
  onSceneLoaded(data) {
    console.info(
      "scene data loaded " +
        data +
        ". visit MySceneData javascript class to check contents for each data item."
    );
    this.buildScene(data);
  }

  // Builds the scene
  buildScene(data) {
    this.initGlobals(data);
    this.initCameras(data);
    this.initTextures(data);
    this.initMaterials(data);
    this.initSceneGraph(data);
    this.displayHelpers();
  }

  // Initializes all the global scene objects
  initGlobals(data) {
    let options = data.options;
    let fog = data.fog;
    let skybox = data.skyboxes;

    this.initOptions(options);
    this.initFog(fog);
    this.initSkybox(skybox);
  }

  // Initializes the ambient light and background objects
  initOptions(options) {
    let ambientLight = new THREE.AmbientLight(
      options.ambient.getHex(THREE.LinearSRGBColorSpace)
    );
    this.app.scene.add(ambientLight);
    this.lights["ambientLight"] = ambientLight;

    this.app.scene.background = new THREE.Color(
      options.background.getHex(THREE.LinearSRGBColorSpace)
    );
  }

  // Initializes the fog object
  initFog(fog) {
    if (fog !== null)
      this.fog = new THREE.Fog(fog.color.getHex(), fog.near, fog.far);
    this.app.scene.fog = this.fog;
  }

  // Initializes the skybox objects
  initSkybox(skybox) {
    if (skybox !== null && skybox.length !== 0) {
      let skyboxInfo = skybox.default;

      let rightTex = new THREE.TextureLoader().load(skyboxInfo.right);
      let leftTex = new THREE.TextureLoader().load(skyboxInfo.left);
      let upTex = new THREE.TextureLoader().load(skyboxInfo.up);
      let downTex = new THREE.TextureLoader().load(skyboxInfo.down);
      let frontTex = new THREE.TextureLoader().load(skyboxInfo.front);
      let backTex = new THREE.TextureLoader().load(skyboxInfo.back);

      let materials = [
        new THREE.MeshPhongMaterial({
          emissive: skyboxInfo.emissive,
          emissiveIntensity: skyboxInfo.intensity,
          map: rightTex,
          side: THREE.BackSide,
        }),
        new THREE.MeshPhongMaterial({
          emissive: skyboxInfo.emissive,
          emissiveIntensity: skyboxInfo.intensity,
          map: leftTex,
          side: THREE.BackSide,
        }),
        new THREE.MeshPhongMaterial({
          emissive: skyboxInfo.emissive,
          emissiveIntensity: skyboxInfo.intensity,
          map: upTex,
          side: THREE.BackSide,
        }),
        new THREE.MeshPhongMaterial({
          emissive: skyboxInfo.emissive,
          emissiveIntensity: skyboxInfo.intensity,
          map: downTex,
          side: THREE.BackSide,
        }),
        new THREE.MeshPhongMaterial({
          emissive: skyboxInfo.emissive,
          emissiveIntensity: skyboxInfo.intensity,
          map: frontTex,
          side: THREE.BackSide,
        }),
        new THREE.MeshPhongMaterial({
          emissive: skyboxInfo.emissive,
          emissiveIntensity: skyboxInfo.intensity,
          map: backTex,
          side: THREE.BackSide,
        }),
      ];

      let skyboxGeometry = new THREE.BoxGeometry(...skyboxInfo.size);
      this.skyBox = new THREE.Mesh(skyboxGeometry, materials);
      this.skyBox.position.set(...skyboxInfo.center);

      this.app.scene.add(this.skyBox);
    }
  }

  // Initializes the cameras
  initCameras(data) {
    let cameras = data.cameras;

    Object.keys(cameras).forEach((key) => {
      let cameraObj = cameras[key];
      let camera =
        cameraObj.type === "perspective"
          ? this.buildPerspCamera(cameraObj)
          : this.buildOrthoCamera(cameraObj);

      camera.position.set(...cameraObj.location);
      //this.app.controls.target = new THREE.Vector3(...cameraObj.target)

      if ((cameraObj.name = data.activeCameraId)) {
        this.app.activeCameraName = data.activeCameraId;
        this.app.activeCamera = camera;
      }

      this.app.cameras[cameraObj.id] = camera;
      this.app.targets[cameraObj.id] = new THREE.Vector3(...cameraObj.target);
    });
  }

  // Builds and returns a perspective camera based on the XML specification
  buildPerspCamera(cameraXMLObj) {
    const aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.PerspectiveCamera(
      cameraXMLObj.angle,
      aspect,
      cameraXMLObj.near,
      cameraXMLObj.far
    );

    return camera;
  }

  // Builds and returns an orthographic camera based on the XML specification
  buildOrthoCamera(cameraXMLObj) {
    let camera = new THREE.OrthographicCamera(
      cameraXMLObj.left,
      cameraXMLObj.right,
      cameraXMLObj.top,
      cameraXMLObj.bottom,
      cameraXMLObj.near,
      cameraXMLObj.far
    );

    return camera;
  }

  // Initializes the textures
  initTextures(data) {
    let textures = data.textures;

    Object.keys(textures).forEach((key) => {
      let textureObj = textures[key];
      let texture;

      if (textureObj.isVideo) {
        var videoElement = document.createElement("video");
        videoElement.loop = true;
        videoElement.id = textureObj.id;
        videoElement.muted = true;
        videoElement.autoplay = true;
        videoElement.style.display = "none";
        videoElement.play();

        var sourceElement = document.createElement("source");
        sourceElement.src = textureObj.filepath;
        videoElement.appendChild(sourceElement);

        var containerElement = document.body;
        containerElement.appendChild(videoElement);

        texture = new THREE.VideoTexture(videoElement);
      } else {
        texture = new THREE.TextureLoader().load(textureObj.filepath);
      }

      texture.name = textureObj.id;
      texture.isVideo = textureObj.isVideo;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.generateMipmaps = textureObj.mipmaps;
      texture.anisotropy = textureObj.anisotropy;

      if (!textureObj.mipmaps) {
        for (let i = 0; i <= 7; i++) {
          let mipmapPath = textureObj["mipmap" + i];

          if (mipmapPath === null) continue;

          this.loadMipmap(texture, i, mipmapPath);
        }

        texture.needsUpdate = true;
      } else {
        texture.magFilter = this.THREEConstants[textureObj.magFilter];
        texture.minFilter = this.THREEConstants[textureObj.minFilter];
      }

      this.textureMap[textureObj.id] = texture;
    });
  }

  /**
   * load an image and create a mipmap to be added to a texture at the defined level.
   *
   * @param {*} parentTexture the texture to which the mipmap is added
   * @param {*} level the level of the mipmap
   * @param {*} path the path for the mipmap image
   */
  loadMipmap(parentTexture, level, path) {
    // load texture. On loaded call the function to create the mipmap for the specified level
    new THREE.TextureLoader().load(
      path,
      function (
        mipmapTexture // onLoad callback
      ) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.scale(1, 1);

        // const fontSize = 48
        const img = mipmapTexture.image;
        canvas.width = img.width;
        canvas.height = img.height;

        // first draw the image
        ctx.drawImage(img, 0, 0);

        // set the mipmap image in the parent texture in the appropriate level
        parentTexture.mipmaps[level] = canvas;
      },
      undefined, // onProgress callback currently not supported
      function (err) {
        console.error(
          "Unable to load the image " +
            path +
            " as mipmap level " +
            level +
            ".",
          err
        );
      }
    );
  }

  // Initializes the materials
  initMaterials(data) {
    let materials = data.materials;

    Object.keys(materials).forEach((key) => {
      let materialObj = materials[key];

      let material = new THREE.MeshPhongMaterial({
        name: materialObj.id,
        color: materialObj.color.getHex(),
        specular: materialObj.specular.getHex(),
        transparent: materialObj.color.a < 1,
        alphaTest: 0.5,
        opacity: materialObj.color.a,
        emissive: materialObj.emissive.getHex(),
        shininess: materialObj.shininess,
        wireframe: materialObj.wireframe,
        flatShading: materialObj.shading === "flat",
        side: materialObj.twosided ? THREE.DoubleSide : THREE.FrontSide,
      });

      if (materialObj.textureref) {
        let texture = this.textureMap[materialObj.textureref];
        material.map = texture;
        material.userData = [materialObj.texlength_s, materialObj.texlength_t];
      }

      if (this.textureMap[materialObj.bumpref]) {
        material.bumpMap = this.textureMap[materialObj.bumpref];
        material.bumpScale = materialObj.bumpscale;
      }

      if (this.textureMap[materialObj.specularref]) {
        material.specularMap = this.textureMap[materialObj.specularref];
      }

      this.materialMap[materialObj.id] = material;
    });
  }

  // Initializes the scene graph
  initSceneGraph(data) {
    let rootId = data.rootId;
    this.root = data.nodes[rootId];

    this.sceneGroup = this.iterateNodes(
      this.root,
      "default",
      this.root.castShadows,
      this.root.receiveShadows,
      false
    );
    this.app.scene.add(this.sceneGroup);
  }

  // Recursively iterates over a node and its children
  iterateNodes(node, materialID, castShadows, receiveShadows, isLod) {
    let group = isLod ? new THREE.LOD() : new THREE.Group();

    if (node.type === "node")
      materialID =
        node.materialIds !== undefined && node.materialIds.length > 0
          ? node.materialIds[0]
          : materialID;

    if (!castShadows) {
      castShadows = node.castShadows;
    }

    if (!receiveShadows) {
      receiveShadows = node.receiveShadows;
    }

    let children = node.type !== "lodnoderef" ? node.children : [node.node];

    children.forEach((child) => {
      let object;

      // Child is a light
      if (this.lightTypes.includes(child.type)) {
        object = this.dealWithLight(child);
      }
      // Child is a primitive
      else if (child.type === "primitive") {
        object = this.dealWithPrimitive(
          child,
          materialID,
          castShadows,
          receiveShadows
        );
      }
      // Child is a node or a LOD
      else {
        object = this.iterateNodes(
          child,
          materialID,
          castShadows,
          receiveShadows,
          child.type === "lod"
        );
      }

      if (isLod) group.addLevel(object, parseInt(child.mindist));
      else group.add(object);
    });

    if (node.transformations)
      this.dealWithTransformations(group, node.transformations);

    return group;
  }

  // Creates a light object
  dealWithLight(node) {
    let light = null;

    switch (node.type) {
      case "pointlight":
        light = new THREE.PointLight(
          node.color.getHex(THREE.LinearSRGBColorSpace),
          node.intensity,
          node.distance,
          node.decay
        );
        break;
      case "spotlight":
        light = new THREE.SpotLight(
          node.color.getHex(THREE.LinearSRGBColorSpace),
          node.intensity,
          node.distance,
          node.angle,
          node.penumbra,
          node.decay
        );

        light.target.position.set(...node.target);
        this.app.scene.add(light.target);

        break;
      case "directionallight":
        light = new THREE.DirectionalLight(
          node.color.getHex(THREE.LinearSRGBColorSpace),
          node.intensity
        );

        light.shadow.camera.left = node.shadowleft;
        light.shadow.camera.right = node.shadowright;
        light.shadow.camera.bottom = node.shadowbottom;
        light.shadow.camera.top = node.shadowtop;

        break;
      default:
        light = null;
        break;
    }

    light.name = node.id;
    light.position.set(...node.position);
    light.visible = node.enabled;
    light.castShadow = node.castshadow;
    light.shadow.camera.far = node.shadowfar;
    light.shadow.mapSize.width = node.shadowmapsize;
    light.shadow.mapSize.height = node.shadowmapsize;
    this.lights[node.id] = light;

    return light;
  }

  // Creates a primitive object
  dealWithPrimitive(node, materialID, castShadow, receiveShadow) {
    let primitiveFuncMap = {
      cylinder: this.buildCylinder.bind(this),
      rectangle: this.buildRectangle.bind(this),
      triangle: this.buildTriangle.bind(this),
      sphere: this.buildSphere.bind(this),
      nurbs: this.buildNurbs.bind(this),
      box: this.buildBox.bind(this),
      model3d: this.buildModel3D.bind(this),
      polygon: this.buildPolygon.bind(this),
    };

    let mat = this.materialMap[materialID];

    let mesh = primitiveFuncMap[node.subtype](node.representations[0], mat);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;

    return mesh;
  }

  buildCylinder(representation, material) {
    let cyl = new THREE.CylinderGeometry(
      representation.top,
      representation.base,
      representation.height,
      representation.slices,
      representation.stacks,
      !representation.capsclose,
      this.degToRad(representation.thetastart),
      this.degToRad(representation.thetalength)
    );

    let texture = material.map;
    if (texture) {
      let [texlength_s, texlength_t] = material.userData;
      texture.repeat.set(texlength_s, texlength_t);
    }

    let mesh = new THREE.Mesh(cyl, material);

    return mesh;
  }

  buildRectangle(representation, material) {
    let width = Math.abs(representation.xy1[0] - representation.xy2[0]);
    let height = Math.abs(representation.xy1[1] - representation.xy2[1]);

    let center = [
      Math.min(representation.xy1[0], representation.xy2[0]) + width / 2,
      Math.min(representation.xy1[1], representation.xy2[1]) + height / 2,
    ];
    let deltaX = center[0];
    let deltaY = center[1];

    let rect = new THREE.PlaneGeometry(
      width,
      height,
      representation.parts_x,
      representation.parts_y
    );

    let texture = material.map;
    if (texture) {
      let [texlength_s, texlength_t] = material.userData;
      texture.repeat.set(width / texlength_s, height / texlength_t);
    }

    let mesh = new THREE.Mesh(rect, material);

    mesh.translateX(deltaX);
    mesh.translateY(deltaY);

    return mesh;
  }

  buildTriangle(representation, material) {
    let geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array([
      ...representation.xyz1,
      ...representation.xyz2,
      ...representation.xyz3,
    ]);

    let indices = [0, 1, 2, 2, 1, 0];

    // a = dist(V1V2)
    let a = Math.sqrt(
      Math.pow(representation.xyz2[0] - representation.xyz1[0], 2) +
        Math.pow(representation.xyz2[1] - representation.xyz1[1], 2) +
        Math.pow(representation.xyz2[2] - representation.xyz1[2], 2)
    );

    // b = dist(V2V3)
    let b = Math.sqrt(
      Math.pow(representation.xyz3[0] - representation.xyz2[0], 2) +
        Math.pow(representation.xyz3[1] - representation.xyz2[1], 2) +
        Math.pow(representation.xyz3[2] - representation.xyz2[2], 2)
    );

    // c = dist(V3V1)
    let c = Math.sqrt(
      Math.pow(representation.xyz1[0] - representation.xyz3[0], 2) +
        Math.pow(representation.xyz1[1] - representation.xyz3[1], 2) +
        Math.pow(representation.xyz1[2] - representation.xyz3[2], 2)
    );

    let cos = (Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
    let sin = Math.sqrt(1 - Math.pow(cos, 2));

    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    geometry.computeVertexNormals();

    let texture = material.map;
    if (texture) {
      let [texlength_s, texlength_t] = material.userData;
      let uv = new Float32Array([
        0,
        0,
        a / texlength_s,
        0,
        (c * cos) / texlength_s,
        (c * sin) / texlength_t,
      ]);
      geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      geometry.uvsNeedUpdate = true;
    }

    let mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }

  buildSphere(representation, material) {
    let sphere = new THREE.SphereGeometry(
      representation.radius,
      representation.slices,
      representation.stacks,
      this.degToRad(representation.phistart),
      this.degToRad(representation.philength),
      this.degToRad(representation.thetastart),
      this.degToRad(representation.thetalength)
    );

    let texture = material.map;
    if (texture) {
      let [texlength_s, texlength_t] = material.userData;
      texture.repeat.set(texlength_s, texlength_t);
    }

    let mesh = new THREE.Mesh(sphere, material);

    return mesh;
  }

  buildNurbs(representation, material) {
    let samplesU = representation.parts_u;
    let samplesV = representation.parts_v;
    let orderU = representation.degree_u;
    let orderV = representation.degree_v;
    let controlpoints = representation.controlpoints;

    let geoPoints = [];
    let k = 0;
    for (let i = 0; i <= orderU; i++) {
      let pointsU = [];
      for (let j = 0; j <= orderV; j++, k++) {
        pointsU.push([
          controlpoints[k].xx,
          controlpoints[k].yy,
          controlpoints[k].zz,
        ]);
      }
      geoPoints.push(pointsU);
    }

    let texture = material.map;
    if (texture) {
      let [texlength_s, texlength_t] = material.userData;
      texture.repeat.set(texlength_s, texlength_t);
    }

    let surfaceData = this.builder.build(
      geoPoints,
      orderU,
      orderV,
      samplesU,
      samplesV,
      material
    );
    let mesh = new THREE.Mesh(surfaceData, material);

    let group = new THREE.Group();
    group.add(mesh);

    if (this.controlPtsOn) {
      group.add(this.getControlPointObjects(geoPoints));
    }

    return group;
  }

  buildBox(representation, material) {
    let width = Math.abs(representation.xyz1[0] - representation.xyz2[0]);
    let height = Math.abs(representation.xyz1[1] - representation.xyz2[1]);
    let depth = Math.abs(representation.xyz1[2] - representation.xyz2[2]);

    let center = [
      Math.min(representation.xyz1[0], representation.xyz2[0]) + width / 2,
      Math.min(representation.xyz1[1], representation.xyz2[1]) + height / 2,
      Math.min(representation.xyz1[2], representation.xyz2[2]) + depth / 2,
    ];
    let deltaX = center[0];
    let deltaY = center[1];
    let deltaZ = center[2];

    let widthSeg = representation.parts_x;
    let heightSeg = representation.parts_y;
    let depthSeg = representation.parts_z;

    let prim = new THREE.BoxGeometry(
      width,
      height,
      depth,
      widthSeg,
      heightSeg,
      depthSeg
    );

    let texture = material.map;
    if (texture) {
      let [texlength_s, texlength_t] = material.userData;
      texture.repeat.set(width / texlength_s, height / texlength_t);
    }

    let mesh = new THREE.Mesh(prim, material);

    mesh.translateX(deltaX);
    mesh.translateY(deltaY);
    mesh.translateZ(deltaZ);

    return mesh;
  }

  // TODO
  buildModel3D(representation, material) {}

  buildPolygon(representation, material) {
    let stacks = representation.stacks;
    let slices = representation.slices;
    let radius = representation.radius;
    let centerColor = new THREE.Color(representation.color_c);
    let outerColor = new THREE.Color(representation.color_p);
    let centerOpacity = representation.color_c.a;
    let outerOpacity = representation.color_p.a;
    let opacityDelta = outerOpacity - centerOpacity;

    const geometry = new THREE.BufferGeometry();

    const vertices = [];
    const indices = [];
    const colors = [];

    function addVertex(radius, angle) {
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      vertices.push(x, y, 0);
    }

    function getAngle(slice) {
      return (slice / slices) * Math.PI * 2;
    }

    function getRadius(stack) {
      return (stack / stacks) * radius;
    }

    let index = 0;
    for (let stack = 0; stack < stacks; stack++) {
      for (let slice = 0; slice < slices; slice++) {
        const i = stack / stacks;
        const vertexColor = new THREE.Color().lerpColors(
          centerColor,
          outerColor,
          i
        );
        const vertexOpacity = i * opacityDelta + centerOpacity;

        if (stack == 0) {
          addVertex(0, getAngle(slice));
          addVertex(getRadius(1), getAngle(slice));
          addVertex(getRadius(1), getAngle(slice + 1));
          indices.push(index++, index++, index++);
          colors.push(
            ...vertexColor,
            vertexOpacity,
            ...vertexColor,
            vertexOpacity,
            ...vertexColor,
            vertexOpacity
          );
        } else {
          addVertex(getRadius(stack), getAngle(slice));
          addVertex(getRadius(stack + 1), getAngle(slice));
          addVertex(getRadius(stack + 1), getAngle(slice + 1));
          indices.push(index++, index++, index++);
          colors.push(
            ...vertexColor,
            vertexOpacity,
            ...vertexColor,
            vertexOpacity,
            ...vertexColor,
            vertexOpacity
          );
          addVertex(getRadius(stack), getAngle(slice));
          addVertex(getRadius(stack + 1), getAngle(slice + 1));
          addVertex(getRadius(stack), getAngle(slice + 1));
          indices.push(index++, index++, index++);
          colors.push(
            ...vertexColor,
            vertexOpacity,
            ...vertexColor,
            vertexOpacity,
            ...vertexColor,
            vertexOpacity
          );
        }
      }
    }

    // Convert the arrays into typed arrays
    const verticesArray = new Float32Array(vertices);
    const indicesArray = new Uint32Array(indices);
    const colorsArray = new Float32Array(colors);

    // Set the vertices and indices to the geometry
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(verticesArray, 3)
    );
    geometry.setIndex(new THREE.BufferAttribute(indicesArray, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 4));

    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();

    let wireframe = material.wireframe;

    material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      transparent: true,
      wireframe: wireframe,
    });

    this.materialMap["polygon " + this.polygonMaterialNr++] = material;

    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }

  dealWithTransformations(object, transformations) {
    transformations.forEach((operation) => {
      switch (operation.type) {
        case "T":
          object.translateX(operation.translate[0]);
          object.translateY(operation.translate[1]);
          object.translateZ(operation.translate[2]);
          break;
        case "R":
          object.rotateX(this.degToRad(operation.rotation[0]));
          object.rotateY(this.degToRad(operation.rotation[1]));
          object.rotateZ(this.degToRad(operation.rotation[2]));
          break;
        case "S":
          object.scale.set(...operation.scale);
          break;
      }
    });
  }

  displayHelpers() {
    if (this.helpersOn) {
      Object.keys(this.lights).forEach((key) => {
        let light = this.lights[key];
        let helper;

        switch (light.type) {
          case "PointLight":
            helper = new THREE.PointLightHelper(light);
            break;
          case "SpotLight":
            helper = new THREE.SpotLightHelper(light);
            break;
          case "DirectionalLight":
            helper = new THREE.DirectionalLightHelper(light);
            break;
        }

        this.app.scene.add(helper);
        this.helpers.push(helper);
      });
    } else {
      this.helpers.forEach((helper) => {
        this.app.scene.remove(helper);
        helper.dispose(); // Dispose the helper to free up resources
      });

      this.helpers = []; // Clear the array
    }
  }

  getControlPointObjects(controlPoints) {
    let group = new THREE.Group();

    let sphereGeometry = new THREE.SphereGeometry(0.07, 20, 20);

    let colorOffset = 0x00;
    for (let i = 0; i < controlPoints.length; i++) {
      let row = controlPoints[i];
      let sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000 + colorOffset,
      });

      for (let j = 0; j < row.length; j++) {
        let point = row[j];
        let controlPoint = new THREE.Mesh(sphereGeometry, sphereMaterial);
        controlPoint.position.set(...point);
        group.add(controlPoint);
      }
      colorOffset += 0x00ffff / controlPoints.length;
    }

    return group;
  }

  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  update() {}
}

export { MyContents };
