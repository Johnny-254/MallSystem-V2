import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.store = this.resources.items.store;
        this.actualStore = this.store.scene;

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        }

        this.setModel();
        this.onMouseMove();
    }

    setModel() {
        this.actualStore.children.forEach((child) => {
            child.castShadow = true;
            child.recieveShadow = true;

            if (child instanceof THREE.Group) {
                child.children.forEach((groupchild) => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }

            //Not in use for this project 
            //Making a glass like material using three.js instead of baking it direct into the model
            if (child.name === "Glass") {
                child.material = new THREE.MeshPhysicalMaterial();
                child.material.roughness = 0;
                child.material.color.set(0xffffff);
                child.material.ior = 3;
                child.material.transmission = 1;
                child.material.opacity = 1;
            }
        });

        const width = 1;
        const height = 1;
        const intensity = 12;
        const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
        rectLight.position.set(-2, 5, 2);
        // rectLight.rotation.x = Math.PI / -3;
        rectLight.lookAt(0, 0, 0);
        this.actualStore.add(rectLight)

        // const rectLightHelper = new RectAreaLightHelper(rectLight);
        // rectLight.add(rectLightHelper);

        this.scene.add(this.actualStore);
        this.actualStore.scale.set(0.6, 0.6, 0.6);

    }


    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.2;
        })
    }

    resize() { }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        this.actualStore.rotation.y = this.lerp.current
    }
}