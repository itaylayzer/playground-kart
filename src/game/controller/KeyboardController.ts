import { lerp } from "three/src/math/MathUtils.js";
import { Global } from "../store/Global";

const HORIZONTAL = 0;
const VERTICAL = 1;
const BOOST_VERTICAL = 2;
const BOOST_HORIZONTAL = 3;
const RAW_AXIS = 0;
const LERPED_AXIS = 1;

export class KeyboardController {
  private keysPressed: Set<string>;
  private keysDown: Set<string>;
  private keysUp: Set<string>;
  private keysAxis: [
    [number, number, number, number],
    [number, number, number, number]
  ];

  constructor(enableOnStart: boolean = true) {
    this.keysPressed = new Set();
    this.keysDown = new Set();
    this.keysUp = new Set();
    this.keysAxis = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
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

  public firstUpdate() {
    // Input axis processing
    this.keysAxis[RAW_AXIS][VERTICAL] = !Global.lockController.isLocked
      ? 0
      : +this.isKeyPressed("KeyW") + -this.isKeyPressed("KeyS");
    this.keysAxis[RAW_AXIS][HORIZONTAL] = !Global.lockController.isLocked
      ? 0
      : -this.isKeyPressed("KeyD") + +this.isKeyPressed("KeyA");

    this.keysAxis[RAW_AXIS][BOOST_VERTICAL] = !Global.lockController.isLocked
      ? 0
      : Global.keyboardController.isKeyPressed("Space")
      ? 2
      : +Global.keyboardController.isKeyPressed("KeyW") +
        -Global.keyboardController.isKeyPressed("KeyS");

    this.keysAxis[RAW_AXIS][BOOST_HORIZONTAL] =
      (0.7 * +!Global.keyboardController.isKeyPressed("Space") + 0.3) *
      (!Global.lockController.isLocked
        ? 0
        : -Global.keyboardController.isKeyPressed("KeyD") +
          +Global.keyboardController.isKeyPressed("KeyA"));

    // Smoothing inputs
    for (let index = 0; index < 4; index++) {
      this.keysAxis[LERPED_AXIS][index] = lerp(
        this.keysAxis[LERPED_AXIS][index],
        this.keysAxis[RAW_AXIS][index],
        Global.deltaTime * 7
      );
    }

    // Ignore small axis values (dead zone)
    for (let index = 0; index < 4; index++) {
      if (Math.abs(this.keysAxis[LERPED_AXIS][index]) < 0.05) {
        this.keysAxis[LERPED_AXIS][index] = 0;
      }
    }
  }

  public lastUpdate() {
    for (const down of this.keysDown) {
      this.keysPressed.add(down);
    }
    this.keysDown.clear();
    this.keysUp.clear();
  }

  public get vertical() {
    return this.keysAxis[LERPED_AXIS][VERTICAL];
  }
  public get horizontal() {
    return this.keysAxis[LERPED_AXIS][HORIZONTAL];
  }
  public get boostVertical() {
    return this.keysAxis[LERPED_AXIS][BOOST_VERTICAL];
  }
  public get boostHorizontal() {
    return this.keysAxis[LERPED_AXIS][BOOST_HORIZONTAL];
  }
  public get verticalRaw() {
    return this.keysAxis[RAW_AXIS][VERTICAL];
  }
  public get horizontalRaw() {
    return this.keysAxis[RAW_AXIS][HORIZONTAL];
  }
  public get boostHorizontalRaw() {
    return this.keysAxis[RAW_AXIS][BOOST_HORIZONTAL];
  }
  public get boostVerticalRaw() {
    return this.keysAxis[RAW_AXIS][BOOST_VERTICAL];
  }
}
