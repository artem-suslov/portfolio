import localFont from "next/font/local";

const testFamily = localFont({
  src: "../../../public/font/Test Family/TestFamily-Regular.otf",
  display: "swap",
  style: "normal",
  weight: "400",
});

export function HeroHeading() {
  return (
    <h1 className={testFamily.className}>
      Software designer focused
      <br />
      on B2C web and mobile products
    </h1>
  );
}
