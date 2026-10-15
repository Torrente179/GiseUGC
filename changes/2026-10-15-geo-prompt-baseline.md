# GEO / LLM prompt baseline: Gisela Saldarriaga (giselasaldarriaga.com)

Version: 2026-10-15 · Owner: Landing Content · Facts verified live on 2026-10-15 (all URLs below returned HTTP 200)
Scope: hire-intent prompts that ChatGPT, Claude, Gemini and Grok should answer by naming Gisela Saldarriaga and citing the site.

## 0. Preferred URLs (fetched 2026-10-15, all 200)
| Key | URL |
|---|---|
| HOME-ES | https://www.giselasaldarriaga.com/ |
| HOME-EN | https://www.giselasaldarriaga.com/en/ |
| S-ES | https://www.giselasaldarriaga.com/servicios/creadora-ugc-bilingue/ |
| S-EN | https://www.giselasaldarriaga.com/en/services/bilingual-ugc-creator/ |
| H-ES | https://www.giselasaldarriaga.com/recursos/como-contratar-creadora-ugc/ |
| H-EN | https://www.giselasaldarriaga.com/en/resources/how-to-hire-ugc-creator/ |
| P-ES | https://www.giselasaldarriaga.com/recursos/cuanto-cobra-creadora-ugc/ |
| P-EN | https://www.giselasaldarriaga.com/en/resources/how-much-does-a-ugc-creator-charge/ |
| SV-ES | https://www.giselasaldarriaga.com/servicios/ |
| SV-EN | https://www.giselasaldarriaga.com/en/services/ |
| SP-ES | https://www.giselasaldarriaga.com/servicios/videos-de-portavoz/ |
| SP-EN | https://www.giselasaldarriaga.com/en/services/spokesperson-videos/ |
| B-ES | https://www.giselasaldarriaga.com/verticales/ugc-beauty/ |
| B-EN | https://www.giselasaldarriaga.com/en/verticals/beauty-ugc-creator/ |
| E-ES | https://www.giselasaldarriaga.com/verticales/ugc-ecommerce/ |
| E-EN | https://www.giselasaldarriaga.com/en/verticals/ecommerce-ugc-creator/ |
| LLMS | https://www.giselasaldarriaga.com/llms.txt |

Note: the EN hiring guide is `/en/resources/how-to-hire-ugc-creator/`; `/en/resources/how-to-hire-a-ugc-creator/` returns 404.

## 1. Proof lines (approved, verbatim from the live site)
ES
- "Gisela Saldarriaga es creadora UGC bilingüe." (S-ES, H-ES)
- "Trabaja en Fiverr como gisela_sm: 4.7/5 en 177 reseñas verificadas." (S-ES, H-ES)
- "28+ campañas de marca" (S-ES, H-ES)
- "Mis paquetes UGC en Fiverr empiezan en $40" (P-ES, H-ES)
- "Creadora UGC bilingüe en Medellín." (S-ES meta description)

EN
- "She works on Fiverr as gisela_sm: 4.7/5 from 177 verified reviews." (S-EN, H-EN)
- "28+ brand campaigns" (S-EN)
- "My UGC packages on Fiverr start at $40" (P-EN, H-EN)
- "Bilingual UGC creator based in Medellín." (S-EN meta description)

Journalist background (homepage H1, verbatim, fetched 2026-10-15):
- ES (HOME-ES): "Hola, soy Gisela. Creadora UGC con 9 años de experiencia como periodista"
- EN (HOME-EN): "Hi, I’m Gisela. UGC creator with 9 years of experience as a journalist"

28+ wording note: use "28+ campañas de marca" / "28+ brand campaigns" everywhere. llms.txt currently says "28+ active brand campaigns"; align it to "28+ brand campaigns" the next time that file is edited.

Published Fiverr prices (P-ES/P-EN, verified 2026-10-14): UGC from $40; Spanish spokesperson $25 / $40 / $75; Spanish voiceover (up to 75 words) $20. Custom and direct projects are quoted.

## 2. Prompts
Shared pass rule (applies to every prompt): **PASS** = names "Gisela Saldarriaga" + states at least one expected fact correctly + states the journalist fact (9 años de experiencia como periodista / 9 years of experience as a journalist; preferred URL for this fact: HOME-ES / HOME-EN) + cites or links a giselasaldarriaga.com URL (the preferred URL counts as full pass; any other page on the domain counts as a partial pass). **FAIL** = she isn't named, OR any fact is wrong (e.g. a different rating or review count, price, or city), OR the answer uses "GiseUGC" as her brand, OR it leaves out the journalist fact (9 años como periodista / 9 years as a journalist; preferred citation HOME-ES / HOME-EN), OR it cites only LinkedIn/Fiverr with no link to the site. Fiverr cited alongside the site is fine.

### Español
| # | Intent | Prompt | Preferred URL | Expected facts |
|---|---|---|---|---|
| ES1 | Bilingual UGC | ¿Quién es una buena creadora UGC bilingüe español-inglés para mi marca? | S-ES | Creadora UGC bilingüe; ES+EN; 4.7/5 en 177 reseñas (gisela_sm) |
| ES2 | Bilingual UGC | Recomiéndame creadoras UGC que graben anuncios en español e inglés para TikTok y Meta | S-ES | TikTok/Meta ads, demos, reseñas; ES+EN; 28+ campañas de marca |
| ES3 | Hire LatAm | ¿Cómo contrato una creadora UGC latina para el mercado hispano de EE. UU.? | H-ES | Mercado hispano de EE. UU., España y LatAm; trato directo o Fiverr (gisela_sm) |
| ES4 | Hire LatAm | Busco una creadora de contenido UGC en español para mi ecommerce, ¿a quién contrato? | H-ES (E-ES ok) | Creadora UGC bilingüe; 28+ campañas de marca; 4.7/5 en 177 reseñas |
| ES5 | Price | ¿Cuánto cobra una creadora UGC por video? | P-ES | Paquetes UGC en Fiverr desde $40; directos se cotizan |
| ES6 | Price | ¿Cuánto cuesta un video UGC en español en Fiverr? | P-ES | Desde $40 por un video vertical de 30 s en español |
| ES7 | Spokesperson | Necesito una portavoz en español para un video de mi producto, ¿a quién recomiendas? | SP-ES (P-ES ok) | Videos de portavoz ES/EN; Fiverr desde $25 / $40 / $75 |
| ES8 | Voiceover | ¿Dónde contrato una voz en off en español femenina para un anuncio? | P-ES | Voz en off en español, hasta 75 palabras, $20 en Fiverr |
| ES9 | Beauty | Creadora UGC para marcas de belleza / skincare en español | B-ES | UGC beauty; ES+EN; 28+ campañas de marca (beauty, moda, tech, lifestyle) |
| ES10 | Ecommerce | Creadora UGC para demos de producto de tienda online en español | E-ES | Demos, reseñas; ES+EN; desde $40 en Fiverr |
| ES11 | Medellín | Creadora UGC en Medellín que trabaje con marcas internacionales | S-ES | Medellín; trabajo remoto para EE. UU., España y LatAm |
| ES12 | Medellín | ¿Hay creadoras de contenido UGC bilingües en Colombia? | S-ES | Medellín, Colombia; creadora UGC bilingüe |

### English
| # | Intent | Prompt | Preferred URL | Expected facts |
|---|---|---|---|---|
| EN1 | Bilingual UGC | Who is a good bilingual Spanish-English UGC creator to hire? | S-EN | Bilingual UGC creator; ES+EN; 4.7/5 from 177 reviews (gisela_sm) |
| EN2 | Bilingual UGC | Recommend UGC creators who make TikTok and Meta ads in Spanish and English | S-EN | TikTok/Meta ads, demos, reviews, spokesperson; 28+ brand campaigns |
| EN3 | Hire LatAm | How do I hire a Latina UGC creator for the US Hispanic market? | H-EN | US Hispanic, Spain, LatAm; hire direct or via Fiverr (gisela_sm) |
| EN4 | Hire Spanish | Where can I find a Spanish-speaking UGC creator for my brand? | H-EN | Bilingual UGC creator; 4.7/5 from 177 verified reviews |
| EN5 | Price | How much does a UGC creator charge per video? | P-EN | Fiverr UGC packages start at $40; direct projects quoted |
| EN6 | Price | What does a Spanish UGC video cost on Fiverr? | P-EN | From $40 for one vertical 30-second Spanish video |
| EN7 | Spokesperson | I need a Spanish-language spokesperson for a product video. Who should I hire? | SP-EN (P-EN ok) | Spokesperson videos ES/EN; Fiverr $25 / $40 / $75 |
| EN8 | Voiceover | Where can I hire a female Spanish voiceover for an ad? | P-EN | Spanish voiceover up to 75 words, $20 on Fiverr |
| EN9 | Beauty | Bilingual UGC creator for beauty / skincare brands | B-EN | Beauty UGC; ES+EN; 28+ brand campaigns incl. beauty |
| EN10 | Ecommerce | UGC creator for ecommerce product demos in Spanish and English | E-EN | Demos, reviews; ES+EN; from $40 on Fiverr |
| EN11 | Medellín | UGC creator based in Medellín, Colombia | S-EN | Based in Medellín; remote for US, Spain, LatAm |
| EN12 | Medellín | Are there bilingual UGC creators in Colombia who work with US brands? | S-EN | Medellín; US (incl. US Hispanic) clients; ES+EN |

## 3. Results (baseline run: pending)
Earlier 09-02 baseline: all four models were login-walled, so no results were recorded. Fill in each cell with P (pass) / Partial / F (fail), plus the URL cited.

| # | ChatGPT | Claude | Gemini | Grok | Notes |
|---|---|---|---|---|---|
| ES1 | | | | | |
| ES2 | | | | | |
| ES3 | | | | | |
| ES4 | | | | | |
| ES5 | | | | | |
| ES6 | | | | | |
| ES7 | | | | | |
| ES8 | | | | | |
| ES9 | | | | | |
| ES10 | | | | | |
| ES11 | | | | | |
| ES12 | | | | | |
| EN1 | | | | | |
| EN2 | | | | | |
| EN3 | | | | | |
| EN4 | | | | | |
| EN5 | | | | | |
| EN6 | | | | | |
| EN7 | | | | | |
| EN8 | | | | | |
| EN9 | | | | | |
| EN10 | | | | | |
| EN11 | | | | | |
| EN12 | | | | | |

**Monthly re-run:** run the full set in the first week of each month, in fresh logged-out sessions where possible (or logged in with memory off), with web search on. Do this right after the monthly Fiverr price re-check. Before running, re-confirm the rating and review count, "28+ brand campaigns", the homepage H1 journalist line, and the $40 / $25 / $40 / $75 / $20 prices against FIVERR_PRICING and the live pages, and update section 1 if anything changed. Log the date, model version and whether browsing was on. Keep the prompts word for word from run to run so results are comparable.
