export class Resources
{
    constructor()
    {
        this.imageRegistry = {
            sky: { src: "/images/sky.png" },
            hero: { src: "/images/hero.png" },
            shadow: { src: "/images/shadow.png" },
            exit: { src: "/images/exit.png" },
            floor1: { src: "/images/floor_1.png" },
        };
        Object.values(this.imageRegistry).forEach(entry => {
            entry.image = new Image();
            entry.isLoaded = false;
            entry.image.onload = () => { entry.isLoaded = true; };
            entry.image.src = entry.src;
        });
    }
};