import { ADS_OFF_STORAGE_KEY, ADSENSE_LOADER_SRC } from "@/lib/adsConfig";

/**
 * Ad-serving guard — decides whether this page may request ads, and, if it may,
 * loads the AdSense script itself.
 *
 * Why the guard loads the script instead of just pausing it
 * ─────────────────────────────────────────────────────────
 * The loader used to be a static `<script async src>` in `<body>`, with
 * `components/GoogleAdSense.tsx` setting `pauseAdRequests` from a `useEffect`.
 * Two things were wrong with that:
 *
 *  1. The effect cannot run before React has hydrated (~1.5 s on desktop, far
 *     worse on mobile), while the loader starts fetching at ~0.1 s. On every
 *     admin page view — and on every page the publisher opened to check ad
 *     behaviour on production — the ad request went out long before anything
 *     "paused" it. That is own traffic, and own traffic is the textbook
 *     invalid-traffic pattern.
 *
 *  2. Moving the guard to an inline script did not fix it either. React 18
 *     hoists `<script async src>` into `<head>` as a resource, but leaves inline
 *     scripts where they are — verified in the rendered DOM on 2026-09-11, where
 *     the loader sat at `<head>` position 6 and this guard at `<body>` position
 *     8. An inline script in `<body>` usually still wins the race against a
 *     network fetch, but not against a warm HTTP cache — i.e. exactly the repeat
 *     visitor whose traffic matters most here: the publisher's own browser.
 *
 * Injecting the script from inside the guard removes the race entirely. A
 * suppressed page now makes **no request to Google at all**, which is strictly
 * better than making one and asking it to do nothing. The cost is that the
 * preload scanner no longer sees the URL in the initial HTML; `<link
 * rel="preconnect">` in the layout covers the DNS + TLS part of that, leaving a
 * few tens of milliseconds against the ~3 s this whole arrangement was built to
 * save.
 *
 * What it blocks
 * ──────────────
 *  - `/admin*`, `/api*` — pages only the account holder ever opens.
 *  - `/embed*` — the widget renders inside third-party pages, where we have no
 *    consent basis and no publisher content of our own.
 *  - **Anything carrying `<meta name="robots" content="noindex">`.** A page
 *    Google is told not to index has, by our own admission, nothing worth
 *    indexing on it — and Google Publisher Policies do not allow ads on screens
 *    without publisher content. The 404 is the case that matters (it inherits
 *    the root layout's two site-wide units like any other route), but the rule
 *    is written against the meta tag rather than the path so it keeps holding
 *    for any noindex page added later, without anyone remembering to wire it up.
 *    `<head>` is fully parsed before this script runs, so the tag is always
 *    readable here. Audited 2026-09-11: the only noindex surfaces on the site
 *    are the 404, /admin-secure and /embed — all three must be ad-free anyway.
 *  - Any browser that has opted out via `?noads=1`.
 *
 * The own-traffic opt-out
 * ───────────────────────
 * AdSense removed IP-based own-traffic exclusion, so the only reliable way to
 * keep the publisher's own browsing out of the account is to never make the
 * request. Open any page once with `?noads=1` and this browser stops requesting
 * ads permanently; `?noads=0` restores them. Do this on every device and browser
 * used to check the live site.
 *
 * `data-ads-off` on <html> lets `<AdUnit>` skip rendering its `<ins>` entirely,
 * so a suppressed page emits no empty ad containers either.
 *
 * Both helpers are published on `window` because App Router route changes parse
 * no new document — `components/GoogleAdSense.tsx` re-runs the same decision on
 * every navigation and calls back into these.
 */
export default function AdGuard() {
  const js = `
(function(){
try{
var w=window,d=document,K=${JSON.stringify(ADS_OFF_STORAGE_KEY)},SRC=${JSON.stringify(ADSENSE_LOADER_SRC)};
w.adsbygoogle=w.adsbygoogle||[];
w.__bncAdsOff=function(){
var p=location.pathname||"/";
if(p.indexOf("/admin")===0||p.indexOf("/api")===0||p.indexOf("/embed")===0)return "internal";
var m=d.querySelector('meta[name="robots"][content*="noindex"]');
if(m)return "no-content";
var s=null;try{s=localStorage.getItem(K)}catch(e){}
return s==="1"?"own-traffic":"";
};
w.__bncLoadAds=function(){
if(d.querySelector("script[data-bnc-adsense]"))return;
var el=d.createElement("script");
el.async=true;el.src=SRC;el.crossOrigin="anonymous";
el.setAttribute("data-bnc-adsense","1");
(d.head||d.documentElement).appendChild(el);
};
var f=null;try{f=new URLSearchParams(location.search).get("noads")}catch(e){}
if(f==="1"){try{localStorage.setItem(K,"1")}catch(e){}}
else if(f==="0"){try{localStorage.removeItem(K)}catch(e){}}
var off=w.__bncAdsOff();
if(off){w.adsbygoogle.pauseAdRequests=1;d.documentElement.setAttribute("data-ads-off",off);}
else{w.__bncLoadAds();}
}catch(e){}
})();`.trim();

  return <script id="ad-guard" dangerouslySetInnerHTML={{ __html: js }} />;
}
