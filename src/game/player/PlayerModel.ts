import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Global } from "../store/Global";
import { DEG2RAD } from "three/src/math/MathUtils.js";

export class PlayerModel {
  public update: () => void;
  constructor(body: CANNON.Body) {
    const model = Global.assets.gltf.car.scene;
    model.scale.multiplyScalar(0.5);

    const backweels = model.getObjectByName("Back_Wheels_38")!;
    const frontweels = model.getObjectByName("Front_Wheels_47")!;
    const steeringweel = model.getObjectByName("Wheel_25")!;

    model.getObjectByName("Back_18")!.visible = false;

    this.update = () => {
      model.position.copy(body.position);
      model.quaternion.copy(body.quaternion);

      const forward = body.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
      const velocity = body.velocity.dot(forward) * DEG2RAD;

      backweels.rotateX(velocity);
      frontweels.rotation.y = Global.keyboardController.horizontal * 0.4;

      for (const [id, cf] of frontweels.children.entries()) {
        id < 2 ? cf.rotateY(velocity) : cf.rotateX(velocity);
      }

      steeringweel.rotation.set(0, 0, 0);
      steeringweel.rotateOnAxis(
        new THREE.Vector3(0, -0.425, 1),
        (-Global.keyboardController.horizontal * Math.PI * 2) / 3
      );
    };

    Global.scene.add(model);
  }
}
