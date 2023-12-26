import * as THREE from 'three';

class MySpriteSheet extends THREE.Object3D {
  /**
   * @param {MyApp} app the application object
   * @param {string} text the text to be displayed
   * @param {string} spritesheetPath the path to the spritesheet image
   */
  constructor(app, text) {
    super();
    this.app = app;
    this.text = text;
    this.spritesheetPath = "images/spritesheet.png";

    // Load the spritesheet texture
    const textureLoader = new THREE.TextureLoader();
    this.spritesheetTexture = textureLoader.load(this.spritesheetPath);

    // Define the spritesheet properties
    this.spritesheetWidth = 124;
    this.spritesheetHeight = 94;
    this.charactersPerRow = 8;
    this.rows = 5;

    // Create text geometry
    this.createTextGeometry();
  }

  createTextGeometry() {
    const characters = this.text.split('');
    let offsetX = 0 // Adjust the spacing factor as needed
    
    let i = 0
    characters.forEach((character, index) => {
      const charIndex = this.getCharIndex(character);
      if (charIndex !== -1) {
        const rowIndex = Math.floor(charIndex / this.charactersPerRow);
        const colIndex = charIndex % this.charactersPerRow;
  
        const charWidth = this.spritesheetWidth / this.charactersPerRow;
        const charHeight = this.spritesheetHeight / this.rows;
  
        const uMin = colIndex * charWidth / this.spritesheetWidth;
        const uMax = (colIndex + 1) * charWidth / this.spritesheetWidth;
        const vMin = rowIndex * charHeight / this.spritesheetHeight;
        const vMax = (rowIndex + 1) * charHeight / this.spritesheetHeight;
  
        const material = new THREE.MeshBasicMaterial({
          map: this.spritesheetTexture.clone(),
          color: new THREE.Color(0xffffff), // Set color to white
          transparent: true,
        });
        
        const geometry = new THREE.PlaneGeometry(charWidth, charHeight);
        const plane = new THREE.Mesh(geometry, material);


        plane.translateX(i * charWidth)
  
        material.map.offset.set(uMin, 1 - vMax);
        material.map.repeat.set(uMax - uMin, vMax - vMin);
        
        offsetX += charWidth;
        i += 1
        this.add(plane);
      }
    });
  }

  getCharIndex(character) {
    const allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$:?!";

    return allCharacters.indexOf(character);
  }
}

MySpriteSheet.prototype.isGroup = true;

export { MySpriteSheet };