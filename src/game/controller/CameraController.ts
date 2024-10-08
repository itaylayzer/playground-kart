import * as THREE from "three";
import { Global } from "../store/Global";
import { LocalPlayer } from "../player/LocalPlayer";
import * as CANNON from "cannon-es";
import { damp } from "three/src/math/MathUtils.js";
function explodeFn(t: number) {
  return t < Math.PI * 4
    ? (100 * Math.sin(t + Math.PI)) / Math.pow(t + Math.PI, 3)
    : 0;
}
function randomSign() {
  if (Math.random() > 0.66) return -1;
  if (Math.random() < 0.33) return 1;
  return 0;
}

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public static sensitivity: number = 50;
  private time: number;
  private driftSide: [number, number];

  private forceRotation: THREE.Vector3;
  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    camera.rotation.y = Math.PI;
    this.time = Math.PI * 4;
    this.driftSide = [0, 0];

    this.forceRotation = new THREE.Vector3();
  }

  public update(body: LocalPlayer) {
    if (Global.keyboardController.isKeyDown("Space")) {
      this.driftSide[0] = Global.keyboardController.horizontalRaw * 0.6;
    }
    if (Global.keyboardController.isKeyUp("Space")) {
      this.driftSide[0] = 0;
    }

    this.driftSide[1] = damp(
      this.driftSide[1],
      this.driftSide[0],
      1.5,
      Global.deltaTime * 7
    );

    const vec = new THREE.Vector3().copy(body.position);
    const forwardVec = new THREE.Vector3().copy(
      body.quaternion.vmult(new CANNON.Vec3(0, 0, 1))
    );
    const rightVec = body.quaternion.vmult(new CANNON.Vec3(1, 0, 0));
    const upVec = body.quaternion.vmult(new CANNON.Vec3(0, 1, 0));

    rightVec
      .clone()
      .scale(
        1 * (Global.keyboardController.horizontal + this.driftSide[1]),
        rightVec
      );
    const lookVec = new CANNON.Vec3().copy(rightVec.clone().scale(0.5 / 3));

    this.camera.position
      .copy(vec)
      .add(
        forwardVec
          .clone()
          .multiplyScalar(-1 / 2 + -Global.keyboardController.vertical / 5)
      )
      .add(rightVec.scale(0.5 / 2))
      .add(new THREE.Vector3().copy(upVec.scale(1 / 2)));

    lookVec.vadd(body.position, lookVec);
    lookVec.vadd(new CANNON.Vec3(0, 0.6 / 3, 0), lookVec);

    this.camera.lookAt(new THREE.Vector3().copy(lookVec));
    this.camera.rotateZ(
      (Global.keyboardController.horizontal + this.driftSide[1]) * 0.05
    );

    this.time += Global.deltaTime * 13;
    this.camera.rotation.z += this.forceRotation.z * explodeFn(this.time);
    this.camera.rotation.x += this.forceRotation.x * explodeFn(this.time);
    this.camera.rotation.y += this.forceRotation.y * explodeFn(this.time);
  }

  shake(distance: number) {
    this.time = 0; //0.93656;
    this.forceRotation.z =
      (randomSign() * Math.random()) / (distance * distance);
    this.forceRotation.x = (randomSign() * Math.random()) / distance;
    this.forceRotation.y = (randomSign() * Math.random()) / distance;
  }
}
