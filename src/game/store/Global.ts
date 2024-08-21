import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { KeyboardController } from "../controller/KeyboardController";
import { MouseController } from "../controller/MouseController";
import { World } from "cannon-es";
import { CameraController } from "../controller/CameraController";

import CannonDebugger from "cannon-es-debugger";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { loadedAssets } from "@/src/viewmodels/useAssetLoader";
import { Action } from "@/src/hooks/useDestroy";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import { LocalPlayer } from "../player/LocalPlayer";
import { AudioManager } from "../managers/AudioManager";
import System from "three-nebula";

export class Global {
    public static keyboardController: KeyboardController;
    public static mouseController: MouseController;
    public static scene: Scene;
    public static world: World;
    public static container: HTMLDivElement;
    public static renderer: WebGLRenderer;
    public static camera: PerspectiveCamera;
    public static cameraController: CameraController;
    public static cannonDebugger: ReturnType<typeof CannonDebugger>;
    public static deltaTime: number = 0;
    public static stats: Stats;
    public static assets: loadedAssets;
    public static updates: Action[];
    public static lockController: PointerLockControls;
    public static localPlayer: LocalPlayer;
    public static audioManager: AudioManager<"throw" | "exp" | "shoot">;
    public static system: System;
}
