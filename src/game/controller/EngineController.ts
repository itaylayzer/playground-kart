import * as CANNON from "cannon-es";
import { Global } from "../store/Global";

import * as THREE from "three";

export class DriveController {
  private steeringAngle: number;
  private readonly maxSteeringAngle: number;
  private raycaster: THREE.Raycaster;
  private lastPosition: CANNON.Vec3;
  constructor(private maxSpeed: number, private body: CANNON.Body) {
    this.steeringAngle = 0;
    this.maxSteeringAngle = 30; // Limit steering angle (30 degrees)
    this.lastPosition = this.body.position.clone();
    this.raycaster = new THREE.Raycaster();
  }

  putToGround() {
    this.raycaster.set(
      new THREE.Vector3()
        .copy(this.body.position)
        .add(new THREE.Vector3(0, 0.2, 0)),
      new THREE.Vector3(0, -1, 0).applyQuaternion(this.body.quaternion)
    );
    const intercetions = this.raycaster.intersectObject(Global.roadMesh);

    if (intercetions.length === 0) return;

    const closestIntersection = intercetions.reduce((a, b) =>
      a.distance > b.distance ? b : a
    );

    if (closestIntersection.distance > 1) {
      this.body.position.copy(this.lastPosition);
      return;
    }
    this.lastPosition.copy(this.body.position);

    // const up = closestIntersection.normal;

    const groundPoint = closestIntersection.point!;
    const groundNormal = closestIntersection.normal;

    // Adjust the kart's position to the ground
    this.body.position.y = groundPoint.y;

    if (groundNormal === undefined) return;

    // Convert the current up vector and ground normal to CANNON.Vec3
    const currentUp = this.body.quaternion.vmult(new CANNON.Vec3(0, 1, 0));
    const groundNormalCannon = new CANNON.Vec3(
      groundNormal.x,
      groundNormal.y,
      groundNormal.z
    );

    // Calculate the quaternion needed to align the up vector with the ground normal
    const alignUpQuat = new CANNON.Quaternion();
    alignUpQuat.setFromVectors(currentUp, groundNormalCannon);

    // Apply the alignment quaternion to the current quaternion
    this.body.quaternion = alignUpQuat.mult(this.body.quaternion);
  }

  update() {
    this.putToGround();
    // Determine forward direction
    const forward = new CANNON.Vec3(0, 0, 1);
    this.body.quaternion.vmult(forward, forward);

    // Apply forward/reverse force
    const drivingForce = forward.scale(
      Global.keyboardController.boostVertical * this.maxSpeed * 2
    );

    // Calculate and apply friction (simplified)
    const velocity = this.body.velocity.clone();
    const frictionForce = velocity.scale(-2); // Adjust friction coefficient as needed

    // Combine driving force and friction
    const totalForce = drivingForce.vadd(frictionForce);
    this.body.force.copy(totalForce);

    // Steering mechanics
    this.steeringAngle =
      Global.keyboardController.boostHorizontal *
      this.maxSteeringAngle *
      Global.keyboardController.boostVertical;
    // Calculate the steering direction using quaternion
    const steeringQuaternion = new CANNON.Quaternion();
    steeringQuaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      this.steeringAngle * 0.1 * Global.deltaTime
    );

    // Apply steering by rotating the kart's quaternion
    this.body.quaternion.mult(steeringQuaternion, this.body.quaternion);

    // Optional: Apply angular damping to stabilize turning
    const angularDamping = 0.95;
    this.body.angularVelocity.scale(angularDamping, this.body.angularVelocity);

    document.querySelector("p#velocity")!.innerHTML = `${Math.abs(
      this.body.velocity.dot(forward)
    ).toFixed(2)} KM/S`;
  }
}
