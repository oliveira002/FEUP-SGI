import * as THREE from 'three';

class MyReader extends THREE.Object3D {

    constructor(trackName) {
        super();
        this.type = 'Group';
        this.tracksFilePath = "./objects/track/tracks.json"
        
        this.init(trackName)
    }

    init(trackName) {
        fetch(this.tracksFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${this.tracksFilePath}`);
            }
            return response.json();
            })
            .then(jsonData => {
            if (jsonData.hasOwnProperty(trackName)) {
                // TODO instantiate objects
                console.log(`Entry for key '${trackName}':`, jsonData[trackName]);
            } else {
                console.error(`Track '${trackName}' not found in the JSON file.`);
            }
            })
        .catch(error => {
            console.error('Error:', error.message);
        });
    }

}

MyReader.prototype.isGroup = true;

export { MyReader };