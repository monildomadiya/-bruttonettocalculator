import { ExpatCalcPage, expatMetadata } from "@/components/expat/ExpatPages";
import { UK } from "@/lib/expat/content-uk";

export const metadata = expatMetadata(UK, "calc");

export default function Page() {
  return <ExpatCalcPage c={UK} />;
}
