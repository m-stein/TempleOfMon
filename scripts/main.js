import './style.css';
import { Resources } from './resources.js';
import { GameEngine } from './game_engine.js';
import { Level1 } from './level_1.js';
import { Hero } from './hero.js';
import { GameObject } from './game_object.js';
import { Vector2 } from './vector_2.js';
import { Camera } from './camera.js';
import { HeadsUpDisplay } from './heads_up_display.js';

class Main extends GameObject
{
    constructor()
    {
        super(new Vector2(0, 0), 'Main');
        this.resources = new Resources();
        this.lvl = new Level1(this.resources);
        this.canvas = document.querySelector('#gameCanvas');
        this.camera = new Camera(this.resources.imageRegistry.sky, this.canvas.width, this.canvas.height);
        this.hud = new HeadsUpDisplay(this.camera.position.copy());
        this.hero = new Hero(this.lvl, this.resources, document, this.hud);
        this.heroToCamOffset = new Vector2(
            this.lvl.grid.cellSize / 2 - this.canvas.width / 2,
            this.lvl.grid.cellSize / 2 - this.canvas.height / 2
        );
        this.camToInventoryOffset = new Vector2(0, 8);
        this.gameEngine = new GameEngine
        ({
            rootGameObj: this,
            camera: this.camera,
            canvas: this.canvas,
            updatePeriodMs: 1000 / 60
        });
        this.gameEngine.start();
        this.addChild(this.camera);
        this.addChild(this.lvl);
        this.addChild(this.hero);
        this.addChild(this.hud);
    }

    update(deltaTimeMs)
    {
        this.updateChildren(deltaTimeMs);
        this.camera.position = this.hero.position.copy();
        this.camera.position.add(this.heroToCamOffset);
        this.hud.position = this.camera.position.copy();
        this.hud.position.add(this.camToInventoryOffset);
    }

    draw(drawingContext)
    {
        this.drawChildren(drawingContext);
    }
}

const main = new Main();