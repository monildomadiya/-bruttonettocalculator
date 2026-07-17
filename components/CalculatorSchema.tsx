/**
 * Server component that emits the JSON-LD blocks every calculator page uses:
 * WebPage + FAQPage + BreadcrumbList. Keeps page.tsx files lean.
 *
 * Note: this deliberately emits a WebPage (not a SoftwareApplication/
 * WebApplication) entity. SoftwareApplication requires an aggregateRating or
 * review to be valid for Google/Semrush, and we do not fabricate ratings.
 * Only pass `faqs` when the exact questions & answers are visibly rendered on
 * the page — otherwise omit them so no FAQPage schema is produced.
 */
import { WEBSITE_ID } from "@/lib/seo";

export interface SchemaFaq {
  q: string;
  a: string;
}

interface Props {
  name: string;
  url: string;
  description: string;
  breadcrumbLabel: string;
  faqs: SchemaFaq[];
}

export default function CalculatorSchema({ name, url, description, breadcrumbLabel, faqs }: Props) {
  const breadcrumbId = `${url}#breadcrumb`;
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name,
    url,
    description,
    inLanguage: "de-DE",
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": breadcrumbId },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
      { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: url },
    ],
  };
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }
      : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
    </>
  );
}
