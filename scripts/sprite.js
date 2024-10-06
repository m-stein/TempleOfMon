import { GameObject } from './game_object.js';
import { Rectangle } from './rectangle.js';
import { Vector2 } from './vector_2.js'

export class Sprite extends GameObject
{
    constructor({
        sourceImage,
        frameSize,
        framePadding,
        numColumns,
        numRows,
        scaleFactor,
        drawFrameIndex,
        position
    })
    {
        super(position, 'Sprite_' + sourceImage.src);
        this.sourceImage = sourceImage;
        this.frameSize = frameSize ?? new Vector2(sourceImage.image.width, sourceImage.image.height);
        this.framePadding = framePadding ?? new Vector2(0, 0)
        this.numColumns = numColumns ?? 1;
        this.numRows = numRows ?? 1;
        this.scaleFactor = scaleFactor ?? 1;
        this.currFrameIndex = drawFrameIndex ?? 0;
        this.frameMap = new Map();
        this.createFrameMap();
    }

    createFrameMap()
    {
        let frameIdx = 0;
        for (let rowIdx = 0; rowIdx < this.numRows; rowIdx++) {
            for (let colIdx = 0; colIdx < this.numColumns; colIdx++) {
                const framePos = new Vector2(colIdx * this.frameSize.x, rowIdx * this.frameSize.y);
                this.frameMap.set(frameIdx, framePos);
                frameIdx++;
            }
        }
    }
    
    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext)
    {
        if (!this.sourceImage.isLoaded)
            return;

        const frame = this.frameMap.get(this.currFrameIndex);
        if (!frame) {
            console.warn("failed to get frame from map");
            return;
        }
        const srcRect = new Rectangle(frame, this.frameSize.x, this.frameSize.y);
        const dstRect = new Rectangle(new Vector2(this.position.x - this.framePadding.x, this.position.y - this.framePadding.y), this.frameSize.x * this.scaleFactor, this.frameSize.y * this.scaleFactor)
        drawingContext.drawImage(this.sourceImage.image, srcRect, dstRect);
        this.drawChildren(drawingContext);
    }
}