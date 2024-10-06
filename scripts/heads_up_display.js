import { GameObject } from "./game_object";
import { Vector2 } from "./vector_2";

export class HeadsUpDisplay extends GameObject
{
    constructor(position) { super(position, "inventory"); }

    addItem(item)
    {
        item.position = new Vector2(16 * this.numChildren(), 0);
        this.addChild(item);
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}