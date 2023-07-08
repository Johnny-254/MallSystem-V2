import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import GUI from 'lil-gui';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // this.gui = new GUI({ container: document.querySelector('.hero-main') });
        this.obj = {
            colorObj: { r: 0, g: 0, b: 0 },
            intensity: 3,
        }

        this.setSunlight();
        // this.setGUI();
    }

    setGUI() {
        this.gui.addColor(this.obj, "colorObj").onChange(() => {
            this.sunLight.color.copy(this.obj.colorObj);
            this.ambientlight.color.copy(this.obj.colorObj);
            console.log(this.obj.colorObj);
        })
        this.gui.add(this.obj, "intensity", 0, 10).onChange(() => {
            this.sunLight.intensity = this.obj.intensity;
            this.ambientlight.intensity = this.obj.intensity;
        })
    }

    setSunlight() {
        this.sunLight = new THREE.DirectionalLight("#608fcc", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);
        this.sunLight.position.set(1.5, 7, 3);
        this.scene.add(this.sunLight);

        this.ambientlight = new THREE.AmbientLight("#ffffff", 1);
        this.scene.add(this.ambientlight)
    }

    switchTheme(theme) {
        console.log(this.sunLight)
        if (theme === "dark") {
            GSAP.to(this.sunLight.color, {
                r: 0.023529411764705882, 
                g: 0.023529411764705882, 
                b: 0.058823529411764705
            })
            GSAP.to(this.ambientlight.color, {
                r: 0.023529411764705882, 
                g: 0.023529411764705882, 
                b: 0.058823529411764705
            })
            GSAP.to(this.sunLight, {
                intensity: 3,
            })
            GSAP.to(this.ambientlight, {
                intensity: 3,
            })
        } else {
            GSAP.to(this.sunLight.color, {
                r: 0.25098039215686274, 
                g: 0.30980392156862746, 
                b: 0.611764705882353
            })
            GSAP.to(this.ambientlight.color, {
                r: 0.25098039215686274, 
                g: 0.30980392156862746, 
                b: 0.611764705882353
            })
            GSAP.to(this.sunLight, {
                intensity: 3,
            })
            GSAP.to(this.ambientlight, {
                intensity: 1,
            })
        }
    }

    resize() { }

    update() { }
}