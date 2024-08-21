import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Global } from "../store/Global";

export class PlayerModel {
  public update: () => void;
  constructor(body: CANNON.Body) {
    const model = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: "brown" })
    );
    this.update = () => {
      model.position.copy(body.position);
      model.quaternion.copy(body.quaternion);
    };

    Global.scene.add(model);
  }
}
