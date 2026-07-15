/**
 * Server component that emits the three JSON-LD blocks every calculator page
 * uses: WebApplication + FAQPage + BreadcrumbList. Keeps page.tsx files lean.
 */
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
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    description,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://bruttonettocalculator.com" },
      { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: url },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
