
 window.addEventListener("load", () => {

    gsap.registerPlugin(ScrollTrigger,ScrollSmoother,ScrollToPlugin, SplitText);

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger:".transition",
            markers:false,
            scrub: 2,
            start: "0% 0%",
            end: "+=3000",
            pin: true,
            
        },
    });

    timeline.to(".ret div", {
        y:0,
        stagger: 0.2,
        duration: 4
    });
    
    timeline.to(".sec1", {

        opacity: 1,
        duration: 0.1
    })
    const split = new SplitText(".sec1 h2", {

        types: "chars",
        mask: "lines"
    });
    timeline.from(split.chars, {

        y: 100,
        stagger: 0.1,
        duration: 1

    })

 });
