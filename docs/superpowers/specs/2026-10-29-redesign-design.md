# InfraShape Brno — redesign webu (CZ)

Datum: 2026-10-29
Stav: návrh ke schválení

## Cíl

Přepracovat jednostránkový web infrashape.vercel.app podle e-mailu klientky (29. 10. 2026):
elegantnější a „růžovější“ vzhled podle nového loga, nové texty, menu se 4 položkami,
vyskakovací nabídka lekce zdarma, sekce s listováním touchpadem, videa „jak se k nám dostat“
a nová služba EMS. Úspěch = klientka web schválí a dá se postupně doplňovat podklady
(fotky po focení, videa, slevový kód, EMS) bez dalšího přestavování.

## Mimo rozsah

- Anglická verze: `/en/` zůstává ve staré podobě, přepínač jazyka se skryje. Překlad až po focení.
- Galerie a fotky produktů („menu jako bellavita“) — čeká na focení.
- Žádný framework ani build krok.

## Reference (co z nich bereme)

| Web | Co přebíráme |
|---|---|
| thestudiobymm.sk | bílý prostor, velký serif s kurzívou, drobná proložená verzálka nad nadpisy |
| waverunmedia.com/about | plynulý setrvačný scroll (Lenis) + najíždění obsahu |
| thestudiobyjuliegranger.com | portrétní karty s ztlumeným smyčkovým videem, číslované 01–03 |
| theimmortals.world | překlápění celých obrazovek gestem touchpadu — jen v jedné sekci |

## Struktura stránky

Menu: **Co je InfraShape** (`#infrashape`) · **Jak se k nám dostat** (`#directions`) · **FAQ** (`#faq`) · **Kontakt** (`#contact`) + tlačítko **Rezervace** (Reservio). Na mobilu hamburger.

1. **Hero** (`#home`) — eyebrow „INFRASHAPE HORIZONTAL • EMS • BRNO“, H1 „Kdo cvičí s námi, *vidí změnu.*“, krátký perex, CTA *Rezervace* + *Lekce zdarma* (otevře popup). Provizorní fotka: červené světlo (příloha 4).
2. **Recenze** — stávající pruh z Reservia (4,97/5, 63 hodnocení) beze změny obsahu, nové styly.
3. **Proč my** (`#why`) — úvodní text klientky: diety vs. cesta, která funguje; 30–60 min, šetrné ke kloubům, výsledky po 2 týdnech; propojení InfraShape + EMS; individuální plán.
4. **Co je InfraShape** (`#infrashape`) — listovací sekce, 5 panelů:
   01 Přístroj (horizontální kolo vleže) · 02 Infračervené záření · 03 Vakuová masáž ·
   04 Péče o pleť a relax (kolagen, LED, aromaterapie, obrazovka) · 05 EMS.
   Nahrazuje současných 6 karet technologií.
5. **Kdo jsme** (`#about`) — matka a dcera (texty klientky), stávající video v modalu, citace (Anna Procházková, dokud nebude fotka Hany), odkaz na Instagram.
6. **Ceník** (`#pricing`) — InfraShape 30 min 490 Kč, 60 min 790 Kč, **EMS — „cena brzy“** (placeholder, tlačítko vede na hlavní Reservio).
7. **Kalkulačka** (`#calculator`) — beze změny funkce, nové styly.
8. **Jak se k nám dostat** (`#directions`) — 3 portrétní karty (01–03) se ztlumeným smyčkovým videem z různých míst; do dodání videí poster obrázek + popisek. Pod nimi stávající mapa + popis trasy.
9. **FAQ** (`#faq`) — 3 otázky klientky + stávající, bez duplicit (cca 7), `<details>`.
10. **Kontakt** (`#contact`) + patička.

Odstraňuje se: samostatná sekce „Rezervace“ (nahrazena CTA), 6 karet technologií.

Texty klientky se jazykově učešou (odstranit „Zde je 5 vět o…“, opravit „Infrasafe“, sjednotit oslovení na „vy“) bez změny významu.

## Vizuální styl

- **Barvy** (CSS proměnné v `:root`):
  - pozadí `#ffffff`, jemné plochy `#fbf3f7`
  - hlavní růžová z loga `#DF9AC3`, tmavší pro tlačítka/odkazy `#C4719F`, nejtmavší akcent `#8E4470`
  - text `#3A2A33`, tlumený text `#7A6872`
  - přechod pro hero a vybrané sekce: `#E7A9D0 → #F6E4EE → #FFFFFF` (jako podklad pro stories)
- **Písmo**: nadpisy *Playfair Display* (400/500 + kurzíva pro zvýraznění), text *Jost* (300/400/500), eyebrow verzálky s `letter-spacing: .3em`. Google Fonts (CSP už povoluje).
- **Logo**: nové z přílohy (bílé pozadí) → `img/logo.webp`, favicon z něj.
- Velkorysé mezery, zaoblení jemnější než teď, stíny tlumené.

## Pohyb

- **Plynulý scroll**: Lenis (self-hosted v `js/vendor/lenis.min.js`, pevná verze). Kotvy v menu scrollují přes Lenis.
- **Najíždění**: prvky s `data-reveal` vyjedou o ~30 px a zprůhlední se z 0 při vstupu do viewportu (IntersectionObserver, jednou).
- **Listovací sekce** (desktop ≥ 900 px, jemný ukazatel):
  - sekce má výšku 100vh, při dosažení se „zamkne“ (Lenis stop);
  - jedno gesto kolečka/touchpadu (s debounce ~700 ms a prahem deltaY) = přechod na další/předchozí panel; šipky ↑/↓ a PageUp/PageDown také;
  - přechod: fotka scale 1.08→1 + crossfade, text vyjede zdola;
  - vlevo indikátor 01–05 (klikatelné tečky);
  - po posledním panelu gesto dolů „odemkne“ a scroll pokračuje; před prvním gesto nahoru pokračuje nahoru;
  - **mobil / dotyk / úzká obrazovka**: panely jako běžné karty pod sebou, bez zamykání.
- **`prefers-reduced-motion: reduce`**: žádný Lenis, žádné reveal animace, listovací sekce jako karty pod sebou.

## Popup „Lekce zdarma“

- Zobrazí se ~0,8 s po načtení, **jednou na návštěvníka** (`localStorage` klíč `is_promo_seen`, obaleno try/catch — když storage nejde, zobrazí se a nic se nerozbije).
- Obsah: nadpis „První lekce zdarma“, krátký text, slevový kód (placeholder `PRVNILEKCE` dokud ho klientka nedodá) s tlačítkem *Zkopírovat* (Clipboard API, fallback výběr textu), CTA *Rezervovat* → Reservio.
- Zavření: křížek, klik na pozadí, Esc. Focus trap, `role="dialog"`, `aria-modal`.
- Tlačítko *Lekce zdarma* v hero ho otevře kdykoli znovu.

## Videa „Jak se k nám dostat“

- `<video muted loop playsinline preload="none" poster="…">`; přehrává se jen ve viewportu (IntersectionObserver play/pause), mimo něj pauza.
- Do dodání: poster obrázky (provizorní) + popisek „Video brzy“; HTML připravené, výměna = jen nahrát soubory do `media/`.

## Soubory

- `index.html` — nová struktura.
- `css/style.css` — přepsaný styl (nové tokeny, sekce).
- `js/script.js` — zůstává: menu, video modal, kalkulačka, rok v patičce.
- `js/scroll.js` — Lenis init, kotvy, reveal.
- `js/flip.js` — listovací sekce.
- `js/popup.js` — popup lekce zdarma.
- `js/directions.js` — play/pause videí ve viewportu.
- `js/vendor/lenis.min.js` — knihovna.
- `img/` — nové logo, provizorní fotky v `webp`, zmenšený `device`.
- `vercel.json` — beze změny (vše `'self'`).

## Ověření před každým nasazením

- Náhled lokálně: desktop 1280, tablet 768, mobil 375 — bez horizontálního přetečení, bez chyb v konzoli.
- Listování: kolečko, touchpad (malé deltaY), klávesy, tečky; odemknutí na obou koncích.
- Popup: první návštěva ano, druhá ne; Esc/křížek/pozadí; kopírování kódu.
- Reduced motion: vše čitelné bez animací.
- Po nasazení: kontrola živého webu (CSP hlavičky nic neblokují).

## Nasazení po etapách

1. Vzhled + struktura + texty (bez listování, popupu, videí).
2. Plynulý scroll, reveal, listovací sekce.
3. Popup + karty s videi.

## Placeholdery (doplní klientka)

- slevový kód lekce zdarma
- cena a Reservio odkaz EMS
- 3 videa „jak se k nám dostat“
- fotky z focení (hero, Kdo jsme, panely, galerie) + fotka Hany
