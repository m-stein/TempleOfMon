import { GameObject } from "./game_object.js";
import { Grid } from "./grid.js";
import { Sprite } from "./sprite.js";
import { Vector2 } from "./vector_2.js";
import { Exit } from "./exit.js";

class RepeatedSprite extends GameObject
{
    constructor(position, image, numColumns, numRows)
    {
        super(position, 'RepeatedSprite_' + image.src);
        this.sprites = [];
        let offset = new Vector2(0, 0);
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numColumns; col++) {
                this.sprites.push(new Sprite({ sourceImage: image, position: offset.copy() }));
                offset.x += image.image.width;
            }
            offset.x = 0;
            offset.y += image.image.height;
        }
        this.sprites.forEach((sprite) => { this.addChild(sprite); });
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    draw(drawingContext) { this.drawChildren(drawingContext); }
}

export class Level1 extends GameObject
{
    constructor(resources)
    {
        super(new Vector2(0, 0), 'Level1');
        this.grid = new Grid(16);
        this.obstacles = [
            {col: 0, numCols: 2, row: 10, numRows: 1},
            {col: 3, numCols: 2, row: 10, numRows: 1},
            {col: 2, numCols: 1, row: 11, numRows: 1},
            {col: -1, numCols: 1, row: 5, numRows: 5},
            {col: 5, numCols: 1, row: 5, numRows: 5},
            {col: 0, numCols: 2, row: 3, numRows: 2},
            {col: 3, numCols: 2, row: 3, numRows: 2},
            {col: 0, numCols: 1, row: 0, numRows: 3},
            {col: 4, numCols: 1, row: 0, numRows: 3},
            {col: 1, numCols: 3, row: -1, numRows: 1},
        ];
        this.structures = [
            new RepeatedSprite(this.grid.cellToPos(0, 5), resources.imageRegistry.floor1, 5, 5),
            new RepeatedSprite(this.grid.cellToPos(2, 3), resources.imageRegistry.floor1, 1, 2),
            new RepeatedSprite(this.grid.cellToPos(1, 0), resources.imageRegistry.floor1, 3, 3),
            new RepeatedSprite(this.grid.cellToPos(2, 10), resources.imageRegistry.floor1, 1, 1),
        ];
        this.structures.forEach((struct) => { this.addChild(struct); });
        this.items = [
            new Exit(resources, this.grid.cellToPos(2, 1)),
        ];
        this.items.forEach((item) => { this.addChild(item); });
        this.markObstacles = true;
    }

    initialHeroPosition()
    {
        return this.grid.cellToPos(2, 10);
    }

    withItemAt(position, fn)
    {
        this.items.forEach((item) =>
        {
            if (item.position.equals(position)) {
                fn(item);
            }
        });
    }

    isObstacle(position)
    {
        let [col, row] = this.grid.posToCell(position);
        for (const obst of this.obstacles)
            if (row >= obst.row && row < obst.row + obst.numRows &&
                col >= obst.col && col < obst.col + obst.numCols)
                return true;

        return false;
    }

    update(deltaTimeMs) { this.updateChildren(deltaTimeMs); }

    drawObstacleMarks(drawingContext)
    {
        const globalAlpha = drawingContext.canvasContext.globalAlpha;
        const fillStyle = drawingContext.canvasContext.fillStyle
        drawingContext.canvasContext.globalAlpha = 0.3;
        drawingContext.canvasContext.fillStyle = 'red';
        this.obstacles.forEach((obstacle) => {
            const pos = this.grid.cellToPos(obstacle.col, obstacle.row);
            drawingContext.canvasContext.fillRect(
                pos.x, pos.y, obstacle.numCols * this.grid.cellSize, obstacle.numRows * this.grid.cellSize);
        });
        drawingContext.canvasContext.globalAlpha = globalAlpha;
        drawingContext.canvasContext.fillStyle = fillStyle;
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
        if (this.markObstacles) {
            this.drawObstacleMarks(drawingContext);
        }
    }
}