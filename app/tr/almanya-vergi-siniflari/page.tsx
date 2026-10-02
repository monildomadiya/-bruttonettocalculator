import { ExpatKlassenPage, expatMetadata } from "@/components/expat/ExpatPages";
import { TR } from "@/lib/expat/content-tr";

export const metadata = expatMetadata(TR, "klassen");

export default function Page() {
  return <ExpatKlassenPage c={TR} />;
}
