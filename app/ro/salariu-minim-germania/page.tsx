import { ExpatMindestlohnPage, expatMetadata } from "@/components/expat/ExpatPages";
import { RO } from "@/lib/expat/content-ro";

export const metadata = expatMetadata(RO, "mindestlohn");

export default function Page() {
  return <ExpatMindestlohnPage c={RO} />;
}
