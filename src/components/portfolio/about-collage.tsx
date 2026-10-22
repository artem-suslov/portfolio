import { Caveat } from "next/font/google";
import Image from "next/image";
import type { CSSProperties, PointerEvent } from "react";
import { type AboutCollageSettings, type CollageItem, aboutCollage, collageMedia } from "@/data/about-collage";
import styles from "./about-collage.module.css";
import { CollageVideo } from "./collage-video";

const handwriting = Caveat({ subsets: ["latin"], weight: "500" });

type ItemPointerHandler = (id: string, event: PointerEvent<HTMLElement>) => void;

function CollagePhoto({
  item,
  onPointerDown,
  stageWidth,
}: {
  item: CollageItem;
  onPointerDown?: ItemPointerHandler;
  stageWidth: number;
}) {
  const media = collageMedia[item.id];

  if (!media) {
    return null;
  }

  const ratio = item.frame === "circle" ? 1 : media.ratio;

  return (
    <figure
      className={styles.item}
      data-frame={item.frame}
      onPointerDown={onPointerDown ? (event) => onPointerDown(item.id, event) : undefined}
      style={
        {
          "--item-x": item.x,
          "--item-y": item.y,
          "--item-width": item.width,
          "--item-rotate": `${item.rotate}deg`,
          "--item-ratio": ratio,
          "--caption-x": item.captionX,
          "--caption-y": item.captionY,
          zIndex: item.z,
        } as CSSProperties
      }
    >
      <div className={styles.media}>
        {media.kind === "video" ? (
          <CollageVideo label={media.alt} poster={media.poster} src={media.src} />
        ) : (
          <Image
            alt={media.alt}
            draggable={false}
            fill
            sizes={`(max-width: 760px) ${Math.ceil((item.width / stageWidth) * 100)}vw, ${item.width}px`}
            src={media.src}
          />
        )}
      </div>
      {item.caption ? (
        <figcaption className={`${styles.caption} ${handwriting.className}`}>{item.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function AboutCollage({
  editable = false,
  onItemPointerDown,
  settings = aboutCollage,
}: {
  /** Dev only: photos can be dragged around the stage. */
  editable?: boolean;
  onItemPointerDown?: ItemPointerHandler;
  settings?: AboutCollageSettings;
}) {
  return (
    <div
      className={styles.collage}
      data-editable={editable || undefined}
      style={
        {
          "--collage-width": settings.width,
          "--collage-height": settings.height,
          "--collage-spacing": `${settings.spacing}px`,
          "--collage-frame-padding": settings.framePadding,
          "--collage-caption-size": settings.captionSize,
          "--collage-hover-scale": settings.hoverScale,
          "--collage-shadow": settings.shadow,
        } as CSSProperties
      }
    >
      {settings.items
        .filter(({ visible }) => visible)
        .map((item) => (
          <CollagePhoto
            item={item}
            key={item.id}
            onPointerDown={editable ? onItemPointerDown : undefined}
            stageWidth={settings.width}
          />
        ))}
    </div>
  );
}
