export class SpriteAction {

    private countdown : number;

    public constructor(countdown : number) {
        this.countdown = countdown;
    }

    public setCountdown() : void {
        this.countdown = Math.random() * 10;
    }

    public refresh() : void {
        this.countdown--;
    }

    public isZero() : boolean {
        return this.countdown <= 0;
    }
}