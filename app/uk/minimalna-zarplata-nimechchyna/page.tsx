import { ExpatMindestlohnPage, expatMetadata } from "@/components/expat/ExpatPages";
import { UK } from "@/lib/expat/content-uk";

export const metadata = expatMetadata(UK, "mindestlohn");

export default function Page() {
  return <ExpatMindestlohnPage c={UK} />;
}
