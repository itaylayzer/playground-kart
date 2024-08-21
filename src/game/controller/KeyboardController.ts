export class KeyboardController {
    private keysPressed: Set<string>;
    private keysDown: Set<string>;
    private keysUp: Set<string>;
    constructor(enableOnStart: boolean = true) {
        this.keysPressed = new Set();
        this.keysDown = new Set();
        this.keysUp = new Set();

        enableOnStart && this.enable();
    }

    public enable() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
    }
    public disable() {
        window.removeEventListener("keydown", this.onKeyDown.bind(this));
        window.removeEventListener("keyup", this.onKeyUp.bind(this));
    }

    private onKeyDown(event: KeyboardEvent) {
        this.keysDown.add(event.code);
    }

    private onKeyUp(event: KeyboardEvent) {
        this.keysPressed.delete(event.code);
        this.keysUp.add(event.code);
    }

    public isKeyPressed(code: string): boolean {
        return this.keysPressed.has(code);
    }

    public isKeyUp(code: string): boolean {
        return this.keysUp.has(code);
    }

    public isKeyDown(code: string): boolean {
        return this.keysDown.has(code);
    }

    public lastUpdate() {
        for (const down of this.keysDown) {
            this.keysPressed.add(down);
        }
        this.keysDown.clear();
        this.keysUp.clear();
    }
}
