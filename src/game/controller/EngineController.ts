import * as CANNON from "cannon-es";
import { Global } from "../store/Global";

import {
  Emitter,
  Rate,
  Span,
  Position,
  Radius,
  Life,
  PointZone,
  Vector3D,
  Alpha,
  Scale,
  Color,
  RadialVelocity,
  ease,
  ColorSpan,
  Texture,
} from "three-nebula";
import * as THREE from "three";

export class DriveController {
  private steeringAngle: number;
  private readonly maxSteeringAngle: number;
  private emitter: Emitter;
  constructor(private maxSpeed: number, private body: CANNON.Body) {
    this.steeringAngle = 0;
    this.maxSteeringAngle = 30; // Limit steering angle (30 degrees)

    this.emitter = new Emitter();

    this.setupInits(false);
    this.emitter
      .setRate(new Rate(new Span(1, 1), new Span(0, 0)))
      .setBehaviours([
        new Alpha(1, 0.1, undefined, ease.easeInExpo),
        new Scale(1, 0.1, undefined, ease.easeInExpo),
        // @ts-ignore
        new Color(
          // @ts-ignore
          new ColorSpan([
            "#d61e1e",
            "#db1f12",
            "#e06a09",
            "#d61e1e",
            "#db1f12",
            "#e06a09",
            "#d61e1e",
            "#db1f12",
            "#e06a09",
            "#ffffff",
            "#ffffff",
          ])
        ),
      ]);
    this.emitter.emit();
  }

  private setupInits(isLife: boolean) {
    const inits = [
      new Position(new PointZone(0, 0, 0)),
      new Radius(0.1, 0.2),
      new Life(
        // @ts-ignore
        isLife
          ? // @ts-ignore
            new Span(0.4, 2)
          : // @ts-ignore
            0
      ),

      new RadialVelocity(
        // @ts-ignore
        new Span(5, 10),
        new Vector3D(0, 0, -1),
        5
      ),

      new Texture(THREE, Global.assets.textures.txt_circle, {
        blending: THREE.NormalBlending,
      }),
    ];

    this.emitter.setInitializers(inits);
  }

  update() {
    Global.system.addEmitter(this.emitter);

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

    this.emitter.setPosition(this.body.position);
    const direction = new THREE.Vector3().copy(forward.clone().scale(1));
    // Normalize the direction vector (important to avoid scaling effects)
    direction.normalize();

    // Create a quaternion that points in the direction of the vector
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);

    // Convert the quaternion to Euler angles
    const euler = new THREE.Euler().setFromQuaternion(quaternion, "XYZ");

    this.emitter.setRotation(euler);

    if (Global.keyboardController.isKeyUp("Space")) {
      this.setupInits(false);
    }
    if (Global.keyboardController.isKeyDown("Space")) {
      this.setupInits(true);
    }
  }
}
