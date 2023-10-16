import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

/**
 * This class contains walls representation for a square floor
 */
class MyCandle extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} radius the radius of the candle. Default is `0.05`
     * @param {number} height the height of the candle. Default is `radius*5`
     * @param {number} diffuseCandleColor the diffuse component of the candle body's color. Default `#fffcbb`
     * @param {number} specularCandleColor the specular component of the candle body's  color. Default `#777777`
     * @param {number} candleShininess the shininess component of the candle body's color. Default `30` 
     * @param {number} diffuseFlameColor the diffuse component of the candle flame's color. Default `#e25822`
     * @param {number} specularFlameColor the specular component of the candle flame's color. Default `#777777`
     * @param {number} flameShininess the shininess component of the candle flame's color. Default `30` 
     */
    constructor(app, radius, height, diffuseCandleColor, specularCandleColor, candleShininess, diffuseFlameColor, specularFlameColor, flameShininess) {
        super();
        this.app = app;
        this.type = 'Group';

        // Radius setup
        this.candleBodyRadius = radius || 0.05
        this.flameRadius = this.candleBodyRadius*0.5
        this.candleWickRadius = this.candleBodyRadius*0.05

        // Height setup
        this.height = height || this.candleBodyRadius*5
        this.candleBodyHeight = 7*this.height/10
        this.flameHeight = 2*this.height/10
        this.candleWickHeight = this.height/10

        // Candle body color setup
        this.diffuseCandleColor = diffuseCandleColor || "#fffcbb"
        this.specularCandleColor = specularCandleColor || "#777777"
        this.candleShininess = candleShininess || 30

        // Flame color setup
        this.diffuseFlameColor = diffuseFlameColor || "#e25822"
        this.specularFlameColor = specularFlameColor || "#777777"
        this.flameShininess = flameShininess || 30

        // Wick color setup
        this.diffuseWickColor = "#000000"
        this.specularWickColor = "#777777"
        this.wickShininess = 30

        // Materials setup
        this.candleMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseCandleColor, 
            specular: this.specularCandleColor, emissive: "#000000", shininess: this.candleShininess })
        this.flameMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseFlameColor, 
            specular: this.specularFlameColor, emissive: "#000000", shininess: this.flameShininess })
        this.wickMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseWickColor, 
            specular: this.specularWickColor, emissive: "#000000", shininess: this.wickShininess })
        
        // Geometries setup
        let candle = new THREE.CylinderGeometry(this.candleBodyRadius, this.candleBodyRadius, this.candleBodyHeight)
        let flame = new THREE.ConeGeometry(this.flameRadius, this.flameHeight)
        let wick = new THREE.CylinderGeometry(this.candleWickRadius, this.candleWickRadius,this.candleWickHeight)
        
        // Meshes setup
        this.candleMesh = new THREE.Mesh(candle, this.candleMaterial)
        this.candleMesh.translateY((this.candleBodyHeight/2))
        this.add( this.candleMesh );

        this.wickMesh = new THREE.Mesh(wick, this.wickMaterial)
        this.wickMesh.translateY((this.candleBodyHeight + this.candleWickHeight/2))
        this.add( this.wickMesh )

        this.flameMesh = new THREE.Mesh(flame, this.flameMaterial)
        this.flameMesh.translateY((this.candleBodyHeight + this.candleWickHeight + this.flameHeight/2))
        this.add( this.flameMesh )   

        //const pointLight = new THREE.PointLight( 0xffffff, 125, 0, 2 );
        //pointLight.position.set( 0, -(this.bulbSupportHeight + this.bulbBottomHeight + (this.bulbRadius - this.bulbRadius*(1-Math.cos(Math.PI/4)))), 0 );
        //this.add( pointLight );

        this.translateY(-this.height/2)
    }
}

MyCandle.prototype.isGroup = true;

export { MyCandle };