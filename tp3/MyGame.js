import * as THREE from 'three';
import { MyApp } from './MyApp.js';

export const State = Object.freeze({
    MAIN_MENU: "MAIN_MENU",
    NAME_MENU: "NAME_MENU",
    RULES: "RULES",
    CHOOSE_GAME_SETTINGS: "CHOOSE_GAME_SETTINGS",
    CHOOSE_CAR_PLAYER: "CHOOSE_CAR_PLAYER",
    CHOOSE_CAR_OPP: "CHOOSE_CAR_OPP",
    CHOOSE_OBSTACLE: "CHOOSE_OBSTACLE",
    PLACE_OBSTACLE: "PLACE_OBSTACLE",
    START: "START",
    LOADING: "LOADING",
	PLAYING: "PLAYING",
	PAUSED: "PAUSED",
	END: "END"
})

class MyGame {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        this.app = app;
        this.state = State.PLAYING
    }

    exec_game_stm(){
        switch(this.state){
            case State.MAIN_MENU:
                this.state = State.START
            case State.RULES:
            case State.CHOOSE_GAME_SETTINGS:
                this.state = State.CHOOSE_CAR_PLAYER
            case State.CHOOSE_CAR_PLAYER:
                this.state = State.CHOOSE_CAR_OPP
            case State.CHOOSE_CAR_OPP:
                this.state = State.CHOOSE_OBSTACLE
            case State.CHOOSE_OBSTACLE:
                this.state = State.PLAYING
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