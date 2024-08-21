import * as THREE from "three";
import { DriveController } from "../controller/EngineController";
import { Global } from "../store/Global";
import { Player } from "./Player";
import { PlayerModel } from "./PlayerModel";

export class LocalPlayer extends Player {
  private static instance: LocalPlayer;
  public forceMovement: boolean;
  setCameraAddon: any;
  cameraAddon: THREE.Vector3;
  static getInstance() {
    return this.instance;
  }
  constructor() {
    const group = new THREE.Group();
    super(group);
    this.forceMovement = false;
    this.cameraAddon = new THREE.Vector3();
    LocalPlayer.instance = this;

    const movementController = new DriveController(10, this);

    const model = new PlayerModel(this);

    const update = () => {
       movementController.update();

      Global.cameraController.update(this);

      model.update();
    };

    this.update.push(update);

    Global.world.addBody(this);
  }
}
