import { DrawingContext } from "./drawing_context";

export class GameEngine
{
    constructor({rootGameObj, camera, canvas, updatePeriodMs})
    {
        this.drawingContext = new DrawingContext(canvas);
        this.lastUpdateTime = 0;
        this.accumulatedTime = 0;
        this.gameUpdatePeriodMs = updatePeriodMs;
        this.rootGameObj = rootGameObj;
        this.camera = camera;
        this.updateCallbackId = null;
        this.started = false;
    }

    update = (time) =>
    {
        if (!this.started)
            return;

        this.accumulatedTime += (time - this.lastUpdateTime);
        this.lastUpdateTime = time;
        let rootGameObjUpdated = false;
        while (this.accumulatedTime >= this.gameUpdatePeriodMs) {
            this.accumulatedTime -= this.gameUpdatePeriodMs;
            this.rootGameObj.update(this.gameUpdatePeriodMs, 0);
            rootGameObjUpdated = true;
        }
        if (rootGameObjUpdated) {
            this.drawingContext.canvasContext.clearRect(0, 0, this.drawingContext.canvas.width, this.drawingContext.canvas.height);
            this.drawingContext.canvasContext.save();
            this.drawingContext.canvasContext.translate(-this.camera.position.x, -this.camera.position.y);
            this.rootGameObj.draw(this.drawingContext, 0);
            this.drawingContext.canvasContext.restore();
        }
        this.requestUpdate();
    }

    requestUpdate()
    {
        this.updateCallbackId = requestAnimationFrame(this.update);
    }

    cancelUpdate()
    {
        cancelAnimationFrame(this.updateCallbackId);
    }

    start()
    {
        if (this.started)
            return;

        this.started = true;
        this.requestUpdate();
    }

    stop()
    {
        if (!this.started)
            return;
        
        this.started = false;
        this.cancelUpdate();
    }
}