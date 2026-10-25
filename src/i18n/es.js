import {
  web,
  backend,
  creator,
  figma,
  bsindcare,
  dflorarte,
  education,
  herobg,
  projectBsindcare,
  projectDflorarte,
  projectBrzstore,
  projectIcarus,
  projectIcarusFleet,
} from "../assets";

const es = {
  meta: {
    title: "BrtzDesigns | Desarrollador Full-Stack y Diseñador UI/UX - Perth, Australia",
    description:
      "BrtzDesigns - Brandon Brumertz, desarrollador full-stack y diseñador UI/UX en Perth, Australia. C#, .NET, Python, JavaScript, Node.js, SQL y MongoDB. Trabajos en vivo: bsindcare.com, dflorarte.com.",
  },

  nav: {
    about: "Sobre mí",
    work: "Experiencia",
    tech: "Tecnologías",
    services: "Servicios",
    projects: "Proyectos",
    contact: "Contacto",
    hireMe: "Contrátame",
    language: "Idioma",
  },

  hero: {
    greeting: "Hola, soy",
    name: "Brandon",
    subtitle: ["Desarrollador Full-Stack", "& Diseñador UI/UX."],
    scrollHint: "Desliza para explorar",
  },

  about: {
    sectionSub: "Introducción",
    sectionHead: "Resumen.",
    paragraph:
      "Poseo un Diplomado en Tecnologías de la Información en Programación Avanzada (ICT50220) y trabajo como desarrollador full-stack y diseñador UI/UX en Perth, Australia. Programo en C#, .NET, Python, JavaScript, Node.js y HTML/CSS, con bases de datos SQL y MongoDB, convierto ideas en productos rápidos, accesibles y bien diseñados.",
    credentials: ["ICT50220", "Diplomado en IT · Programación Avanzada", "Perth, Australia"],
    services: [
      { title: "Desarrollador Full-Stack", icon: web },
      { title: "Diseñador UI/UX", icon: figma },
      { title: "Backend y APIs", icon: backend },
      { title: "Ingeniería de Datos", icon: creator },
    ],
  },

  experience: {
    sectionSub: "Lo que he hecho hasta ahora",
    sectionHead: "Experiencia.",
    items: [
      {
        title: "Fundador y Desarrollador Full-Stack / UI-UX",
        company_name: "BrtzDesigns",
        icon: creator,
        iconBg: "#4a2b99",
        date: "Ene 2025 - Actualidad",
        points: [
          "Fundé BrtzDesigns, un estudio con base en Perth que ofrece diseño y desarrollo web integral para pequeñas empresas.",
          "Diseñé y lancé dos sitios web para clientes bsindcare.com y dflorarte.com desde el descubrimiento de marca hasta el despliegue.",
          "Construí este portafolio 3D interactivo con React, Three.js y Tailwind CSS, con código dividido para una carga inicial rápida.",
          "Gestiono todo el ciclo del cliente: definición, diseño UI, desarrollo, pruebas automatizadas y entrega.",
        ],
      },
      {
        title: "Desarrollador Web · Proyecto de Cliente",
        company_name: "BS IND CARE",
        icon: bsindcare,
        iconBg: "#3B176B",
        date: "2025 - 2026",
        points: [
          "Entregué la página oficial de una marca cosmética premium como aplicación de una sola página sin fase de compilación.",
          "Desarrollé un sistema de diseño propio,  tokens de marca, glassmorphism y animaciones keyframe, sobre HTML5 semántico con ARIA.",
          "Implementé carrusel de galería, menú móvil, validación en tiempo real, protección antispam con honeypot y notificaciones toast en JavaScript puro.",
          "Se entregó con una suite de pruebas automatizadas de 78/78, cubriendo integridad del DOM, recursos multimedia, enlaces internos y SEO.",
        ],
      },
      {
        title: "Desarrollador Web · Proyecto de Cliente",
        company_name: "D'Florarte",
        icon: dflorarte,
        iconBg: "#5A5243",
        date: "2025 - 2026",
        points: [
          "Construí el sitio oficial de una sola página para un estudio de wedding planner y arte floral con más de 20 años de trayectoria.",
          "Desarrollé una galería coverflow 3D con Swiper 11, un portafolio filtrable y un lightbox accesible por teclado.",
          "Añadí canales de conversión directos: botón flotante de WhatsApp y mensajes de consulta preconfigurados por servicio.",
          "Entregué una suite de pruebas automatizadas de 32/32 más verificaciones de integración HTTP para códigos de estado y tipos MIME.",
        ],
      },
      {
        title: "Diplomado en Tecnologías de la Información",
        company_name: "Programación Avanzada · ICT50220",
        icon: education,
        iconBg: "#8a6a1f",
        date: "2024 - 2025",
        points: [
          "Completé un diplomado en programación avanzada que cubre desarrollo orientado a objetos, estructuras de datos y algoritmos.",
          "Trabajé con C#, .NET, Java, Python, SQL y tecnologías web en proyectos evaluados de estilo producción.",
          "Practiqué desarrollo ágil, control de versiones y documentación técnica en proyectos en equipo.",
        ],
      },
    ],
  },

  tech: {
    sectionSub: "Mi caja de herramientas técnica",
    sectionHead: "Tecnologías.",
  },

  services: {
    sectionSub: "Lo que puedo hacer por ti",
    sectionHead: "Servicios.",
    intro:
      "Ya sea que necesites un sitio nuevo, un rediseño o una aplicación a medida, yo me encargo de toda la construcción - diseño, código, pruebas y lanzamiento - para que trates con una sola persona en lugar de una agencia.",
    items: [
      {
        title: "Diseño Web",
        description:
          "Landing pages orientadas a la conversión y sistemas de marca que se ven tan bien como rinden, construidos sobre un lenguaje de diseño documentado.",
        highlight: "Sistemas de diseño",
      },
      {
        title: "Desarrollo Web",
        description:
          "Construcciones a medida, rápidas, responsivas y accesibles con marcado semántico limpio, sin bloat de constructores ni ataduras a plantillas.",
        highlight: "Rendimiento",
      },
      {
        title: "Diseño UI/UX",
        description:
          "Wireframes, flujos e interfaces pulidas diseñadas en Figma y luego llevadas al código sin perder un solo detalle.",
        highlight: "Figma → código",
      },
      {
        title: "Integraciones y Bases de Datos",
        description:
          "Formularios de contacto, embudos de WhatsApp, capas de datos SQL y MongoDB, APIs REST y servicios de terceros conectados correctamente.",
        highlight: "Backend",
      },
    ],
    cta: {
      title: "¿Tienes un proyecto en mente?",
      text: "Cuéntame qué necesitas y te responderé en un día hábil.",
      whatsapp: "Chatear por WhatsApp",
      email: "Escríbeme un correo",
    },
  },

  projects: {
    sectionSub: "Mi trabajo",
    sectionHead: "Proyectos.",
    intro:
      "Una selección de trabajo real para clientes y proyectos de código abierto. Cada tarjeta enlaza al sitio en vivo y al repositorio de código, con el stack utilizado.",
    liveDemo: "Visitar sitio en vivo",
    sourceCode: "Código fuente",
    items: [
      {
        name: "BS IND CARE",
        description:
          "Landing page oficial de una marca cosmética premium: narrativa de producto inmersiva, carrusel de galería interactivo, embudo de compra por WhatsApp y formulario de contacto validado en tiempo real. SPA sin build con suite de pruebas 78/78.",
        tags: [
          { name: "html5", color: "blue-text-gradient" },
          { name: "tailwind", color: "green-text-gradient" },
          { name: "javascript", color: "pink-text-gradient" },
          { name: "seo", color: "orange-text-gradient" },
        ],
        image: projectBsindcare,
        source_code_link: "https://github.com/Brumertz/bs_ind_care",
        live_link: "https://bsindcare.com",
      },
      {
        name: "D'Florarte",
        description:
          "Sitio de una sola página para un estudio de wedding planner y arte floral: galería coverflow 3D, portafolio filtrable con lightbox, catálogo de servicios y consultas por WhatsApp con mensajes preconfigurados. 32/32 pruebas superadas.",
        tags: [
          { name: "javascript", color: "blue-text-gradient" },
          { name: "swiper", color: "green-text-gradient" },
          { name: "css3", color: "pink-text-gradient" },
          { name: "spa", color: "orange-text-gradient" },
        ],
        image: projectDflorarte,
        source_code_link: "https://github.com/Brumertz/Dflorarte",
        live_link: "https://dflorarte.com",
      },
      {
        name: "Portafolio 3D BrtzDesigns",
        description:
          "Este sitio. Portafolio React + Vite con escenas Three.js interactivas, animación con framer motion, carga diferida por código, contenido bilingüe EN/ES y formulario de contacto con EmailJS y validación.",
        tags: [
          { name: "react", color: "blue-text-gradient" },
          { name: "threejs", color: "green-text-gradient" },
          { name: "vite", color: "pink-text-gradient" },
          { name: "tailwind", color: "orange-text-gradient" },
        ],
        image: herobg,
        source_code_link: "https://github.com/Brumertz/brandon-portfolio",
        live_link: "https://brtzdesigns.com",
      },
      {
        name: "BrzStore",
        description:
          "Tienda full-stack sobre ASP.NET Core: API REST junto a un cliente web Razor, con acceso a datos estructurado y una arquitectura de aplicación en capas.",
        tags: [
          { name: "c#", color: "blue-text-gradient" },
          { name: "asp.net", color: "green-text-gradient" },
          { name: "sql", color: "pink-text-gradient" },
        ],
        image: projectBrzstore,
        source_code_link: "https://github.com/Brumertz/BrzStore-Project",
      },
      {
        name: "Icarus Drone Service App",
        description:
          "Aplicación de escritorio para registrar servicios de dron, regulares y express, basada en programación y despacho de trabajos con colas.",
        tags: [
          { name: "javascript", color: "blue-text-gradient" },
          { name: "desktop", color: "green-text-gradient" },
          { name: "queues", color: "pink-text-gradient" },
        ],
        image: projectIcarus,
        source_code_link: "https://github.com/Brumertz/Icarus_Drone_Service_App",
      },
      {
        name: "Icarus Fleet",
        description:
          "API de colas de servicio y panel web para mantenimiento de drones construida con ASP.NET Core: colas FIFO Regular y Express, cálculo atómico de recargos, etiquetas secuenciales e interfaz Swagger.",
        tags: [
          { name: "c#", color: "blue-text-gradient" },
          { name: ".net", color: "green-text-gradient" },
          { name: "minimal-api", color: "pink-text-gradient" },
        ],
        image: projectIcarusFleet,
        source_code_link: "https://github.com/Brumertz/Icarus-Fleet",
      },
    ],
  },

  contact: {
    sectionSub: "Ponte en contacto",
    sectionHead: "Contacto.",
    cardTitle: ["Construyamos algo ", "extraordinario"],
    cardText: "¿Tienes un proyecto en mente? Envíame un mensaje y te responderé a la brevedad.",
    infoTitle: "Contacto directo",
    info: [
      { key: "email", label: "Correo", value: "brtz.designs@gmail.com" },
      { key: "phone", label: "Teléfono", value: "+61 406 771 491" },
      { key: "location", label: "Ubicación", value: "Perth, Australia" },
    ],
    whatsapp: "Chatear por WhatsApp",
    labels: { name: "Tu Nombre", email: "Tu Correo", message: "Tu Mensaje" },
    placeholders: {
      name: "p. ej. Alex Johnson",
      email: "p. ej. alex@ejemplo.com",
      message: "Cuéntame sobre tu proyecto, objetivos o plazos...",
    },
    submit: "Enviar Mensaje",
    sending: "Enviando...",
    success: "¡Gracias! Tu mensaje se ha enviado correctamente.",
    errorFallback: "Algo salió mal. Por favor, inténtalo de nuevo más tarde.",
    validation: {
      name: "Por favor, introduce tu nombre.",
      email: "Por favor, introduce tu correo.",
      emailInvalid: "Por favor, introduce una dirección de correo válida.",
      message: "Por favor, introduce tu mensaje.",
    },
    earthLabel: "Con base en Perth, Australia - trabajando con clientes de todo el mundo.",
  },

  footer: {
    email: "Correo",
    phone: "Teléfono",
    location: "Ubicación",
    rights: "Todos los derechos reservados.",
    backToTop: "Volver arriba",
  },
};

export default es;
