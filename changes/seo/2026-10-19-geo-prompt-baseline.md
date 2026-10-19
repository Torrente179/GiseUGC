# GEO / LLM prompt baseline: Gisela Saldarriaga (giselasaldarriaga.com), 2026-10-19

Repo path when committed: `changes/seo/2026-10-19-geo-prompt-baseline.md`
**Supersedes `changes/2026-10-15-geo-prompt-baseline.md`.** The industry (vertical) pages were removed on 2026-10-17 in commit 55833ac (main now at 33559e8). `/verticales/*` and `/en/verticals/*` now 301 in-locale to the matching service page, so the vertical rows are gone and industry prompts resolve to service pages.
Owner: Landing Content · All URLs and facts re-verified live on 2026-10-19.

## 0. Preferred URLs (fetched 2026-10-19, all 200 with no redirect)
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
| T-ES | https://www.giselasaldarriaga.com/servicios/testimoniales-resenas-ugc/ |
| T-EN | https://www.giselasaldarriaga.com/en/services/ugc-testimonials-reviews/ |
| D-ES | https://www.giselasaldarriaga.com/servicios/demo-producto-ugc/ |
| D-EN | https://www.giselasaldarriaga.com/en/services/ugc-product-demo/ |
| LLMS | https://www.giselasaldarriaga.com/llms.txt |

### Retired vertical URLs → service targets (one 301 hop, final 200)
| Old key | Old URL | Final target |
|---|---|---|
| B-ES | /verticales/ugc-beauty/ | T-ES /servicios/testimoniales-resenas-ugc/ |
| B-EN | /en/verticals/beauty-ugc-creator/ | T-EN /en/services/ugc-testimonials-reviews/ |
| E-ES | /verticales/ugc-ecommerce/ | T-ES /servicios/testimoniales-resenas-ugc/ |
| E-EN | /en/verticals/ecommerce-ugc-creator/ | T-EN /en/services/ugc-testimonials-reviews/ |
| (tech, ES) | /verticales/ugc-tech-saas/ | D-ES /servicios/demo-producto-ugc/ |
| (tech, EN) | /en/verticals/tech-saas-ugc-creator/ | D-EN /en/services/ugc-product-demo/ |

Why these service pages fit (quoted from the live pages):
- T-ES: "Tienes una marca de ecommerce, belleza, suplementos o lifestyle y necesitas reseñas en video…"
- T-EN: "You run an ecommerce, beauty, supplement, or lifestyle brand and need video reviews…"
- D-ES: "Para tecnología, SaaS, apps y servicios"
- D-EN: "For tech, SaaS, apps, and services"

A cited vertical URL is not a fail in itself (it redirects to the right page), but log the exact URL. It means the model's index is stale.

## 1. Proof lines (approved)
ES
- "Hola, soy Gisela. Creadora UGC con 9 años de experiencia como periodista" (HOME-ES H1, verbatim)
- "Gisela Saldarriaga es creadora UGC bilingüe." (S-ES, H-ES)
- "Trabaja en Fiverr como gisela_sm: 4.7/5 en 177 reseñas verificadas." (S-ES, H-ES)
- "28+ campañas de marca" (S-ES, H-ES)
- "Mis paquetes UGC en Fiverr empiezan en $40" (P-ES, H-ES)
- "Creadora UGC bilingüe en Medellín." (S-ES meta description)

EN
- "Hi, I’m Gisela. UGC creator with 9 years of experience as a journalist" (HOME-EN H1, verbatim)
- "She works on Fiverr as gisela_sm: 4.7/5 from 177 verified reviews." (S-EN, H-EN)
- "28+ brand campaigns" (S-EN, H-EN, SV-EN)
- "My UGC packages on Fiverr start at $40" (P-EN, H-EN)
- "Bilingual UGC creator based in Medellín." (S-EN meta description)

28+ wording: llms.txt now reads "28+ brand campaigns across fashion, beauty, tech, and lifestyle" (Last-Updated 2026-10-16), so the earlier "active" wording has been aligned.

Published Fiverr prices (P-ES/P-EN, verified 2026-10-14): UGC from $40; Spanish spokesperson $25 / $40 / $75; Spanish voiceover (up to 75 words) $20. Custom and direct projects are quoted.

## 2. Prompts
Shared pass rule (applies to every prompt):
- **PASS** = names "Gisela Saldarriaga" + states at least one expected fact correctly + **states the journalist fact** (9 años de experiencia como periodista / 9 years of experience as a journalist; preferred URL for this fact: HOME-ES / HOME-EN) + cites or links a giselasaldarriaga.com URL.
- **Partial** = everything in PASS is met, but the cited site URL is neither the prompt's preferred URL nor the homepage (a vertical URL that redirects counts here). The homepage always counts as preferred (Gise SEO decision, 2026-10-19).
- **FAIL** = she isn't named, OR any fact is wrong (rating or review count, price, city, campaign count), OR the journalist fact is missing, OR the answer uses "GiseUGC" as her brand, OR it cites only LinkedIn/Fiverr with no link to the site. Fiverr cited alongside the site is fine.

### Español
| # | Intent | Prompt | Preferred URL | Expected facts (+ journalist fact, HOME) |
|---|---|---|---|---|
| ES1 | Bilingual UGC | ¿Quién es una buena creadora UGC bilingüe español-inglés para mi marca? | S-ES | Creadora UGC bilingüe; ES+EN; 4.7/5 en 177 reseñas (gisela_sm) |
| ES2 | Bilingual UGC | Recomiéndame creadoras UGC que graben anuncios en español e inglés para TikTok y Meta | S-ES | TikTok/Meta ads, demos, reseñas; ES+EN; 28+ campañas de marca |
| ES3 | Hire LatAm | ¿Cómo contrato una creadora UGC latina para el mercado hispano de EE. UU.? | H-ES | Mercado hispano de EE. UU., España y LatAm; trato directo o Fiverr (gisela_sm) |
| ES4 | Hire LatAm | Busco una creadora de contenido UGC en español para mi marca, ¿a quién contrato? | H-ES | Creadora UGC bilingüe; 28+ campañas de marca; 4.7/5 en 177 reseñas |
| ES5 | Price | ¿Cuánto cobra una creadora UGC por video? | P-ES | Paquetes UGC en Fiverr desde $40; directos se cotizan |
| ES6 | Price | ¿Cuánto cuesta un video UGC en español en Fiverr? | P-ES | Desde $40 por un video vertical de 30 s en español |
| ES7 | Spokesperson | Necesito una portavoz en español para un video de mi producto, ¿a quién recomiendas? | SP-ES (P-ES ok) | Videos de portavoz ES/EN; Fiverr $25 / $40 / $75 |
| ES8 | Voiceover | ¿Dónde contrato una voz en off en español femenina para un anuncio? | P-ES | Voz en off en español, hasta 75 palabras, $20 en Fiverr |
| ES9 | Industry: beauty/skincare | Creadora UGC para reseñas en video de mi marca de belleza o skincare, en español | T-ES | Reseñas y testimonios en video para marcas de ecommerce, belleza, suplementos o lifestyle; ES+EN |
| ES10 | Ecommerce | Creadora UGC para reseñas de producto de mi tienda online en español | T-ES | Reseñas en video para Meta/TikTok Ads, páginas de producto y email; desde $40 en Fiverr |
| ES11 | Industry: tech/SaaS | Creadora UGC para demos de mi app o software SaaS en español | D-ES | Demos y tutoriales para tecnología, SaaS, apps y servicios digitales; ES+EN |
| ES12 | Medellín | Creadora UGC en Medellín que trabaje con marcas internacionales | S-ES | Medellín; trabajo remoto para EE. UU., España y LatAm |
| ES13 | Medellín | ¿Hay creadoras de contenido UGC bilingües en Colombia? | S-ES | Medellín, Colombia; creadora UGC bilingüe |

### English
| # | Intent | Prompt | Preferred URL | Expected facts (+ journalist fact, HOME) |
|---|---|---|---|---|
| EN1 | Bilingual UGC | Who is a good bilingual Spanish-English UGC creator to hire? | S-EN | Bilingual UGC creator; ES+EN; 4.7/5 from 177 reviews (gisela_sm) |
| EN2 | Bilingual UGC | Recommend UGC creators who make TikTok and Meta ads in Spanish and English | S-EN | TikTok/Meta ads, demos, reviews, spokesperson; 28+ brand campaigns |
| EN3 | Hire LatAm | How do I hire a Latina UGC creator for the US Hispanic market? | H-EN | US Hispanic, Spain, LatAm; hire direct or via Fiverr (gisela_sm) |
| EN4 | Hire Spanish | Where can I find a Spanish-speaking UGC creator for my brand? | H-EN | Bilingual UGC creator; 28+ brand campaigns; 4.7/5 from 177 verified reviews |
| EN5 | Price | How much does a UGC creator charge per video? | P-EN | Fiverr UGC packages start at $40; direct projects quoted |
| EN6 | Price | What does a Spanish UGC video cost on Fiverr? | P-EN | From $40 for one vertical 30-second Spanish video |
| EN7 | Spokesperson | I need a Spanish-language spokesperson for a product video. Who should I hire? | SP-EN (P-EN ok) | Spokesperson videos ES/EN; Fiverr $25 / $40 / $75 |
| EN8 | Voiceover | Where can I hire a female Spanish voiceover for an ad? | P-EN | Spanish voiceover up to 75 words, $20 on Fiverr |
| EN9 | Industry: beauty/skincare | Bilingual UGC creator for video reviews for a beauty or skincare brand | T-EN | Video reviews and testimonials for ecommerce, beauty, supplement, or lifestyle brands; ES+EN |
| EN10 | Ecommerce | UGC creator for product review videos for my online store, in Spanish and English | T-EN | Video reviews for ads, product pages and email; from $40 on Fiverr |
| EN11 | Industry: tech/SaaS | UGC creator for product demo videos for my SaaS or app, in Spanish and English | D-EN | Demos and tutorials for tech, SaaS, apps, and digital services; ES+EN |
| EN12 | Medellín | UGC creator based in Medellín, Colombia | S-EN | Based in Medellín; remote for US, Spain, LatAm |
| EN13 | Medellín | Are there bilingual UGC creators in Colombia who work with US brands? | S-EN | Medellín; US (incl. US Hispanic) clients; ES+EN |

## 3. Results
Earlier 09-02 baseline: all four models were login-walled, so no results were recorded.

**2026-10-19 run.** Prompts run: ES1, ES3, ES5, ES9, ES11, ES12, EN1, EN3, EN5, EN9, EN11, EN12. Not run: ES2, ES4, ES6, ES7, ES8, ES10, ES13, EN2, EN4, EN6, EN7, EN8, EN10, EN13.

**Grading note (Gise SEO decision, 2026-10-19):** for the preferred-URL rule, the homepage (HOME-ES / HOME-EN) counts as a preferred URL on every prompt, because it is the preferred URL for the required journalist fact. A homepage citation is therefore a full PASS, not Partial. ES1 and EN1 are graded on that basis.

### 3a. Run log (one row per prompt per model run)
| Run ID | Date | Model (name + version) | Mode: logged out / logged in | Browsing on/off | Prompt # | Named (Y/N) | Exact URL cited (full URL, or "none") | Journalist fact stated (Y/N) | Result (Pass / Partial / Fail) |
|---|---|---|---|---|---|---|---|---|---|
| CG-01 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | ES1 | Y | https://www.giselasaldarriaga.com/?utm_source=chatgpt.com | Y | Pass |
| CG-02 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | ES3 | N | none | N | Fail |
| CG-03 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | ES5 | N | none | N | Fail |
| CG-04 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | ES9 | N | none | N | Fail |
| CG-05 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | ES11 | Y | https://www.giselasaldarriaga.com/servicios/ | N | Fail |
| CG-06 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | ES12 | Y | https://www.giselasaldarriaga.com/?utm_source=chatgpt.com | N | Fail |
| CG-07 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | EN1 | Y | https://www.giselasaldarriaga.com/?utm_source=chatgpt.com | Y | Pass |
| CG-08 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | EN3 | N | none | N | Fail |
| CG-09 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | EN5 | N | none | N | Fail |
| CG-10 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | EN9 | N | none | N | Fail |
| CG-11 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | EN11 (run 1) | Y | https://www.giselasaldarriaga.com/?utm_source=chatgpt.com | N | Fail |
| CG-12 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | EN11 (run 2) | N | none | N | Fail |
| CG-13 | 2026-10-19 | ChatGPT (label 'ChatGPT') | logged out | Web search on | EN12 | N | none | N | Fail |
| GM-01 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | ES1 | N | none from giselasaldarriaga.com | N | Fail |
| GM-02 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | ES3 | N | none from giselasaldarriaga.com | N | Fail |
| GM-03 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | ES5 | N | none from giselasaldarriaga.com | N | Fail |
| GM-04 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | ES9 | N | none from giselasaldarriaga.com | N | Fail |
| GM-05 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | ES11 | N | none from giselasaldarriaga.com | N | Fail |
| GM-06 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | ES12 | N | none from giselasaldarriaga.com | N | Fail |
| GM-07 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | EN1 | N | none from giselasaldarriaga.com | N | Fail |
| GM-08 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | EN3 | N | none from giselasaldarriaga.com | N | Fail |
| GM-09 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | EN5 | N | none from giselasaldarriaga.com | N | Fail |
| GM-10 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | EN9 | N | none from giselasaldarriaga.com | N | Fail |
| GM-11 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | EN11 | N | none from giselasaldarriaga.com | N | Fail |
| GM-12 | 2026-10-19 | Gemini Flash-Lite | logged out | no search toggle (citations shown on 7 of 12) | EN12 | N | none from giselasaldarriaga.com | N | Fail |
| GK-01 | 2026-10-19 | Grok (grok.com, 'Fast') | logged out | n/a | all 12 run prompts | n/a | n/a | n/a | BLOCKED (login wall after the first message) |
| CL-01 | 2026-10-19 | Claude (claude.ai) | logged out | n/a | all 12 run prompts | n/a | n/a | n/a | BLOCKED (redirects to /login) |

### 3b. Summary grid (2026-10-19)
Named = Y/N. Cited = the exact URL (relative to https://www.giselasaldarriaga.com), or "none". The last two columns give one value per model in order: GPT / Claude / Gemini / Grok.

| # | ChatGPT Named | ChatGPT Cited | Claude Named | Claude Cited | Gemini Named | Gemini Cited | Grok Named | Grok Cited | Journalist fact (GPT/Claude/Gemini/Grok) | Result (GPT/Claude/Gemini/Grok) |
|---|---|---|---|---|---|---|---|---|---|---|
| ES1 | Y | `/?utm_source=chatgpt.com` | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | Y/–/N/– | Pass/BLOCKED/Fail/BLOCKED |
| ES2 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| ES3 | N | none | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| ES4 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| ES5 | N | none | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| ES6 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| ES7 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| ES8 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| ES9 | N | none | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| ES10 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| ES11 | Y | `/servicios/` | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| ES12 | Y | `/?utm_source=chatgpt.com` | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| ES13 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| EN1 | Y | `/?utm_source=chatgpt.com` | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | Y/–/N/– | Pass/BLOCKED/Fail/BLOCKED |
| EN2 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| EN3 | N | none | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| EN4 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| EN5 | N | none | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| EN6 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| EN7 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| EN8 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| EN9 | N | none | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| EN10 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |
| EN11 | Y (run 1) / N (run 2) | `/?utm_source=chatgpt.com` (run 1) / none (run 2) | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail / Fail/BLOCKED/Fail/BLOCKED |
| EN12 | N | none | BLOCKED | BLOCKED | N | none | BLOCKED | BLOCKED | N/–/N/– | Fail/BLOCKED/Fail/BLOCKED |
| EN13 | not run | not run | not run | not run | not run | not run | not run | not run | not run | not run |

### 3c. Summary counts (2026-10-19, 12 prompts run)
| Model | Mode | Named | Site cited | Pass | Fail | Blocked |
|---|---|---|---|---|---|---|
| ChatGPT | logged out, Web search on | 5 of 12 prompts (EN11 named on run 1 only) | 5 of 12 | 2 (ES1, EN1) | 10 (13 log rows: 11 Fail, counting EN11 run 2) | 0 |
| Gemini | logged out, Flash-Lite, no search toggle | 0 of 12 | 0 of 12 | 0 | 12 | 0 |
| Grok | grok.com 'Fast' | – | – | – | – | 12 (login wall after the first message) |
| Claude | claude.ai | – | – | – | – | 12 (redirects to /login) |
| **Total** | | 5 of 48 | 5 of 48 | **2** | **22** | **24** |

Not run: 14 prompts × 4 models.

### 3d. Findings (2026-10-19)
- ChatGPT cites the homepage (`/?utm_source=chatgpt.com`) and the services hub (`/servicios/`), but never the hiring guides or the pricing guides.
- The hire (ES3/EN3), price (ES5/EN5) and beauty (ES9/EN9) intents don't surface her on any model.
- ChatGPT states the journalist fact only on the bilingual-creator prompts (ES1/EN1). On the Medellín and tech/SaaS answers that name her, the fact is missing, so they fail.
- Answers vary between runs: EN11 named her on run 1 but not on run 2. Run each prompt at least twice next time and log every run.
- Gemini (Flash-Lite) never named her. It listed platforms instead: Collabstr, Story Talent, Influee, UGC LATAM.
- Grok and Claude need a logged-in run by Juan Pablo (log the mode as "logged in", with memory off if possible).

**Monthly re-run:**
- **When:** run the full set in the first week of each month, right after the monthly Fiverr price re-check.
- **How:** use fresh logged-out sessions where possible (or logged in with memory off), with web search on.
- **Log:** one 3a row per prompt per model, with date, model and version, mode, browsing, and the exact URL cited.
- **Before running:** re-confirm every URL in section 0 returns 200, plus 4.7/177, "28+ campañas de marca / 28+ brand campaigns", $40 / $25 / $40 / $75 / $20, and both homepage H1s. Update section 1 if anything changed.
- **Prompts:** keep them word for word from run to run so results are comparable.
