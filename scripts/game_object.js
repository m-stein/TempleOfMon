export class GameObject
{
    constructor(position, label)
    {
        this.label = label;
        this.children = [];
        this.position = position;
    }

    addChild(child)
    {
        this.children.push(child);
    }

    removeChild(child)
    {
        const index = this.children.indexOf(child);
        if (index < 0) {
            return;
        }
        this.children.splice(index, 1);
    }

    destroyRecursive()
    {
        this.children.forEach((child) => { child.destroy(); });
        this.children.length = 0;
    }

    updateChildren(deltaTimeMs, level)
    {
        this.children.forEach((child) => { child.update(deltaTimeMs, level + 1); });
    }

    drawChildren(drawingContext, level)
    {
        drawingContext.position.add(this.position);
        this.children.forEach((child) => { child.draw(drawingContext, level + 1); });
        drawingContext.position.subtract(this.position);
    }

    numChildren() { return this.children.length; }
}