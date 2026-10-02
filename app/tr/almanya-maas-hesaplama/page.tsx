import { ExpatCalcPage, expatMetadata } from "@/components/expat/ExpatPages";
import { TR } from "@/lib/expat/content-tr";

export const metadata = expatMetadata(TR, "calc");

export default function Page() {
  return <ExpatCalcPage c={TR} />;
}
