import * as THREE from "three";
import { DriveController } from "../controller/EngineController";
import { Global } from "../store/Global";
import { Player } from "./Player";
import { PlayerModel } from "./PlayerModel";

export class LocalPlayer extends Player {
  private static instance: LocalPlayer;
  public forceMovement: boolean;
  private driveController: DriveController;
  setCameraAddon: any;
  static getInstance() {
    return this.instance;
  }
  constructor() {
    const group = new THREE.Group();
    super(group);

    this.position.set(29, 0, 40);
    group.position.set(29, 0, 40);
    this.forceMovement = false;
    LocalPlayer.instance = this;

    this.driveController = new DriveController(10, this);

    const model = new PlayerModel(this);

    const update = () => {
      this.driveController.update();

      Global.cameraController.update(this);

      model.update();
    };

    this.update.push(update);

    Global.world.addBody(this);
  }
  public setMaxSpeed(speed: number) {
    this.driveController.maxSpeed = speed;
  }
}
