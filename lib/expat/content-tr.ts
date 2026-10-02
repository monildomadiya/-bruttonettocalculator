import type { ExpatContent } from "./types";
import { BEISPIELE, GEHALT, GRUNDFREIBETRAG_2026, MINDESTLOHN_ZEILEN, MINIJOB, eur } from "./numbers";

/**
 * Türkisch. Keywords aus Google Autocomplete (hl=tr, gl=tr/de, 2.10.2026):
 * "almanya net maaş hesaplama 2026", "almanya brüt net", "almanya vergi
 * sınıfı" (1–6), "almanya asgari ücret 2026 net", "… 2027".
 *
 * Inhaltlich wichtig: Türkei ist nicht EU/EWR — § 1a EStG (Splitting mit
 * Ehepartner im Ausland) greift nicht. Deshalb abweichender Text zur
 * rumänischen Seite.
 */

const b3000 = BEISPIELE.find((b) => b.brutto === 3000)!;
const b3500 = BEISPIELE.find((b) => b.brutto === 3500)!;
const [ml26, ml27] = MINDESTLOHN_ZEILEN;

export const TR: ExpatContent = {
  lang: "tr",
  ogLocale: "tr_TR",
  start: "Ana sayfa",
  hinweisDeutsch: "Hesaplayıcı Almanya'daki vergi ve sigorta kesintilerini uygular. Almanca tercih ederseniz:",
  linkDeutsch: "Brutto-Netto-Rechner (DE)",
  weitere: "Almanya'da çalışanlar için diğer sayfalar",
  quellenLabel: "Kaynaklar",
  faqTitel: "Sık sorulan sorular",
  quellen:
    "Kaynaklar: § 32a EStG (2026 tarifesi), 2026 resmî sosyal sigorta değerleri, Asgari Ücret Yönetmeliği (2026'dan itibaren 13,90 €, 2027'den itibaren 14,60 €), Destatis (2025 maaşları). Bilgi amaçlı hesaplamadır, vergi danışmanlığı değildir.",
  calc: {
    path: "/tr/almanya-maas-hesaplama",
    title: "Almanya Net Maaş Hesaplama 2026 — Brüt Net Türkçe",
    description:
      "Almanya net maaş hesaplama 2026: brüt maaştan gelir vergisi, Soli ve sosyal sigorta kesintilerini düşün — 6 vergi sınıfının hepsi için, Türkçe.",
    keywords: [
      "almanya maaş hesaplama",
      "almanya net maaş hesaplama",
      "almanya net maaş hesaplama 2026",
      "almanya brüt net maaş hesaplama",
      "almanya brüt net",
      "brutto netto hesaplama almanya",
      "almanya ortalama maaş",
    ],
    nav: "Maaş hesaplama",
    h1: "Almanya net maaş hesaplama",
    h1Akzent: "2026",
    badge: "Almanya · 2026 · Türkçe",
    intro:
      "Alman brüt maaşınızdan elinize ne geçeceğini hesaplayın: gelir vergisi (Lohnsteuer), dayanışma vergisi, kilise vergisi ve tüm sosyal sigorta primleri — 6 vergi sınıfının hepsi için, 2026 resmî değerleriyle.",
    beispieleTitel: "Almanya'da brüt ve net maaş (aylık)",
    beispieleIntro: "Çocuksuz, kilise vergisi yok, ortalama ek primli sağlık sigortası, 2026 değerleri.",
    spalteBrutto: "Brüt / ay",
    spalteSk1: "Net I. sınıf (bekâr)",
    spalteSk3: "Net III. sınıf (evli)",
    abzuegeTitel: "Almanya'da maaştan neler kesilir",
    abzuege: [
      "Emeklilik sigortası (Rentenversicherung): %9,3",
      "Sağlık sigortası (Krankenversicherung): %7,3 artı sigorta şirketinin ek priminin yarısı — ortalama %8,75",
      "Bakım sigortası (Pflegeversicherung): %1,8; 23 yaş üstü çocuksuzlar için %2,4",
      "İşsizlik sigortası (Arbeitslosenversicherung): %1,3",
      `Gelir vergisi (Lohnsteuer) tarifeye göre — yıllık ilk ${eur(GRUNDFREIBETRAG_2026, 0)} vergiden muaftır`,
      "Dayanışma vergisi (Soli) yalnızca yüksek gelirlerde; kilise vergisi (%8–9) yalnızca kayıtlı kilise üyelerinde",
    ],
    gehaltTitel: "Almanya'da ortalama maaş",
    gehaltText: `Tam zamanlı çalışanlar 2025'te yılda ortalama ${eur(GEHALT.durchschnittJahr, 0)} brüt kazandı (Destatis); medyan maaş — çalışanların yarısı daha fazla, yarısı daha az kazanır — ${eur(
      GEHALT.medianJahr,
      0
    )} idi. I. sınıfta aylık net olarak medyan maaştan yaklaşık ${eur(GEHALT.medianNetto)}, ortalama maaştan ${eur(GEHALT.durchschnittNetto)} kalır.`,
    faqs: [
      {
        q: "Almanya'da 3.000 € brüt maaşın neti ne kadar?",
        a: `2026'da I. vergi sınıfında (bekâr, çocuksuz) ayda yaklaşık ${eur(b3000.sk1)} net kalır. III. sınıfta (evli, eşin geliri yok ya da düşük) ${eur(
          b3000.sk3
        )}. Fark vergiden gelir — sosyal sigorta kesintileri iki sınıfta da aynıdır.`,
      },
      {
        q: "Almanya'da 3.500 € brüt maaşın neti ne kadar?",
        a: `I. sınıfta yaklaşık ${eur(b3500.sk1)}, III. sınıfta ${eur(b3500.sk3)} net (2026, çocuksuz, kilise vergisi yok).`,
      },
      {
        q: "Almanya'da maaştan yüzde kaç kesilir?",
        a: "Ortalama bir maaşta I. sınıfta brütün yaklaşık %35–40'ı: yaklaşık %22 sosyal sigorta, gerisi vergi. Düşük maaşlarda oran daha düşüktür, çünkü yıllık ilk 12.348 € vergilendirilmez; yüksek maaşlarda artan oranlı tarife nedeniyle daha yüksektir.",
      },
      {
        q: "Hesaplayıcı Türkiye'deki vergileri de hesaplıyor mu?",
        a: "Hayır, yalnızca Almanya'yı: Alman gelir vergisi (§ 32a EStG) ve Alman sosyal sigortası, 2026 resmî değerleriyle. Almanya'da yaşayıp çalışıyorsanız maaşınız Almanya'da vergilendirilir.",
      },
    ],
  },
  klassen: {
    path: "/tr/almanya-vergi-siniflari",
    title: "Almanya Vergi Sınıfları 2026 — Steuerklasse 1–6 Türkçe",
    description:
      "Almanya'da vergi sınıfları (Steuerklasse I–VI) Türkçe: hangi sınıf kime verilir, 2026 net maaş tablosu ve vergi sınıfı nasıl değiştirilir.",
    keywords: [
      "almanya vergi sınıfı",
      "almanya vergi sınıfları",
      "almanya vergi sınıfı 1",
      "almanya vergi sınıfı 3",
      "almanya vergi sınıfı 4",
      "almanya vergi sınıfı 6",
      "almanya vergi sınıfı değiştirme",
      "almanya steuerklasse nedir",
    ],
    nav: "Vergi sınıfları",
    h1: "Almanya vergi sınıfları",
    h1Akzent: "2026",
    badge: "Steuerklassen · 2026 · Türkçe",
    intro:
      "Almanya'da vergi sınıfınız (Steuerklasse), maaşınızdan her ay ne kadar vergi kesileceğini belirler. Altı sınıf vardır — kimin hangi sınıfa girdiği, her sınıfta ne kadar net kaldığı ve sınıfın nasıl değiştirildiği bu sayfada.",
    tabelleTitel: "Tablo: vergi sınıfına göre net maaş 2026",
    tabelleIntro: "Aylık net, kilise vergisi yok; II. sınıf bir çocukla, diğerleri çocuksuz.",
    spalteKlasse: "Sınıf",
    klassen: [
      { titel: "I. sınıf", text: "Bekâr, boşanmış veya dul olanlar. Eşi Almanya'da yaşamayan evli çalışanlar da kural olarak I. sınıftadır." },
      { titel: "II. sınıf", text: "Çocuk parası aldığı en az bir çocukla birlikte yaşayan tek ebeveynler. Ek olarak tek ebeveyn indirimi uygulanır." },
      { titel: "III. sınıf", text: "Evli olup eşlerden biri çok daha fazla kazanıyorsa ya da diğeri çalışmıyorsa. En düşük kesinti — eş bu durumda V. sınıfa geçer." },
      { titel: "IV. sınıf", text: "Gelirleri birbirine yakın evli çiftler. Her biri I. sınıftaki gibi öder. Evlilikten sonra otomatik verilir." },
      { titel: "V. sınıf", text: "III/V kombinasyonunda daha az kazanan eş. Aylık kesinti yüksektir; fark yıllık vergi beyannamesinde kapanır." },
      { titel: "VI. sınıf", text: "İkinci ve sonraki her vergili iş için. Hiçbir muafiyet yoktur — bu yüzden en yüksek kesinti buradadır." },
    ],
    wechselTitel: "Eşim Türkiye'de yaşıyor — hangi vergi sınıfındayım?",
    wechselText:
      "Kural olarak I. sınıf. AB vatandaşları eşleri başka bir AB ülkesinde yaşasa bile belirli şartlarla III. sınıf alabilir (§ 1a EStG) — ancak bu kural Türkiye için geçerli değildir, çünkü Türkiye AB/AEA üyesi değildir. Eşiniz Almanya'ya taşındığında ve ikamet kaydı (Anmeldung) yapıldığında ikiniz de otomatik olarak IV. sınıfa geçersiniz; ardından ELSTER üzerinden çevrimiçi olarak III/V'ye geçebilirsiniz. Eşler arasında sınıf değişikliği yılda birden fazla kez yapılabilir.",
    faqs: [
      {
        q: "Almanya'ya taşındığımda hangi vergi sınıfını alırım?",
        a: "İkamet kaydından (Anmeldung) sonra otomatik olarak bir vergi numarası (Steuer-ID) ve I. vergi sınıfı alırsınız. Evliyseniz ve eşiniz de Almanya'da yaşıyorsa ikiniz de IV. sınıfa girersiniz; sonra III/V'ye geçebilirsiniz.",
      },
      {
        q: "En iyi vergi sınıfı hangisi?",
        a: "Aylık kesintisi en düşük olan III. sınıftır, ancak yalnızca evliler alabilir ve eş V. sınıfa geçer. Yıllık toplamda çiftin ödediği vergi III/V'de de IV/IV'te de aynıdır — fark vergi beyannamesiyle (Steuererklärung) kapanır; III/V'de beyanname vermek zorunludur.",
      },
      {
        q: "VI. vergi sınıfında neden bu kadar çok kesinti var?",
        a: "Çünkü temel muafiyet ve indirimler birinci işte zaten kullanılır. İkinci işte her euro baştan vergilendirilir. 2026'da ayda 603 €'ya kadar olan küçük işler için çalışanın vergi ödemediği minijob vardır.",
      },
    ],
  },
  mindestlohn: {
    path: "/tr/almanya-asgari-ucret",
    title: "Almanya Asgari Ücret 2026 Net — Saatlik 13,90 €",
    description:
      "Almanya asgari ücret 2026: saatlik 13,90 € brüt, 2027'de 14,60 €. Aylık brüt ve net ne kadar eder — vergi sınıfına ve haftalık saate göre.",
    keywords: [
      "almanya asgari ücret",
      "almanya asgari ücret 2026",
      "almanya asgari ücret 2026 net",
      "almanya asgari ücret aylık",
      "almanya asgari ücret ne kadar",
      "almanya asgari ücret 2027",
      "almanya asgari ücret saatlik",
    ],
    nav: "Asgari ücret",
    h1: "Almanya asgari ücret",
    h1Akzent: "2026",
    badge: "Mindestlohn · 2026/2027 · Türkçe",
    intro: `Almanya'da yasal asgari ücret 1 Ocak 2026'dan itibaren saatlik 13,90 € brüttür ve 1 Ocak 2027'de 14,60 €'ya yükselir. Haftada 40 saatte bu, ayda ${eur(
      ml26.brutto
    )} brüt — I. sınıfta yaklaşık ${eur(ml26.netto)} net demektir.`,
    tabelleTitel: "Aylık asgari ücret: brüt ve net",
    tabelleIntro: "Haftada 40 saat (ayda 173,33 saat), çocuksuz, kilise vergisi yok.",
    spalteJahr: "Yıl",
    spalteStunde: "Saatlik",
    spalteBruttoMonat: "Brüt / ay",
    spalteNettoSk1: "Net I. sınıf",
    spalteNettoSk3: "Net III. sınıf",
    stundenTitel: "Çalışma saatine göre net asgari ücret (2026)",
    spalteStundenWoche: "Saat / hafta",
    minijobTitel: "Minijob: ayda 603 €'ya kadar",
    minijobText: `Bir minijob 2026'da ayda en fazla ${MINIJOB[2026]} € getirebilir (2027'den itibaren ${MINIJOB[2027]} €). Çalışan vergi ödemez, yalnızca emeklilik sigortasına %3,6 öder — talep ederse bundan da muaf olabilir. Sınır, asgari ücretle birlikte otomatik olarak artar.`,
    faqs: [
      {
        q: "Almanya'da 2026 asgari ücret aylık net ne kadar?",
        a: `Tam zamanlı (haftada 40 saat) 13,90 € asgari ücret ayda ${eur(ml26.brutto)} brüt eder. Net olarak I. sınıfta yaklaşık ${eur(
          ml26.netto
        )}, III. sınıfta ${eur(ml26.netto3)} kalır.`,
      },
      {
        q: "Almanya'da 2027 asgari ücret ne kadar olacak?",
        a: `1 Ocak 2027'den itibaren saatlik 14,60 €. Haftada 40 saatte bu, ayda ${eur(ml27.brutto)} brüt ve I. sınıfta yaklaşık ${eur(
          ml27.netto
        )} net eder. 2026'da asgari ücret 12,82 €'dan 13,90 €'ya yükselmişti.`,
      },
      {
        q: "Asgari ücret yabancılar için de geçerli mi?",
        a: "Evet. Asgari ücret, vatandaşlığa bakılmaksızın Almanya'da çalışan tüm işçiler için geçerlidir. İstisnalar yalnızca mesleki eğitimi olmayan reşit olmayanlar, çıraklar ve bazı stajlar içindir.",
      },
    ],
  },
};
