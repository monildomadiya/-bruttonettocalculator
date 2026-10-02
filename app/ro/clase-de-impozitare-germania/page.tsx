import { ExpatKlassenPage, expatMetadata } from "@/components/expat/ExpatPages";
import { RO } from "@/lib/expat/content-ro";

export const metadata = expatMetadata(RO, "klassen");

export default function Page() {
  return <ExpatKlassenPage c={RO} />;
}
