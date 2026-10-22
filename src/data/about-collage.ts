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
  /** 0–1: strength of the drop shadow under every photo. */
  shadow: number;
  /** Space between the heading and the stage. */
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
  "sunset-peace": image("sunset-peace", 0.664, "Peace signs at sunset"),
  "video-note": video("video-note", 1, "A video selfie in sunglasses and a hat"),
};

// "Save to code" in the collage's DialKit panel rewrites everything between these markers.
// ABOUT_COLLAGE_START
export const aboutCollage: AboutCollageSettings = {
  captionSize: 22,
  cutSize: 1,
  frame: "mixed",
  frameColor: "#ffffff",
  framePadding: 10,
  height: 1080,
  hoverScale: 1.04,
  innerRadius: 10,
  items: [
    { id: "st-isaacs", visible: true, frame: "oval", x: 226, y: 254, width: 200, rotate: -4, z: 2, caption: "St. Petersburg", captionX: 0, captionY: 30 },
    { id: "home-setup", visible: true, frame: "stamp", x: 485, y: 256, width: 210, rotate: -11, z: 1, caption: "Home setup", captionX: -66, captionY: -293 },
    { id: "video-note", visible: true, frame: "circle", x: 759, y: 479, width: 220, rotate: 4, z: 2, caption: "", captionX: 0, captionY: 30 },
    { id: "coconut-desk", visible: false, frame: "photo", x: 210, y: 610, width: 230, rotate: -6, z: 3, caption: "", captionX: 0, captionY: 30 },
    { id: "rolling-loud", visible: true, frame: "plain", x: 346, y: 476, width: 184, rotate: 16.5, z: 0, caption: "Rolling Loud", captionX: -150, captionY: -20 },
    { id: "moto-ride", visible: true, frame: "plain", x: 298, y: 715, width: 169, rotate: -16.5, z: 4, caption: "", captionX: 0, captionY: 30 },
    { id: "friends", visible: false, frame: "photo", x: 292, y: 800, width: 340, rotate: -3, z: 5, caption: "", captionX: 0, captionY: 30 },
    { id: "sunset-peace", visible: true, frame: "photo", x: 532, y: 527, width: 230, rotate: 4, z: 6, caption: "", captionX: 0, captionY: 30 },
    { id: "skyline", visible: true, frame: "circle", x: 711, y: 255, width: 190, rotate: 19.5, z: 5, caption: "SUUUUUUIIIIII", captionX: 7, captionY: -211 },
    { id: "moto-sea", visible: false, frame: "photo", x: 500, y: 417, width: 240, rotate: -2, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "moto-711", visible: false, frame: "photo", x: 500, y: 550, width: 240, rotate: 3, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "moto-green", visible: false, frame: "plain", x: 500, y: 550, width: 220, rotate: -4, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "moto-night", visible: false, frame: "photo", x: 500, y: 550, width: 220, rotate: 2, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "gas-station", visible: false, frame: "plain", x: 500, y: 550, width: 200, rotate: -3, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "sunset", visible: false, frame: "photo", x: 633, y: 353, width: 220, rotate: 4, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "pickup", visible: false, frame: "photo", x: 500, y: 550, width: 220, rotate: -2, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "laptop-night", visible: false, frame: "plain", x: 500, y: 550, width: 220, rotate: 3, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "laptop-desk", visible: false, frame: "plain", x: 500, y: 550, width: 220, rotate: -3, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "cowork", visible: false, frame: "photo", x: 500, y: 550, width: 220, rotate: 2, z: 7, caption: "", captionX: 0, captionY: 30 },
    { id: "cowork-2", visible: true, frame: "photo", x: 733, y: 728, width: 162, rotate: 20.5, z: 7, caption: "", captionX: 0, captionY: 30 },
  ],
  shadow: 0.6,
  spacing: 32,
  width: 1000,
};
// ABOUT_COLLAGE_END
