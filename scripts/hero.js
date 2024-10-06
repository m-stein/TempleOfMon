import { Direction, DirectionInput } from './direction_input.js';
import { Sprite } from './sprite.js';
import { Vector2 } from './vector_2.js';
import { LinearMovement } from './linear_movement.js';
import { floorVec2 } from './math.js';
import { TimedValue } from './timed_value.js';
import { GameObject } from './game_object.js';
import { Exit } from './exit.js';

export class Hero extends GameObject
{
    constructor(level, resources, inputSource, inventory)
    {
        super(new Vector2(0, 0), 'Hero');
        this.lvl = level;
        this.directionInput = new DirectionInput(inputSource);
        this.movement = new LinearMovement({at: this.lvl.initialHeroPosition(), speed: 0.005});
        this.inventory = inventory;
        this.lookingDirection = Direction.DOWN;
        this.lookingFrameIdx = [];
        this.lookingFrameIdx[Direction.DOWN] = new TimedValue([{ val: 1, ms: 1000 }]);
        this.lookingFrameIdx[Direction.RIGHT] = new TimedValue([{ val: 4, ms: 1000 }]);
        this.lookingFrameIdx[Direction.UP] = new TimedValue([{ val: 7, ms: 1000 }]);
        this.lookingFrameIdx[Direction.LEFT] = new TimedValue([{ val: 10, ms: 1000 }]);
        this.liftingFrameIdx = new TimedValue([{ val: 12, ms: 1000 }]);
        this.movingFrameIdx = [];
        this.movingFrameIdx[Direction.DOWN] = new TimedValue([
            { val: 1, ms: 100 },
            { val: 0, ms: 100 },
            { val: 1, ms: 100 },
            { val: 2, ms: 100 }
        ]);
        this.movingFrameIdx[Direction.RIGHT] = new TimedValue([
            { val: 4, ms: 100 },
            { val: 3, ms: 100 },
            { val: 4, ms: 100 },
            { val: 5, ms: 100 }
        ]);
        this.movingFrameIdx[Direction.UP] = new TimedValue([
            { val: 7, ms: 100 },
            { val: 6, ms: 100 },
            { val: 7, ms: 100 },
            { val: 8, ms: 100 }
        ]);
        this.movingFrameIdx[Direction.LEFT] = new TimedValue([
            { val: 10, ms: 100 },
            { val:  9, ms: 100 },
            { val: 10, ms: 100 },
            { val: 11, ms: 100 }
        ]);
        this.frameIdx = this.movingFrameIdx[Direction.DOWN];
        this.heroSprite = new Sprite
        ({
            sourceImage: resources.imageRegistry.hero,
            frameSize: new Vector2(32, 32),
            numColumns: 3,
            numRows: 8,
            drawFrameIndex: 1,
            framePadding: new Vector2(8, 21),
            position: new Vector2(0, 0),
        });
        this.shadowSprite = new Sprite
        ({
            sourceImage: resources.imageRegistry.shadow,
            frameSize: new Vector2(32, 32),
            framePadding: new Vector2(8, 21),
            position: new Vector2(0, 0),
        });
        this.presentingItemTimeoutMs = 0;
        this.presentingItem = undefined;
        this.addChild(this.heroSprite);
        this.addChild(this.shadowSprite);
    }

    checkForNewMovement()
    {
        const direction = this.directionInput.activeDirection()
        if (direction === undefined) {
            this.frameIdx = this.lookingFrameIdx[this.lookingDirection];
        } else {
            let dst = this.movement.at.copy();
            switch (direction) {
            case Direction.UP: dst.y -= this.lvl.grid.cellSize; break;
            case Direction.DOWN: dst.y += this.lvl.grid.cellSize; break;
            case Direction.LEFT: dst.x -= this.lvl.grid.cellSize; break;
            case Direction.RIGHT: dst.x += this.lvl.grid.cellSize; break;
            }
            this.lookingDirection = direction;
            if (!this.lvl.isObstacle(dst)) {
                this.movement.startMovingTowards(dst);
            }
            this.frameIdx = this.movingFrameIdx[direction];
        }
    }

    startItemPresentation(item)
    {
        this.frameIdx = this.liftingFrameIdx;
        this.lvl.removeChild(item);
        this.addChild(item);
        item.position = new Vector2(0, -20);
        this.presentingItemTimeoutMs = 800;
        this.presentingItem = item;
    }

    updateItemPresentation(deltaTimeMs)
    {
        if (this.presentingItemTimeoutMs > deltaTimeMs) {
            this.presentingItemTimeoutMs -= deltaTimeMs;
        } else {
            this.presentingItemTimeoutMs = 0;
            this.removeChild(this.presentingItem);
            this.inventory.addItem(this.presentingItem);
            this.presentingItem = undefined;
            this.frameIdx = this.lookingFrameIdx[this.lookingDirection];
        }
    }

    inItemPresentation()
    {
        return this.presentingItem != undefined;
    }

    interactWithItem = (item) => 
    {
        if (item instanceof Exit) {
            console.log("The hero arrived at an exit.");
        }
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
        let wasMoving = !this.movement.arrived;
        this.movement.update(deltaTimeMs);
        this.frameIdx.update(deltaTimeMs);
        this.position = floorVec2(this.movement.at);
        if (this.movement.arrived) {
            if (wasMoving) {
                this.lvl.withItemAt(this.position, this.interactWithItem);
            }
            if (this.inItemPresentation()) {
                this.updateItemPresentation(deltaTimeMs);
            }
            if (!this.inItemPresentation()) {
                this.checkForNewMovement();
            }
        }
        this.heroSprite.currFrameIndex = this.frameIdx.value();
    }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}