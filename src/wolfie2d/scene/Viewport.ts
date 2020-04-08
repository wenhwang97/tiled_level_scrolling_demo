export class Viewport {
    private width : number;
    private height : number;
    private x : number;
    private y : number;

    public constructor(initWidth : number, initHeight : number) {
        this.width = initWidth;
        this.height = initHeight;
        this.x = 0;
        this.y = 0;
    }

    public getWidth() : number {
        return this.width;
    }

    public getHeight() : number {
        return this.height;
    }

    public getX() : number {
        return this.x;
    }

    public getY() : number {
        return this.y;
    }

    public inc(incX : number, incY : number) : void {
        this.x += incX;
        this.y += incY;
    }

    public setPosition(initX : number, initY : number) : void {
        this.x = initX;
        this.y = initY;
    }
}