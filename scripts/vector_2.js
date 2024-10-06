export class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    distance(other)
    {
        return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2);
    }

    copy()
    {
        return new Vector2(this.x, this.y);
    }

    equals(other)
    {
        return this.x == other.x && this.y == other.y;
    }

    add(other)
    {
        this.x += other.x;
        this.y += other.y;
    }
    
    subtract(other)
    {
        this.x -= other.x;
        this.y -= other.y;
    }
}