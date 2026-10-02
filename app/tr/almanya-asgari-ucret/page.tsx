import { ExpatMindestlohnPage, expatMetadata } from "@/components/expat/ExpatPages";
import { TR } from "@/lib/expat/content-tr";

export const metadata = expatMetadata(TR, "mindestlohn");

export default function Page() {
  return <ExpatMindestlohnPage c={TR} />;
}
