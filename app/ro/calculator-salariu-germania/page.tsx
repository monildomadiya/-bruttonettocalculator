import { ExpatCalcPage, expatMetadata } from "@/components/expat/ExpatPages";
import { RO } from "@/lib/expat/content-ro";

export const metadata = expatMetadata(RO, "calc");

export default function Page() {
  return <ExpatCalcPage c={RO} />;
}
