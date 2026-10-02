import { ExpatKlassenPage, expatMetadata } from "@/components/expat/ExpatPages";
import { UK } from "@/lib/expat/content-uk";

export const metadata = expatMetadata(UK, "klassen");

export default function Page() {
  return <ExpatKlassenPage c={UK} />;
}
