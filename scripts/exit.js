import { Sprite } from "./sprite";

export class Exit extends Sprite
{
    constructor(resources, position)
    {
        super({
            sourceImage: resources.imageRegistry.exit,
            position: position
        });
    }
}