import * as PIXI from "pixi.js";
// import {AssetLoader} from "./AssetLoader"
import { StakeControl } from "../ui/StakeControl";
import { GameButtons } from "../ui/GameButtons";
import { ReelArea } from "../reels/ReelArea";
import { Assets } from "pixi.js";
export class GameScreen extends PIXI.Container {
  // textures: Record<string, PIXI.Texture >
  stakeControl: StakeControl;
  gameButtons: GameButtons;
  reelArea: ReelArea;
  app: PIXI.Application;
  constructor(app: PIXI.Application) {
    super();
    this.app = app;

    this.stakeControl = new StakeControl(this.app);
    this.reelArea = new ReelArea(this.app);
    this.gameButtons = new GameButtons(this.app);

    
    this.gameButtons.on("spin", () => {
      this.reelArea.startSpin();
      //  this.stakeControl.UpdateBalance();
    });
  
    this.reelArea.on("spinStart", () => {
      this.stakeControl.UpdateBalance();
    });
    this.gameButtons.on("turboSpinOn", () => {
      this.reelArea.setTurbo(true);
    });

    this.gameButtons.on("turboSpinOff", () => {
      this.reelArea.setTurbo(false);
    });

    // When reel starts → disable button
    this.reelArea.on("spinStart", () => {
      this.gameButtons.disableSpin();
    });

    // When reel completes → enable button
    this.reelArea.on("spinComplete", () => {
      this.gameButtons.enableSpin();
    });
    // this.textures = AssetLoader.textures;
    //         this.gameButtons.onSpin = () => {
    //         if (!this.reelArea.isSpinning) {
    //         this.reelArea.spin();
    //         this.stakeControl.UpdateBalance();
    //        }
    // };
    this.build();
  }
static async getRandomNumber(min: number, max: number): Promise<number> {
    const response = await fetch(
      `https://random-data-api.com/api/number/random_number?min=${min}&max=${max}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch random number");
    }

    const data = await response.json();

    return data.random_number;
  }
}
Clean. Typed. Reusable.

✅ Step 2 — Use It Anywhere
Example inside your slot engine:

ts
Copy code
import { RandomService } from "./services/RandomService";

async function spin() {
  try {
    const random = await RandomService.getRandomNumber(0, 5);
    console.log("Random index:", random);
  } catch (err) {
    console.error(err);
  }
}

spin();
🔹 Option 2 — Using QRNG (Quantum one)
If you want the ANU quantum API:

Service version:
ts
Copy code
export class RandomService {
  static async getQuantumRandom(): Promise<number> {
    const response = await fetch(
      "https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8"
    );

    const data = await response.json();
    return data.data[0];
  }
}
🔹 If You're Using Node < 18
Install fetch manually:

bash
Copy code
npm install node-fetch
Then:

ts
Copy code
import fetch from "node-fetch";
🔹 Pro Tip (Since You're Building Slot Logic 🎰)
If you're using this for game logic:

⚠️ Never rely on external API for production slot randomness.

Network delay

API downtime

Manipulation risks

For games, use:

ts
Copy code
crypto.getRandomValues(new Uint32Array(1))[0]
Or:

ts
Copy code
import { randomInt } from "crypto";
🔥 Actually… Real Talk
For your slot engine, you don’t even need an API.

This is better:

ts
Copy code
const randomIndex = Math.floor(Math.random() * symbolCount);
Or cryptographically safer:

ts
Copy code
const randomIndex = crypto.randomInt(0, symbolCount);
Faster.
No network call.
No dependency.
No latency.

If you tell me:

Is this for slot spin result?

Or for some backend fairness system?

Or just experimenting?

I’ll guide you the right architecture choice for your setup 👀









  build() {
    const gameLogo = new PIXI.Sprite(Assets.get("7.png"));
    gameLogo.scale.set(0.123);
    gameLogo.anchor.set(0.5, 0);
    gameLogo.position.set(260, 110);

    const playScreen = new PIXI.Container();

    const playScreenFg = new PIXI.Sprite(Assets.get("reelframe.png"));
    playScreenFg.scale.set(0.48);
    playScreenFg.anchor.set(0.5, 0.5);
    playScreenFg.position.set(
      this.app.screen.width / 2 + 63,
      this.app.screen.height / 2
    );

    const playScreenBg = new PIXI.Sprite(Assets.get("reelFrameBG.png"));
    playScreenBg.scale.set(0.48);
    playScreenBg.anchor.set(0.5, 0.5);
    playScreenBg.position.set(
      this.app.screen.width / 2 + 63,
      this.app.screen.height / 2
    );

    playScreen.addChild(playScreenBg, playScreenFg, this.reelArea);

    this.addChild(gameLogo, playScreen, this.gameButtons, this.stakeControl);
  }
}
