/** The About Me section: a loose collage of personal photos and clips. */

export type CollageFrame = "circle" | "oval" | "photo" | "plain" | "scallop" | "stamp" | "ticket";

export type CollageMedia = {
  alt: string;
  kind: "image" | "video";
  /** Videos only: the first frame, shown until the clip plays. */
  poster?: string;
  /** Width / height of the file. */
  ratio: number;
  src: string;
};

export type CollageItem = {
  /** Handwritten note next to the photo; empty for none. */
  caption: string;
  /** Note offset from the photo's bottom center, in stage pixels. */
  captionX: number;
  captionY: number;
  frame: CollageFrame;
  /** Key in collageMedia; also the item's name in the dev panel. */
  id: string;
  /** Degrees. */
  rotate: number;
  visible: boolean;
  /** Width in stage pixels; the height follows the file's ratio (circles are square). */
  width: number;
  /** Center of the photo in stage pixels. */
  x: number;
  y: number;
  /** Stacking order: higher sits on top. */
  z: number;
};

export type AboutCollageSettings = {
  /** Handwritten note size in stage pixels. */
  captionSize: number;
  /** One frame for every photo, or "mixed" to keep each photo's own. */
  frame: CollageFrame | "mixed";
  /** Frame color: the border of photo, oval and die-cut frames. */
  frameColor: string;
  /** Frame thickness in stage pixels. */
  framePadding: number;
  /** Size of the stamp's holes, the scallop's bumps and the ticket's notches, relative to the frame. */
  cutSize: number;
  /** Corner radius of the picture inside scallop and ticket frames, in stage pixels. */
  innerRadius: number;
  /** Stage height in stage pixels. */
  height: number;
  /** How much a photo grows on hover; 1 turns it off. */
  hoverScale: number;
  items: CollageItem[];
  /** Space above the stage on phones (≤760px), where the stage is much smaller. */
  mobileSpacing: number;
  /** 0–1: strength of the drop shadow under every photo. */
  shadow: number;
  /** Space between the text above and the stage; negative pulls the stage up under it. */
  spacing: number;
  /** Stage width at full size; the whole collage scales down with the page below it. */
  width: number;
};

const image = (src: string, ratio: number, alt: string): CollageMedia => ({
  alt,
  kind: "image",
  ratio,
  src: `/images/about/${src}.webp`,
});

const video = (src: string, ratio: number, alt: string): CollageMedia => ({
  alt,
  kind: "video",
  poster: `/images/about/${src}-poster.webp`,
  ratio,
  src: `/images/about/${src}.mp4`,
});

export const collageMedia: Record<string, CollageMedia> = {
  "coconut-desk": image("coconut-desk", 0.75, "Laptop and a coconut on a desk by the window"),
  cowork: image("cowork", 0.75, "Laptop in a coworking space"),
  "cowork-2": image("cowork-2", 0.75, "Working on a laptop in a coworking space"),
  friends: image("friends", 1.507, "Hanging out with a friend on a balcony"),
  "gas-station": image("gas-station", 0.563, "Filling up the motorbike at a gas station at night"),
  "home-setup": image("home-setup", 0.75, "Home desk setup at night"),
  "laptop-desk": image("laptop-desk", 0.75, "MacBook on a wooden desk"),
  "laptop-night": image("laptop-night", 0.75, "MacBook open in a dark room"),
  "moto-711": image("moto-711", 0.75, "Me on a motorbike outside a 7-Eleven"),
  "moto-green": image("moto-green", 0.639, "Motorbike under green lights at night"),
  "moto-night": image("moto-night", 0.664, "Me on a motorbike on a night road"),
  "moto-ride": video("moto-ride", 0.5625, "Riding a motorbike by the sea"),
  "moto-sea": image("moto-sea", 0.75, "Motorbike parked above the sea"),
  pickup: image("pickup", 0.664, "Sitting on the back of a pickup at night"),
  "rolling-loud": image("rolling-loud", 0.75, "Rolling Loud festival stage at night"),
  skyline: image("skyline", 0.75, "City skyline at night, a face mask in front"),
  "st-isaacs": image("st-isaacs", 0.75, "Saint Isaac's Cathedral at night"),
  sunset: image("sunset", 0.664, "Standing on a hill at sunset"),
  "sunset-2": image("sunset-2", 0.664, "Standing by the sea at sunset"),
  "sunset-3": video("sunset-3", 1, "A video selfie at sunset"),
  "sunset-peace": image("sunset-peace", 0.664, "Peace signs at sunset"),
  teeth: video("teeth", 1, "A video selfie at the dentist"),
  tennis: video("tennis", 1, "A video selfie in a dark room"),
  "video-note": video("video-note", 1, "A video selfie in sunglasses and a hat"),
};

// "Save to code" in the collage's DialKit panel rewrites everything between these markers.
// ABOUT_COLLAGE_START
export const aboutCollage: AboutCollageSettings = {
  captionSize: 22,
  cutSize: 1.6,
  frame: "mixed",
  frameColor: "#f1f1f1",
  framePadding: 6,
  height: 961,
  hoverScale: 1.04,
  innerRadius: 29,
  items: [
    { id: "st-isaacs", visible: true, frame: "circle", x: 266, y: 256, width: 200, rotate: 10.5, z: 2, caption: "🏠 St. Petersburg", captionX: -24, captionY: 19 },
    { id: "home-setup", visible: true, frame: "photo", x: 485, y: 256, width: 210, rotate: -11, z: 1, caption: "Home setup", captionX: -66, captionY: -293 },
    { id: "video-note", visible: false, frame: "circle", x: 785, y: 492, width: 220, rotate: 4, z: 2, caption: "", captionX: 0, captionY: 30 },
    { id: "coconut-desk", visible: false, frame: "photo", x: 210, y: 610, width: 230, rotate: -6, z: 3, caption: "", captionX: 0, captionY: 30 },
    { id: "rolling-loud", visible: true, frame: "photo", x: 736, y: 677, width: 154, rotate: -8, z: 9, caption: "Rolling Loud 2023", captionX: -10, captionY: 23 },
    { id: "moto-ride", visible: false, frame: "plain", x: 345, y: 534, width: 169, rotate: -16.5, z: 0, caption: "", captionX: 0, captionY: 30 },
    { id: "friends", visible: false, frame: "photo", x: 308, y: 467, width: 340, rotate: -3, z: 5, caption: "", captionX: 0, captionY: 30 },
    { id: "sunset-peace", visible: true, frame: "stamp", x: 535, y: 503, width: 288, rotate: 4, z: 13, caption: "", captionX: 0, captionY: 25 },
    { id: "skyline", visible: true, frame: "circle", x: 730, y: 222, width: 223, rotate: 19.5, z: 5, caption: "SUUUUUUIIIIII", captionX: 7, captionY: -246 },
    { id: "moto-sea", visible: false, frame: "photo", x: 500, y: 417, width: 240, rotate: -2, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "moto-711", visible: false, frame: "photo", x: 500, y: 550, width: 240, rotate: 3, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "moto-green", visible: true, frame: "plain", x: 324, y: 502, width: 136, rotate: -4, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "moto-night", visible: false, frame: "photo", x: 134, y: 550, width: 220, rotate: 2, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "gas-station", visible: false, frame: "plain", x: 500, y: 550, width: 200, rotate: -3, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "sunset", visible: false, frame: "photo", x: 633, y: 353, width: 220, rotate: 4, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "pickup", visible: false, frame: "photo", x: 500, y: 550, width: 220, rotate: -2, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "laptop-night", visible: false, frame: "plain", x: 500, y: 550, width: 220, rotate: 3, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "laptop-desk", visible: false, frame: "plain", x: 500, y: 550, width: 220, rotate: -3, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "cowork", visible: false, frame: "photo", x: 500, y: 550, width: 220, rotate: 2, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "cowork-2", visible: true, frame: "stamp", x: 316, y: 733, width: 173, rotate: 18, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "sunset-2", visible: false, frame: "photo", x: 500, y: 900, width: 200, rotate: -5, z: 16, caption: "", captionX: 0, captionY: 30 },
    { id: "tennis", visible: true, frame: "circle", x: 537, y: 789, width: 195, rotate: -5.5, z: 14, caption: "Tired on tennis practice", captionX: 0, captionY: 30 },
    { id: "teeth", visible: true, frame: "circle", x: 186, y: 566, width: 150, rotate: -12.5, z: 8, caption: "", captionX: 0, captionY: 30 },
    { id: "sunset-3", visible: true, frame: "circle", x: 795, y: 464, width: 229, rotate: 5, z: 9, caption: "", captionX: 0, captionY: 30 },
  ],
  mobileSpacing: 24,
  shadow: 0.6,
  spacing: -40,
  width: 1046,
};
// ABOUT_COLLAGE_END
