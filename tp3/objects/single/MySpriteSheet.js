import * as THREE from "three";

class MySpriteSheet {
  constructor(columns, rows, texturePath) {
    this.textureURL = texturePath;
    this.columns = columns;
    this.rows = rows;
    this.texture = null;
    this.sprites = [];
    this.spriteWidth = 1 / this.columns;
    this.mapping = {
      " ": 0,
      "!": 1,
      '"': 2,
      "#": 3,
      "$": 4,
      "%": 5,
      "&": 6,
      "'": 7,
      "(": 8,
      ")": 9,
      "*": 10,
      "+": 11,
      ",": 12,
      "-": 13,
      ".": 14,
      "/": 15,
      "0": 16,
      "1": 17,
      "2": 18,
      "3": 19,
      "4": 20,
      "5": 21,
      "6": 22,
      "7": 23,
      "8": 24,
      "9": 25,
      ":": 26,
      ";": 27,
      "<": 28,
      "=": 29,
      ">": 30,
      "?": 31,
      "@": 32,
      "A": 33,
      "B": 34,
      "C": 35,
      "D": 36,
      "E": 37,
      "F": 38,
      "G": 39,
      "H": 40,
      "I": 41,
      "J": 42,
      "K": 43,
      "L": 44,
      "M": 45,
      "N": 46,
      "O": 47,
      "P": 48,
      "Q": 49,
      "R": 50,
      "S": 51,
      "T": 52,
      "U": 53,
      "V": 54,
      "W": 55,
      "X": 56,
      "Y": 57,
      "Z": 58,
    }

    this.loadTexture()
  }

  loadTexture() {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(this.textureURL);
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.LinearMipMapLinearFilter;

    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;

    this.texture.repeat.set(1, 1);

    this.createSprites();

  }

  createSprites() {
    const spriteWidth = 1 / this.columns;
    const spriteHeight = 1 / this.rows;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const material = new THREE.MeshBasicMaterial({
          map: this.texture.clone(), // Clone the texture for each sprite
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });

        const geometry = new THREE.PlaneGeometry(spriteWidth, spriteHeight);
        const sprite = new THREE.Mesh(geometry, material);

        sprite.position.set(x * spriteWidth, -y * spriteHeight, 0);

        // Set UV coordinates based on the current character's position in the spritesheet
        sprite.geometry.setAttribute('uv', new THREE.Float32BufferAttribute([
          x / this.columns, 1 - y / this.rows,
          (x + 1) / this.columns, 1 - y / this.rows,
          x / this.columns, 1 - (y + 1) / this.rows,
          (x + 1) / this.columns, 1 - (y + 1) / this.rows,
        ], 2));

        this.sprites.push(sprite);
      }
    }
  }

  getSpriteByChar(character) {
    const index = this.mapping[character.toUpperCase()];
    if (index !== undefined) {
      return this.sprites[index];
    } else {
      console.error('Character not found in mapping.');
      return null;
    }
  }
  createTextGroup(text) {
    const textGroup = new THREE.Group();
    let offsetX = 0;

    for (const char of text) {
      const sprite = this.getSpriteByChar(char);
      if (sprite) {
        const spriteClone = sprite.clone();
        spriteClone.position.set(offsetX, 0, 0);
        textGroup.add(spriteClone);
        offsetX += this.spriteWidth // Update the offset
      }
    }
    textGroup.scale.set(2,2,2)
    return textGroup;

  }
}

export { MySpriteSheet };