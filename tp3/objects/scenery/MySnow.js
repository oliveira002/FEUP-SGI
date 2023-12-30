import * as THREE from 'three';

class MySnow extends THREE.Object3D {
  constructor(app, scene) {
    super();
    this.app = app;
    this.scene = scene;
    this.snowList = [];
    this.angle = 0;

    var length = 100; // Increase the number of particles
    var planeSize = 20;

    var geometry = new THREE.BufferGeometry();

    var materials = [];

    var textureLoader = new THREE.TextureLoader();
    var sprite1 = textureLoader.load('https://dl.dropbox.com/s/13ec3ht27adnu1l/snowflake1.png?dl=0');
    var sprite2 = textureLoader.load('https://dl.dropbox.com/s/rczse8o8zt5mxe6/snowflake2.png?dl=0');
    var sprite3 = textureLoader.load('https://dl.dropbox.com/s/cs17pph4bu096k7/snowflake3.png?dl=0');
    var sprite4 = textureLoader.load('https://dl.dropbox.com/s/plwtcfvokuoz931/snowflake4.png?dl=0');
    var sprite5 = textureLoader.load('https://dl.dropbox.com/s/uhh77omqdwqo2z5/snowflake5.png?dl=0');

    var vertices = [];
    for (var i = 0; i < length; i++) {
      var x = this.getRandom(-planeSize / 2, planeSize / 2);
      var y = this.getRandom(50,100);
      var z = this.getRandom(-planeSize / 2, planeSize / 2);
      vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    var parameters = [
      ['#FFFFFF', sprite2, this.getRandom(0.1, 0.3)],
      ['#FFFFFF', sprite3, this.getRandom(0.1, 0.3)],
      ['#FFFFFF', sprite1, this.getRandom(0.1, 0.3)],
      ['#FFFFFF', sprite5, this.getRandom(0.1, 0.3)],
      ['#FFFFFF', sprite4, this.getRandom(0.1, 0.3)],
    ];

    for (var i = 0; i < parameters.length; i++) {
      var sprite = parameters[i][1];
      var size = parameters[i][2];
      materials[i] = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
      });

      var particles = new THREE.Points(geometry, materials[i]);
      particles.rotation.x = Math.random() * 360;
      particles.rotation.y = Math.random() * 360;
      particles.rotation.z = Math.random() * 360;
      particles.vx = 0;
      particles.vy = 0;
      particles.material.opacity = 0;

      this.add(particles);
      this.snowList.push(particles);
    }
  }

  update() {
    this.angle += 0.001;

    for (var i = 0; i < this.snowList.length; i++) {
      this.snowList[i].material.opacity += 0.01;
      this.snowList[i].vy -= 0.5;

      this.snowList[i].vy *= 0.2;

      this.snowList[i].position.y += this.snowList[i].vy;

      if (this.snowList[i].position.y < -300) {
        this.snowList[i].material.opacity += 0.1;
        this.remove(this.snowList[i]);
        this.snowList.splice(i, 1);
        i -= 1;
      }
    }
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
}

export { MySnow };