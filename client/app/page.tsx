import dynamic from "next/dynamic";

const OrangeLanding = dynamic(() => import("@/components/layout/OrangeLanding").then((mod) => mod.OrangeLanding), {
  ssr: false,
});
const LegacyShell = dynamic(() => import("@/components/legacy/LegacyApp").then((mod) => mod.LegacyApp), {
  ssr: false,
});

const flagEnabled = process.env.NEXT_PUBLIC_ORANGE_NEW_UI === "true";

export default function Page() {
  if (!flagEnabled) {
    return <LegacyShell />;
  }

  return <OrangeLanding />;
}
