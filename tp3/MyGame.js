import * as THREE from 'three';
import { MyApp } from './MyApp.js';

const State = Object.freeze({
	START: Symbol("Start"),
	PLAYING: Symbol("Playing"),
	PAUSED: Symbol("Paused"),
	END: Symbol("End")
})

class MyGame {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        this.app = app;
        this.state = State.START

        

    }
}

export { MyGame };