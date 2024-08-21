import { GoDotFill } from "react-icons/go";
import AssetLoader from "../components/AssetLoader";
import { useStyles } from "../hooks/useStyles";
import { useApScreens } from "../viewmodels";

function App() {
  useApScreens();

  return (
    <>
      <div style={styles.gameContainer} className="gameContainer">
        <div style={styles.dot}>
          <GoDotFill color="white" size={10} />
        </div>
      </div>
      <p style={styles.header}>
        kart | kart -{" "}
        <a style={styles.href} href="http://itaylayzer.github.io/">
          itay layzer
        </a>
        <br />
        move with A,S,D,W. boost with Space
        <br />
        drift with LeftShift. unlock with Escape
      </p>

      <p id="velocity" style={styles.velocity}>
        0.00 KM/S
      </p>
    </>
  );
}

const styles = useStyles({
  gameContainer: {
    display: "block",
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  header: {
    zIndex: 2,
    color: "white",
    fontSize: 16,
    position: "absolute",
    boxSizing: "border-box",
    display: "block",
    top: 0,
    left: "50%",
    fontFamily: "monospace",
    textAlign: "center",
    translate: "-50% 0%",
    width: "fit-content",
  },
  href: {
    color: "rgb(41, 131, 255)",
  },
  container: {
    display: "flex",
    position: "absolute",
    boxSizing: "border-box",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    minHeight: "100%",
    minWidth: "100%",
    justifyContent: "center",
    flexDirection: "row-reverse",
  },

  dot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    translate: "-50% -50%",
  },
  ui: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 3,
    pointerEvents: "none",
  },
  swords: {
    position: "absolute",
    bottom: 50,
    left: 80,
    width: 250,
    backgroundColor: "#080808",
    rotate: "-2deg",
    display: "flex",
    justifyContent: "space-around",
  },
  speakingIcon: {
    position: "absolute",
    bottom: 50,
    left: 25,
    rotate: "-2deg",
    transition: ".3s opacity, scale .3s",
    scale: "0.9",
    opacity: "0",
  },
  doesSpeak: {
    scale: "1",
    opacity: "1",
  },
  guns: {
    position: "absolute",
    bottom: 50,
    right: 50,
    width: 300,
    backgroundColor: "#080808",
    rotate: "2deg",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row-reverse",
  },
  selectb: {
    background: "rgb(0,0,0,0)",
    border: 0,
    outline: 0,
    padding: 10,
    paddingInline: 20,
    transition: "opacity .3s, scale .3s",
    scale: "0.6",
    opacity: "0.2",
  },
  seletbselected: {
    scale: "1",
    opacity: "1",
  },
  velocity: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "red",
    margin: 0,
    color: "white",
    fontFamily: "monospace",
    padding: 2,
    fontSize: 14,
  },
});

export default () => (
  <AssetLoader
    items={{
      // sfx_throw:"https://soxundbible.com/mp3/kung_fu_punch-Mike_Koenig-2097967259.mp3"
      sfx_throw: "sfx/throw.mp3",
      sfx_exp: "sfx/exp.mp3",
      sfx_shoot: "sfx/shoot.mp3",
      txt_circle: "textures/circle.png",
    }}
  >
    <App />
  </AssetLoader>
);
