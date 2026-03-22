import {
  getLegalPath,
  type LegalPageId,
  type SiteLocale,
} from '@/lib/locale-path';

const SUPPORT_EMAIL = 'support@giselasaldarriaga.com';

type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
};

export type LegalPageContent = {
  id: LegalPageId;
  locale: SiteLocale;
  path: string;
  alternatePath: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
  audienceNote: string;
  updatedDateLabel: string;
  effectiveDateLabel: string;
  summaryItems: string[];
  tocTitle: string;
  sections: LegalSection[];
  contactTitle: string;
  contactBody: string;
  contactEmail: string;
  counterpartLabel: string;
  counterpartPath: string;
  disclaimer: string;
};

type LocalizedLegalPageMap = Record<
  LegalPageId,
  Record<
    SiteLocale,
    Omit<LegalPageContent, 'id' | 'locale' | 'path' | 'alternatePath' | 'counterpartPath'>
  >
>;

const LEGAL_PAGE_CONTENT: LocalizedLegalPageMap = {
  'privacy-policy': {
    es: {
      metaTitle: 'Política de privacidad | Gisela Saldarriaga',
      metaDescription:
        'Política de privacidad de Gisela Saldarriaga para el sitio de portafolio, servicios UGC y contacto comercial. Explica datos tratados, fines, derechos y contacto.',
      breadcrumbLabel: 'Política de privacidad',
      eyebrow: 'Privacidad y datos',
      title: 'Política de privacidad para un sitio de portafolio, prospección y contacto comercial',
      intro:
        'Esta política explica cómo Gisela Saldarriaga trata la información relacionada con este sitio web, su portafolio de videos, sus páginas de servicio y sus canales de contacto profesionales.',
      audienceNote:
        'El sitio está posicionado principalmente para marcas y equipos que venden a audiencias hispanohablantes en Estados Unidos, España y Latinoamérica, además de briefs seleccionados en inglés.',
      updatedDateLabel: 'Última actualización: 22 de marzo de 2026',
      effectiveDateLabel: 'Vigente desde: 22 de marzo de 2026',
      summaryItems: [
        'Responsable: Gisela Saldarriaga',
        `Contacto de privacidad: ${SUPPORT_EMAIL}`,
        'Mercados principales: EE. UU., España y LatAm',
        'Estado actual del formulario: validación local, sin envío desde el sitio',
      ],
      tocTitle: 'Contenido',
      sections: [
        {
          id: 'alcance',
          title: '1. Responsable, alcance y contexto del sitio',
          paragraphs: [
            'La responsable del tratamiento descrito en esta página es Gisela Saldarriaga. Esta política cubre el dominio principal www.giselasaldarriaga.com, sus versiones en español e inglés, sus páginas de servicio, sus recursos estáticos y el material de portafolio accesible desde ese entorno.',
            'El sitio funciona como presencia profesional, portafolio, punto de descubrimiento orgánico y superficie de contacto comercial para servicios de UGC, demos de producto, videos de portavoz, reseñas y paquetes de footage.',
          ],
          bullets: [
            'Controladora pública del tratamiento: Gisela Saldarriaga.',
            `Canal de privacidad y derechos: ${SUPPORT_EMAIL}.`,
            'Ubicación operativa comunicada en el sitio: Medellín, Colombia.',
          ],
        },
        {
          id: 'datos',
          title: '2. Categorías de datos que puedo tratar',
          paragraphs: [
            'No todas las categorías se recogen en todos los casos. Dependen de cómo interactúe con el sitio o con los canales externos enlazados desde él.',
          ],
          bullets: [
            'Datos de contacto que usted decide compartir, como nombre, correo, asunto, brief comercial o mensajes enviados por email o plataformas externas.',
            'Datos técnicos de navegación, como dirección IP aproximada, navegador, dispositivo, idioma, páginas visitadas, tiempos de carga y eventos de uso agregados o seudonimizados asociados a la analítica del sitio.',
            'Preferencias técnicas guardadas localmente en su navegador, como la preferencia de tema claro u oscuro.',
            'Datos derivados del acceso a videos, imágenes y otros assets servidos desde la infraestructura de media/CDN del sitio.',
            'Datos que usted comparta directamente con plataformas externas si decide contactar por WhatsApp, Telegram, Fiverr o redes sociales enlazadas desde esta web.',
          ],
          note:
            'El formulario actual del sitio valida campos en el navegador y muestra feedback visual, pero hoy no transmite ni almacena la información en esta web mientras no se implemente un backend o integrador real.',
        },
        {
          id: 'fuentes',
          title: '3. Fuentes de datos y tecnologías actualmente presentes',
          bullets: [
            'Carga de páginas y recursos del sitio desde la infraestructura de hosting y distribución de contenido.',
            'Herramientas de medición de rendimiento y uso actualmente visibles en el código, como Vercel Analytics y Vercel Speed Insights.',
            'Google Fonts para la carga tipográfica.',
            'localStorage para recordar la preferencia de tema del usuario.',
            'Plataformas externas de contacto o perfil cuando usted hace clic y continúa la conversación fuera de esta web.',
          ],
          paragraphs: [
            'La información tratada a partir de estas tecnologías se usa para operar la web, entender su rendimiento, mantener una experiencia visual consistente y facilitar el contacto comercial.',
          ],
        },
        {
          id: 'fines-bases',
          title: '4. Finalidades del tratamiento y bases jurídicas',
          bullets: [
            'Atender solicitudes comerciales, briefs, preguntas de servicio o mensajes directos: medidas precontractuales, ejecución de una solicitud y, cuando aplique, consentimiento del remitente.',
            'Operar, asegurar y mejorar el sitio, su rendimiento, estabilidad y experiencia de navegación: interés legítimo en administrar una web profesional segura y funcional.',
            'Mantener preferencias técnicas como el tema visual: interés legítimo y, en su caso, la acción solicitada por el usuario dentro del dispositivo.',
            'Cumplir obligaciones legales, responder requerimientos de autoridades o defender reclamaciones: cumplimiento de obligaciones legales e interés legítimo.',
          ],
          paragraphs: [
            'No utilizo esta web para vender datos personales ni para activar publicidad comportamental de terceros basada en píxeles o perfiles publicitarios propios del sitio en su estado actual.',
          ],
        },
        {
          id: 'destinatarios',
          title: '5. Destinatarios, proveedores y transferencias internacionales',
          paragraphs: [
            'Para operar esta web puedo apoyarme en proveedores de infraestructura, analítica, tipografía, media/CDN y comunicación. Según la ruta de contacto elegida, sus datos pueden ser tratados por terceros que operan fuera de Colombia o del EEE/Reino Unido.',
          ],
          bullets: [
            'Proveedor de hosting y capa de rendimiento del sitio, incluyendo servicios de analítica y speed insights de Vercel.',
            'Proveedor de tipografías web, como Google Fonts.',
            'Infraestructura de media/CDN para servir videos, posters e imágenes del portafolio.',
            'Plataformas externas de contacto o marketplace, como WhatsApp, Telegram, Fiverr e interfaces sociales enlazadas desde la web.',
            'Asesores profesionales o autoridades cuando exista una obligación legal o necesidad razonable de defensa.',
          ],
          note:
            'Cuando usted sale del sitio hacia una plataforma externa, el tratamiento posterior se rige también por las políticas y términos de esa plataforma.',
        },
        {
          id: 'retencion',
          title: '6. Conservación, minimización y seguridad',
          bullets: [
            'Datos de navegación, rendimiento o logs: por el tiempo razonablemente necesario para operar, asegurar, depurar o medir el sitio, sujeto a los periodos de retención del proveedor correspondiente.',
            'Mensajes comerciales o solicitudes directas: por el tiempo necesario para responder, dar seguimiento al proyecto, mantener historial comercial básico o cumplir exigencias legales.',
            'Preferencia de tema en el navegador: hasta que usted la borre, limpie el almacenamiento local o cambie la preferencia.',
            'Datos no enviados por el formulario actual del sitio: no se conservan en esta web porque hoy el formulario no transmite la información.',
          ],
          paragraphs: [
            'Aplico un criterio de minimización: intentar no recoger más información de la necesaria para la relación comercial o la operación técnica del sitio.',
            'Ningún sistema conectado a internet es absolutamente infalible. Por eso, aunque se aplican medidas razonables de seguridad, no se puede garantizar seguridad absoluta en todo momento.',
          ],
        },
        {
          id: 'colombia',
          title: '7. Derechos bajo la normativa colombiana',
          paragraphs: [
            'Si le aplica la legislación colombiana de protección de datos, puede solicitar acceso, actualización, rectificación, supresión cuando proceda, prueba de la autorización cuando sea exigible, información sobre el uso dado a sus datos y revocatoria del consentimiento en los casos permitidos por ley.',
          ],
          bullets: [
            `Puede ejercer estos derechos escribiendo a ${SUPPORT_EMAIL}.`,
            'La solicitud debe permitir identificar al titular, describir el derecho que desea ejercer y, si aplica, aportar contexto suficiente para ubicar la interacción o comunicación relevante.',
          ],
        },
        {
          id: 'eea-uk',
          title: '8. Derechos para EEE y Reino Unido',
          paragraphs: [
            'Cuando aplique GDPR u otra normativa equivalente del EEE/Reino Unido, puede solicitar acceso, rectificación, supresión, restricción, oposición, portabilidad y retiro del consentimiento cuando el tratamiento dependa de él.',
          ],
          bullets: [
            'También puede presentar una reclamación ante la autoridad de control competente si considera que el tratamiento infringe la normativa aplicable.',
            `Para ejercer derechos o pedir aclaraciones, use ${SUPPORT_EMAIL}.`,
          ],
        },
        {
          id: 'california-children',
          title: '9. Derechos de California y privacidad de menores',
          paragraphs: [
            'Si una ley de privacidad de California le resulta aplicable, puede pedir información sobre categorías de datos tratados, finalidades, fuentes, destinatarios, acceso, corrección o supresión, sujeto a excepciones legales.',
            'En el estado actual de esta web, no se vende información personal ni se comparte información para publicidad comportamental cross-context desde este sitio.',
          ],
          bullets: [
            'Este sitio no está dirigido a menores y no está diseñado para captar datos de niños como audiencia principal.',
            'Si cree que un menor compartió datos personales a través de algún canal conectado con esta web, escriba a soporte para revisar y actuar según corresponda.',
          ],
        },
        {
          id: 'actualizaciones-contacto',
          title: '10. Cambios a esta política y contacto',
          paragraphs: [
            'Esta política puede actualizarse cuando cambien las herramientas, el flujo real de datos, los canales de contacto, los requerimientos legales o la forma en que opera el sitio. La fecha de actualización visible arriba será la referencia oficial de la versión vigente.',
            `Para preguntas de privacidad, ejercicio de derechos o solicitudes relacionadas con datos personales, escriba a ${SUPPORT_EMAIL}.`,
          ],
        },
      ],
      contactTitle: 'Solicitudes de privacidad y derechos',
      contactBody:
        'Para peticiones de acceso, corrección, supresión, objeción o dudas sobre esta política, use el correo de soporte. El mensaje debe incluir suficiente contexto para localizar la interacción relevante.',
      contactEmail: SUPPORT_EMAIL,
      counterpartLabel: 'Ver términos y uso de contenido',
      disclaimer:
        'Esta política describe las prácticas visibles y razonablemente inferibles del sitio en su estado actual. No sustituye asesoría legal profesional para jurisdicciones específicas o contratos de cliente.',
    },
    en: {
      metaTitle: 'Privacy Policy | Gisela Saldarriaga',
      metaDescription:
        'Privacy Policy for Gisela Saldarriaga portfolio, UGC services, and commercial contact website. Covers data categories, purposes, rights, and contact details.',
      breadcrumbLabel: 'Privacy Policy',
      eyebrow: 'Privacy and data',
      title: 'Privacy Policy for a portfolio, lead-generation, and commercial contact website',
      intro:
        'This policy explains how Gisela Saldarriaga handles information connected to this website, its video portfolio, its service pages, and its professional contact channels.',
      audienceNote:
        'The site is positioned primarily for brands and teams selling to Spanish-speaking audiences in the United States, Spain, and Latin America, plus selected English-language briefs.',
      updatedDateLabel: 'Last updated: March 22, 2026',
      effectiveDateLabel: 'Effective date: March 22, 2026',
      summaryItems: [
        'Controller: Gisela Saldarriaga',
        `Privacy contact: ${SUPPORT_EMAIL}`,
        'Primary markets: US, Spain, and LatAm',
        'Current form status: local validation only, no site-side submission',
      ],
      tocTitle: 'Contents',
      sections: [
        {
          id: 'scope',
          title: '1. Controller, scope, and site context',
          paragraphs: [
            'The controller described on this page is Gisela Saldarriaga. This policy covers the main domain www.giselasaldarriaga.com, its Spanish and English versions, its service pages, static resources, and the portfolio material made available in that environment.',
            'The site operates as a professional presence, portfolio, organic discovery surface, and commercial contact point for UGC services, product demos, spokesperson videos, reviews, and footage packages.',
          ],
          bullets: [
            'Public controller: Gisela Saldarriaga.',
            `Privacy and rights contact: ${SUPPORT_EMAIL}.`,
            'Operating location stated on the site: Medellin, Colombia.',
          ],
        },
        {
          id: 'data',
          title: '2. Categories of data that may be handled',
          paragraphs: [
            'Not every category is collected in every case. The actual data involved depends on how you interact with the site or with the external channels linked from it.',
          ],
          bullets: [
            'Contact details you choose to share, such as name, email address, subject line, commercial brief, or messages sent through email or third-party platforms.',
            'Technical browsing data, such as approximate IP-related information, browser, device, language, visited pages, load timing, and aggregated or pseudonymized usage events tied to site analytics.',
            'Technical preferences stored locally in your browser, such as light or dark theme preference.',
            'Data generated from access to videos, images, and other assets served through the site media/CDN infrastructure.',
            'Data you provide directly to third-party platforms if you decide to contact through WhatsApp, Telegram, Fiverr, or social profiles linked from this website.',
          ],
          note:
            'The current on-site form validates fields in the browser and shows UI feedback, but it does not currently transmit or store the submitted information on this website unless a real backend or third-party integration is later implemented.',
        },
        {
          id: 'sources',
          title: '3. Data sources and technologies currently present',
          bullets: [
            'Page and asset delivery through the site hosting and content-delivery infrastructure.',
            'Performance and usage tooling currently visible in the codebase, including Vercel Analytics and Vercel Speed Insights.',
            'Google Fonts for web typography.',
            'localStorage to remember the user theme preference.',
            'External communication or marketplace platforms when you click out of this site and continue the conversation elsewhere.',
          ],
          paragraphs: [
            'Information handled through these technologies is used to operate the site, understand performance, keep the visual experience consistent, and make commercial contact easier.',
          ],
        },
        {
          id: 'purposes-bases',
          title: '4. Purposes of processing and legal bases',
          bullets: [
            'Responding to commercial inquiries, service briefs, or direct messages: pre-contractual steps, handling a request, and, where relevant, the sender consent.',
            'Operating, securing, and improving the site, including performance, stability, and browsing experience: legitimate interest in running a secure and functional professional website.',
            'Maintaining technical preferences such as the visual theme: legitimate interest and, where applicable, the action requested by the user on the device.',
            'Complying with legal obligations, responding to lawful requests, or defending claims: legal obligation and legitimate interest.',
          ],
          paragraphs: [
            'In its current state, this website is not used to sell personal information and does not run third-party advertising pixels for cross-context behavioral advertising from the site itself.',
          ],
        },
        {
          id: 'recipients',
          title: '5. Recipients, providers, and international transfers',
          paragraphs: [
            'To operate the site, I may rely on infrastructure, analytics, typography, media/CDN, and communication providers. Depending on the contact path you choose, data may be processed by third parties operating outside Colombia or outside the EEA/UK.',
          ],
          bullets: [
            'Hosting and performance-layer providers, including Vercel services used for analytics and speed insights.',
            'Web font providers such as Google Fonts.',
            'Media/CDN infrastructure used to deliver portfolio videos, posters, and imagery.',
            'External contact and marketplace platforms such as WhatsApp, Telegram, Fiverr, and social interfaces linked from the website.',
            'Professional advisers or authorities where legally required or reasonably necessary for defense purposes.',
          ],
          note:
            'Once you leave the website for an external platform, further processing is also governed by that platform own terms and privacy rules.',
        },
        {
          id: 'retention',
          title: '6. Retention, minimization, and security',
          bullets: [
            'Browsing, performance, or log data: for as long as reasonably needed to operate, secure, troubleshoot, or measure the site, subject to the retention periods of the relevant provider.',
            'Commercial messages or direct inquiries: for as long as needed to respond, follow up on the project, keep a basic commercial record, or comply with legal requirements.',
            'Theme preference in the browser: until you clear local storage, change the preference, or reset browser data.',
            'Data not actually sent by the current on-site form: not retained by this website because the form does not currently transmit the information.',
          ],
          paragraphs: [
            'A minimization approach is applied whenever possible: not collecting more information than is reasonably needed for the commercial relationship or for the technical operation of the site.',
            'No internet-connected system is completely fail-safe. Reasonable security measures may be used, but absolute security cannot be guaranteed at all times.',
          ],
        },
        {
          id: 'colombia',
          title: '7. Rights under Colombian data protection rules',
          paragraphs: [
            'If Colombian data protection law applies to you, you may request access, updating, rectification, deletion where appropriate, proof of authorization where required, information about how data has been used, and revocation of consent in cases allowed by law.',
          ],
          bullets: [
            `You can exercise those rights by emailing ${SUPPORT_EMAIL}.`,
            'The request should identify the data subject, describe the right you want to exercise, and provide enough context to locate the relevant interaction or communication.',
          ],
        },
        {
          id: 'eea-uk',
          title: '8. Rights for the EEA and the United Kingdom',
          paragraphs: [
            'Where GDPR or equivalent EEA/UK rules apply, you may request access, rectification, erasure, restriction, objection, portability, and withdrawal of consent when processing depends on consent.',
          ],
          bullets: [
            'You may also lodge a complaint with the competent supervisory authority if you believe the processing breaches applicable law.',
            `Use ${SUPPORT_EMAIL} for rights requests or clarifications.`,
          ],
        },
        {
          id: 'california-children',
          title: '9. California rights and children privacy',
          paragraphs: [
            'If a California privacy law applies to you, you may request information about the categories of data handled, purposes, sources, recipients, access, correction, or deletion, subject to legal exceptions.',
            'In the current state of this website, personal information is not sold and is not shared for cross-context behavioral advertising from the site itself.',
          ],
          bullets: [
            'This site is not directed to children and is not designed to collect child data as a primary audience surface.',
            'If you believe a minor submitted personal data through a channel connected to this website, contact support so the matter can be reviewed and addressed where appropriate.',
          ],
        },
        {
          id: 'updates-contact',
          title: '10. Policy changes and contact',
          paragraphs: [
            'This policy may be updated when tools change, the actual data flow changes, new contact channels are added, legal requirements evolve, or the way the site operates changes. The visible update date at the top is the official reference for the current version.',
            `For privacy questions, rights requests, or other personal-data matters, email ${SUPPORT_EMAIL}.`,
          ],
        },
      ],
      contactTitle: 'Privacy and rights requests',
      contactBody:
        'Use the support email for access, correction, deletion, objection, portability, or policy questions. Include enough detail to identify the relevant interaction.',
      contactEmail: SUPPORT_EMAIL,
      counterpartLabel: 'Read Terms & Content Use',
      disclaimer:
        'This policy reflects the visible and reasonably inferable data practices of the site in its current state. It is not a substitute for tailored legal advice for a specific jurisdiction or client contract.',
    },
  },
  'terms-content-use': {
    es: {
      metaTitle: 'Términos y uso de contenido | Gisela Saldarriaga',
      metaDescription:
        'Términos y uso de contenido para el sitio de Gisela Saldarriaga. Define titularidad, permisos limitados, usos prohibidos, scraping, IA y contacto.',
      breadcrumbLabel: 'Términos y uso de contenido',
      eyebrow: 'Uso del sitio e IP',
      title: 'Términos y uso de contenido del sitio, portafolio y materiales visibles',
      intro:
        'Estos términos regulan cómo puede usarse el contenido visible en esta web, incluyendo videos, fotografía, copy, diseño, marca y material de portafolio.',
      audienceNote:
        'La web existe para evaluación comercial de marcas, agencias y equipos que consideran contratar servicios de contenido creator-led, UGC y portavoz.',
      updatedDateLabel: 'Última actualización: 22 de marzo de 2026',
      effectiveDateLabel: 'Vigente desde: 22 de marzo de 2026',
      summaryItems: [
        'Titularidad pública: Gisela Saldarriaga',
        `Contacto legal: ${SUPPORT_EMAIL}`,
        'Permiso limitado: revisar el sitio para evaluar servicios',
        'No hay licencia implícita para reutilización, scraping o entrenamiento',
      ],
      tocTitle: 'Contenido',
      sections: [
        {
          id: 'propiedad',
          title: '1. Titularidad del contenido y de la presentación del sitio',
          paragraphs: [
            'Salvo que se indique lo contrario, el contenido visible en este sitio y su selección, organización y presentación están protegidos por derechos de autor, derechos conexos, marcas, diseño, competencia desleal u otras normas aplicables.',
          ],
          bullets: [
            'Videos de portafolio, clips, posters, fotografía, copy, estructura editorial, composición visual, branding y elementos gráficos del sitio.',
            'Nombre comercial, señales de origen y materiales propios de Gisela Saldarriaga o de su estudio profesional cuando así se presenten.',
            'No se transfiere propiedad intelectual por el simple acceso a la web.',
          ],
        },
        {
          id: 'permiso',
          title: '2. Permiso limitado de navegación y evaluación',
          paragraphs: [
            'Puede navegar el sitio y revisar sus materiales únicamente para entender la oferta, evaluar un posible encaje comercial, compartir internamente la referencia de la web dentro de su equipo o contactar para una posible contratación.',
          ],
          bullets: [
            'Ese permiso es revocable, no exclusivo y no transferible.',
            'No autoriza copiar bibliotecas de contenido, descargar de forma masiva ni reutilizar materiales en campañas, piezas propias, datasets o assets públicos.',
          ],
        },
        {
          id: 'prohibidos',
          title: '3. Usos prohibidos sin autorización previa y por escrito',
          bullets: [
            'Copiar, republicar, redistribuir, sublicenciar, vender, alquilar o explotar comercialmente contenido del sitio.',
            'Editar, recortar, rehacer, traducir, doblar, subtitular o crear obras derivadas a partir del material visible en la web.',
            'Usar videos, imágenes, texto, layouts o claims del sitio como creativos propios, ejemplos de portafolio ajeno o referencias publicadas sin permiso.',
            'Eliminar avisos de titularidad, marcas de contexto, atribuciones o señales de origen.',
          ],
        },
        {
          id: 'scraping-ia',
          title: '4. Scraping, extracción masiva, datasets y entrenamiento de IA',
          paragraphs: [
            'Sin autorización previa y por escrito, no está permitido usar el sitio o su contenido como fuente para scraping, extracción automatizada, minería de datasets, benchmarking no autorizado, fine-tuning, entrenamiento, reentrenamiento, embeddings, indexación privada o cualquier otra reutilización orientada a sistemas de IA o bases de datos comerciales.',
          ],
          bullets: [
            'También se prohíbe descargar material de portafolio en bloque o compilarlo en colecciones, repositorios o librerías de prompts, ejemplos o entrenamiento.',
            'Una política de privacidad no sustituye esta restricción de uso: la limitación aquí es contractual y de propiedad intelectual, no solo de datos personales.',
          ],
        },
        {
          id: 'terceros-clientes',
          title: '5. Marcas de terceros, plataformas y entregables de cliente',
          paragraphs: [
            'Las marcas, nombres de plataformas y logos de terceros mencionados o enlazados en el sitio pertenecen a sus respectivos titulares y se muestran con fines identificativos, contextuales o de referencia comercial.',
            'Los entregables creados para clientes, así como sus derechos de uso, exclusividad, whitelisting, paid usage, territorios o plazos, se rigen por acuerdos, propuestas, SOWs o contratos específicos. Nada en esta página reemplaza esos acuerdos.',
          ],
        },
        {
          id: 'disponibilidad',
          title: '6. Disponibilidad, exactitud y límites del contenido público',
          paragraphs: [
            'El sitio puede actualizarse, reorganizarse, retirar piezas de portafolio, cambiar textos o modificar la forma de presentar servicios sin previo aviso. Aunque se busca mantener una descripción profesional y fiel de la oferta, el contenido público no sustituye una propuesta comercial cerrada ni una asesoría legal, fiscal o regulatoria.',
          ],
          bullets: [
            'La disponibilidad de servicios, formatos, licencias, tiempos o mercados siempre debe confirmarse en una conversación comercial directa.',
            'La presencia de un ejemplo o un sector en el portafolio no garantiza disponibilidad continua, exclusividad o aceptación automática de nuevos proyectos similares.',
          ],
        },
        {
          id: 'cumplimiento-contacto',
          title: '7. Cumplimiento, reclamaciones y contacto',
          paragraphs: [
            `Si necesita pedir permiso para un uso específico, aclarar una posible licencia o reportar una infracción, escriba a ${SUPPORT_EMAIL}.`,
            'El uso no autorizado del contenido puede dar lugar a requerimientos de retirada, objeciones de propiedad intelectual, restricción de acceso o las acciones adicionales que resulten razonablemente disponibles.',
          ],
        },
      ],
      contactTitle: 'Permisos, licencias o reclamaciones',
      contactBody:
        'Use el correo legal para pedir una autorización expresa, consultar una licencia específica o reportar un uso no autorizado del contenido visible en la web.',
      contactEmail: SUPPORT_EMAIL,
      counterpartLabel: 'Ver política de privacidad',
      disclaimer:
        'Estos términos regulan el uso público del sitio y su contenido visible. Los derechos y obligaciones de proyectos contratados se acuerdan aparte en propuestas o contratos específicos.',
    },
    en: {
      metaTitle: 'Terms & Content Use | Gisela Saldarriaga',
      metaDescription:
        'Terms & Content Use for the Gisela Saldarriaga website. Covers ownership, limited permissions, prohibited uses, scraping, AI reuse, and contact.',
      breadcrumbLabel: 'Terms & Content Use',
      eyebrow: 'Site use and IP',
      title: 'Terms and content-use rules for the website, portfolio, and visible materials',
      intro:
        'These terms govern how the visible content on this website may be used, including videos, photography, copy, design, branding, and portfolio materials.',
      audienceNote:
        'The website exists as a commercial-evaluation surface for brands, agencies, and teams considering creator-led content, UGC, and spokesperson services.',
      updatedDateLabel: 'Last updated: March 22, 2026',
      effectiveDateLabel: 'Effective date: March 22, 2026',
      summaryItems: [
        'Public owner: Gisela Saldarriaga',
        `Legal contact: ${SUPPORT_EMAIL}`,
        'Limited permission: review the site to evaluate services',
        'No implied license for reuse, scraping, or training',
      ],
      tocTitle: 'Contents',
      sections: [
        {
          id: 'ownership',
          title: '1. Ownership of content and site presentation',
          paragraphs: [
            'Unless stated otherwise, the visible content on this website and its selection, organization, and presentation are protected by copyright, related rights, trademark, design, unfair competition, or other applicable rules.',
          ],
          bullets: [
            'Portfolio videos, clips, posters, photography, copy, editorial structure, visual composition, branding, and graphic elements of the site.',
            'Trade name, source identifiers, and materials belonging to Gisela Saldarriaga or the professional studio where presented that way.',
            'No intellectual-property ownership is transferred simply because the site can be accessed.',
          ],
        },
        {
          id: 'license',
          title: '2. Limited permission to browse and evaluate',
          paragraphs: [
            'You may browse the site and review its materials only to understand the offer, evaluate a potential commercial fit, share the website reference internally with your team, or make contact about a possible engagement.',
          ],
          bullets: [
            'That permission is revocable, non-exclusive, and non-transferable.',
            'It does not authorize copying content libraries, bulk downloading, or reusing materials in campaigns, owned assets, datasets, or public examples.',
          ],
        },
        {
          id: 'prohibited',
          title: '3. Prohibited uses without prior written permission',
          bullets: [
            'Copying, republishing, redistributing, sublicensing, selling, renting, or commercially exploiting any site content.',
            'Editing, trimming, remaking, translating, dubbing, subtitling, or creating derivative works from the visible materials on the site.',
            'Using site videos, images, copy, layouts, or claims as your own creative, another portfolio example, or a published reference without permission.',
            'Removing ownership notices, contextual attribution, or source identifiers.',
          ],
        },
        {
          id: 'scraping-ai',
          title: '4. Scraping, bulk extraction, datasets, and AI training',
          paragraphs: [
            'Without prior written authorization, the site and its content may not be used as a source for scraping, automated extraction, dataset mining, unauthorized benchmarking, fine-tuning, training, retraining, embeddings, private indexing, or any other reuse tied to AI systems or commercial databases.',
          ],
          bullets: [
            'Bulk downloading portfolio material or compiling it into prompt libraries, training examples, repositories, or internal model corpora is also prohibited.',
            'A privacy policy does not replace this restriction. The limit here is based on contract and intellectual-property control, not only personal-data handling.',
          ],
        },
        {
          id: 'third-party-client',
          title: '5. Third-party marks, platforms, and client deliverables',
          paragraphs: [
            'Third-party marks, platform names, and logos referenced or linked on the site belong to their respective owners and appear for identification, context, or commercial-reference purposes.',
            'Client deliverables, and any rights tied to them such as usage scope, exclusivity, whitelisting, paid usage, territory, or term, are governed by specific proposals, statements of work, or contracts. Nothing on this page replaces those agreements.',
          ],
        },
        {
          id: 'availability',
          title: '6. Availability, accuracy, and limits of public-facing content',
          paragraphs: [
            'The site may be updated, reorganized, have portfolio pieces removed, have text changed, or present services differently without notice. While the intent is to keep the public description professional and accurate, public-facing content does not replace a final commercial proposal or legal, tax, or regulatory advice.',
          ],
          bullets: [
            'Availability of services, formats, licenses, timelines, or markets should always be confirmed in a direct commercial conversation.',
            'A sample, industry, or format appearing in the portfolio does not guarantee continuous availability, exclusivity, or automatic acceptance of similar future work.',
          ],
        },
        {
          id: 'enforcement-contact',
          title: '7. Enforcement, complaints, and contact',
          paragraphs: [
            `If you need permission for a specific use, want to clarify a possible license, or need to report infringement, email ${SUPPORT_EMAIL}.`,
            'Unauthorized use may lead to takedown demands, intellectual-property objections, access restriction, or other reasonably available actions.',
          ],
        },
      ],
      contactTitle: 'Permissions, licenses, or complaints',
      contactBody:
        'Use the legal email to request express permission, discuss a specific license, or report unauthorized use of visible website content.',
      contactEmail: SUPPORT_EMAIL,
      counterpartLabel: 'Read Privacy Policy',
      disclaimer:
        'These terms govern the public use of the site and its visible content. Rights and obligations for paid client projects are handled separately in proposals or contracts.',
    },
  },
};

export const getLegalPageContent = (
  pageId: LegalPageId,
  locale: SiteLocale,
): LegalPageContent => {
  const localized = LEGAL_PAGE_CONTENT[pageId][locale];
  const alternateLocale = locale === 'es' ? 'en' : 'es';
  const counterpartId: LegalPageId =
    pageId === 'privacy-policy' ? 'terms-content-use' : 'privacy-policy';

  return {
    ...localized,
    id: pageId,
    locale,
    path: getLegalPath(pageId, locale),
    alternatePath: getLegalPath(pageId, alternateLocale),
    counterpartPath: getLegalPath(counterpartId, locale),
  };
};
