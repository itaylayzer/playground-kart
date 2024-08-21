import { Audio, AudioListener, PositionalAudio } from "three";
import { Global } from "../store/Global";

export class AudioManager<T extends string> {
    private listener: AudioListener;
    constructor(private audios: Record<T, AudioBuffer>) {
        this.listener = new AudioListener().setMasterVolume(0.5);

        Global.camera.add(this.listener);
    }

    playAt(trackName: T, distance: number) {
        const audio = new PositionalAudio(this.listener)
            .setBuffer(this.audios[trackName])
            .setLoop(false)
            .setVolume(1);

        audio.setRefDistance(100 / distance);
        audio.play();
    }
    play(trackName: T) {
        new Audio(this.listener)
            .setBuffer(this.audios[trackName])
            .setLoop(false)
            .setVolume(1)
            .play();
    }

    public setMasterVolume(vol: number) {
        this.listener.setMasterVolume(vol);
    }
}
