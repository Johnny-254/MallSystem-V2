import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ASScroll from '@ashthornton/asscroll';


export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualStore;
        this.room.children.forEach((child) => {
            if (child.type === "RectAreaLight") {
                this.rectLight = child;
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        GSAP.registerPlugin(ScrollTrigger);

        this.setSmoothScroll();
        this.setScrollTrigger();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            disableRaf: true
        });


        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement
        });


        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            fixedMarkers: true
        });


        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(".gsap-marker-start, .gsap-marker-end, [asscroll]")
            });

        });
        return asscroll;
    }
    setSmoothScroll() {
        this.asscroll = this.setupASScroll()
    }

    setScrollTrigger() {
        ScrollTrigger.matchMedia({

            // Desctop
            "(min-width: 769px)": () => {
                console.log("Fired");

                this.room.scale.set(0.6, 0.6, 0.6);
                // first section ----------------------------------------------------------
                this.firsMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(this.room.position, {
                        x: () => {
                            return this.sizes.width * 0.0014;
                        },
                    });

                // second section ----------------------------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(this.room.position, {
                        x: () => {
                            return 1;
                        },
                        z: () => {
                            return this.sizes.height * 0.0032;
                        },
                    }, "same"
                    )
                    // room Scaling
                    .to(this.room.scale, {
                        x: 0.6 * 3,
                        y: 0.6 * 3,
                        z: 0.6 * 3,
                    }, "same"
                    )
                    .to(
                        this.rectLight, {
                        width: 1 * 4,
                        height: 1 * 4
                    }, "same"
                    );
            },

            // Mobile
            "(max-width: 768px)": () => {
                console.log("Mobile");
                // Resets
                this.room.scale.set(0.4, 0.4, 0.4);
                this.room.position.set(0, 0, 0);

                // first section ----------------------------------------------------------
                this.firsMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.scale, {
                    x: 0.6,
                    y: 0.6,
                    z: 0.6,
                })

                // second section ----------------------------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.scale, {
                    x: 0.8,
                    y: 0.8,
                    z: 0.8,
                });
            },

            // all 
            "all": () => {

                this.section = document.querySelectorAll(".section");
                this.section.forEach((section) => {
                    this.progressWrapper =
                        section.querySelector(".progress-wrapper");
                    this.progressBar =
                        section.querySelector(".progress-bar");

                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderTopLeftRadius: 30,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.8,
                            }
                        });
                    }
                    if (section.classList.contains("right")) {
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.8,
                            }
                        });
                    } else {
                        GSAP.to(section, {
                            borderTopRightRadius: 30,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            }
                        });

                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.8,
                            }
                        });
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        }
                    })
                });

                //Circle Aniimations ----------------------------------------------------------------
                // first section ----------------------------------------------------------
                this.firsMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                })
                // second section ----------------------------------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleSecond.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                })


                // Not in this project 
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                });

                this.room.children.forEach(child => {
                    // if (child.name === "Mini-Room") {
                    //     GSAP.to(child.position, {

                    //     })
                    // }
                })

            }

        });
    }


    resize() { }

    update() {
    }
}