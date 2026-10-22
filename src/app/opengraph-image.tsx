import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_TITLE } from "@/lib/site";

export const alt = SITE_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const assetsDir = join(process.cwd(), "src/app/_og");

async function readAsset(name: string) {
  return readFile(join(assetsDir, name));
}

function toDataUrl(data: Buffer, mime: string) {
  return `data:${mime};base64,${data.toString("base64")}`;
}

export default async function OpengraphImage() {
  const [geistRegular, geistSemiBold, avatar, phones] = await Promise.all([
    readAsset("Geist-Regular.ttf"),
    readAsset("Geist-SemiBold.ttf"),
    readAsset("avatar.png"),
    readAsset("phones.jpg"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#ededed",
          display: "flex",
          fontFamily: "Geist",
          height: "100%",
          padding: 32,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: 40,
            display: "flex",
            flex: 1,
            overflow: "hidden",
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "28px 40px 36px 40px",
              width: 500,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
            <img
              alt=""
              height={210}
              src={toDataUrl(avatar, "image/png")}
              style={{ marginLeft: -12 }}
              width={200}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  color: "#111111",
                  fontSize: 60,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                Artem Suslov
              </div>
              <div
                style={{
                  color: "#6b6b6b",
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 34,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                <span>Product Designer</span>
                <span>who can ship frontend</span>
              </div>
            </div>
            <div style={{ color: "#9a9a9a", fontSize: 24, letterSpacing: "-0.01em" }}>
              artemsuslov.com
            </div>
          </div>
          {/* A background image, not <img>: Satori clips it to the rounded corners. */}
          <div
            style={{
              backgroundColor: "#f8f8f8",
              backgroundImage: `url(${toDataUrl(phones, "image/jpeg")})`,
              backgroundPosition: "-160px 20px",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1016px 556px",
              borderRadius: 28,
              display: "flex",
              flex: 1,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { data: geistRegular, name: "Geist", style: "normal", weight: 400 },
        { data: geistSemiBold, name: "Geist", style: "normal", weight: 600 },
      ],
    },
  );
}
