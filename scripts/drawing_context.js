import { Vector2 } from "./vector_2";

export class DrawingContext
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext("2d");
        this.position = new Vector2(0, 0);
    }
    
    drawImage(image, srcRect, dstRect)
    {
        this.canvasContext.drawImage(
            image, srcRect.position.x, srcRect.position.y, srcRect.width, srcRect.height,
            this.position.x + dstRect.position.x, this.position.y + dstRect.position.y, dstRect.width, dstRect.height);
    }
}