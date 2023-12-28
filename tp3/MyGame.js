import * as THREE from 'three';
import { MyApp } from './MyApp.js';

const State = Object.freeze({
    MAIN_MENU: Symbol("Main Menu"),
    RULES: Symbol("Rules"),
    CHOOSE_GAME_SETTINGS: Symbol("Choose game settings"),
    CHOOSE_CAR_PLAYER: Symbol("Choose player car"),
    CHOOSE_CAR_OPP: Symbol("Choose opponent car"),
    CHOOSE_OBSTACLE: Symbol("Choose an obstacle"),
    PLACE_OBSTACLE: Symbol("Place the obstacle"),
    START: Symbol("Game start"),
    LOADING: Symbol("Loading"),
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
        this.state = State.MAIN_MENU
    }

    exec_game_stm(){
        switch(this.state){
            case State.MAIN_MENU:
                this.state = State.START
            case State.RULES:
            case State.CHOOSE_GAME_SETTINGS:
            case State.CHOOSE_CAR_PLAYER:
            case State.CHOOSE_CAR_OPP:
            case State.CHOOSE_OBSTACLE:
            case State.PLACE_OBSTACLE:
            case State.START:
            case State.LOADING:
            case State.PLAYING:
            case State.PAUSED:
            case State.END:
        }
    }

}

export { MyGame };