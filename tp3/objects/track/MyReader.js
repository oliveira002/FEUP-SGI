import * as THREE from 'three';
import { MyTrack } from './MyTrack.js';
import { tracks } from './tracks.js';
import { MyPowerUp } from './MyPowerUp.js';
import { MyBanana } from './MyBanana.js';
import { MyOil } from './MyOil.js';
import { MyCaution } from './MyCaution.js';




class MyReader extends THREE.Object3D {

    constructor(app, trackName, difficulty) {
        super();
        this.app = app
        this.type = 'Group';
        this.track = null
        this.trackCurve = null
        this.keyframes = []
        this.keyPoints = []
        this.powerups = []
        this.obstacles = []
        this.difficulty = difficulty
         
        const difficultyMap = {"easy": 3, "normal": 2, "hard": 1}
        this.totalTime = difficultyMap[this.difficulty] * 20 

        this.init(trackName);
    }

    init(trackName) {

        let object = tracks[trackName];

        this.createTrack(object.track, object.starting_point_index);
        this.createPowerUps(object.power_ups);
        this.createObstacles(object.obstacles);
        this.createKeyFrames(object.track, this.totalTime);

    }

    createTrack(points, starting_point_index){
        let curvePoints = []
        points.forEach(point => {
            curvePoints.push(
                new THREE.Vector3(...point)
            )
        });

        this.track = new MyTrack(curvePoints)
        this.add(this.track)
    }

    createPowerUps(powerup_coords){
        powerup_coords.forEach(coords => {

            let radius = 5
            let powerup = new MyPowerUp(radius, coords)
            //powerup.position.set(...coords)

            this.powerups.push(powerup)
            this.add(powerup)
        });
    }

    createObstacles(obstacles){
        obstacles.forEach(obs => {
            for (const [type, coords] of Object.entries(obs)) {
                let obstacle
                switch(type){
                    case "Oil":{
                        obstacle = new MyOil(this.app)
                        break;
                    }
                    case "Banana":{
                        obstacle = new MyBanana(this.app)
                        break;
                    }
                    case "Caution":{
                        obstacle = new MyCaution(this.app, 0.8, 0.14, 1.6)
                        break;
                    }
                }

                obstacle.position.set(...coords)
                let boundingBox
                if(type == "Banana") {
                    obstacle.updateBoundingBox()
                    this.obstacles.push(obstacle)
                    this.add(obstacle)
                }
                else {
                    boundingBox = new THREE.Box3().setFromObject(obstacle);
                    obstacle.boundingBox = boundingBox
                }

                let boundingBoxHelper = new THREE.Box3Helper(boundingBox, 0xffff00);
                //this.add(boundingBoxHelper);
                
                this.obstacles.push(obstacle)
                this.add(obstacle)
            }
        })
    }

    createKeyFrames(track, totalTime) {
        let curvePoints = []
        track.forEach(point => {
            curvePoints.push(
                new THREE.Vector3(...point)
            )
        });

        this.trackCurve = new THREE.CatmullRomCurve3(curvePoints);
        this.keyPoints = this.trackCurve.getSpacedPoints(400)

        let pointTime = totalTime / 400
        let curTime = 0
        this.keyPoints.forEach((point, i) => {
            this.keyframes.push({time: curTime, value: point})
            curTime += pointTime
        });

        this.spline = new THREE.CatmullRomCurve3(this.keyframes.map(kf => kf.value));

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.scale.set(0.2, 0.2, 0.2)
            sphere.position.set(... this.keyPoints[i])

            //this.add(sphere)
        }
    }

    update(){
        this.powerups.forEach(powerup => {
            powerup.update()
        })
    }

    

}

MyReader.prototype.isGroup = true;

export { MyReader };