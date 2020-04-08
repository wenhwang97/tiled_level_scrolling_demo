import {WebGLGameTexture} from '../../rendering/WebGLGameTexture'

export class AnimationFrame {
    public left : number;
    public top : number;
    public duration : number;

    constructor(initLeft : number, initTop : number, initDuration : number) {
        this.left = initLeft;
        this.top = initTop;
        this.duration = initDuration;
    }
}

export class AnimatedSpriteType {
    private spriteSheetTexture : WebGLGameTexture;
    private animations : Map<string, Array<AnimationFrame>>;
    private spriteWidth : number;
    private spriteHeight : number;

    public constructor(initSpriteSheetTexture : WebGLGameTexture, 
                initSpriteWidth : number, initSpriteHeight : number) {
        this.spriteSheetTexture = initSpriteSheetTexture;
        this.animations = new Map();
        this.spriteWidth = initSpriteWidth;
        this.spriteHeight = initSpriteHeight;
    }

    public addAnimation(state : string) : void {
        this.animations.set(state, new Array<AnimationFrame>());
    }

    public addAnimationFrame(state : string, index : number, frameDuration : number) : void {
        var columns = this.spriteSheetTexture.width/this.spriteWidth;
        var rows = this.spriteSheetTexture.height/this.spriteHeight;
        var col = index % columns;
        var row = Math.floor(index /  columns);
        var left = col * this.spriteWidth;
        var top = row * this.spriteHeight;
        this.animations.get(state).push(new AnimationFrame(left, top, frameDuration));
    }

    public getSpriteWidth() : number {
        return this.spriteWidth;
    }

    public getSpriteHeight() : number {
        return this.spriteHeight;
    }

    public getSpriteSheetTexture() : WebGLGameTexture {
        return this.spriteSheetTexture;
    }

    public getAnimation(state : string) : Array<AnimationFrame> {
        return this.animations.get(state);
    }

    public getLeft(state : string, frameIndex : number) : number {
        let animationFrame : AnimationFrame = this.animations.get(state)[frameIndex];
        return animationFrame.left;
    }

    public getTop(state : string, frameIndex : number) : number {
        let animationFrame : AnimationFrame = this.animations.get(state)[frameIndex];
        return animationFrame.top;
    }
}