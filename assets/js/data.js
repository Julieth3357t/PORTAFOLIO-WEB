// Catálogo del portafolio. Cada pieza pertenece a una de las tres categorías.
// Los títulos descriptivos organizan los archivos entregados; no implican una
// relación comercial ni créditos de producción no confirmados.
window.PORTFOLIO_CATEGORIES = [
  {
    id: "boda",
    label: "Videos de Boda",
    description: "Cobertura de matrimonios y eventos.",
  },
  {
    id: "entrevista",
    label: "Videos de Entrevista",
    description: "Formatos documentales, corporativos y de diálogo.",
  },
  {
    id: "proyectos",
    label: "Proyectos",
    description: "Diseños, campañas y formatos híbridos.",
  },
];

// El orden define la vista «Todos»: mezcla categorías y encaja las piezas
// horizontales (que ocupan dos columnas) sin dejar huecos en la cuadrícula.
window.PORTFOLIO_PROJECTS = [
  {
    id: "rosa-andrea",
    title: "Rosa Andrea",
    category: "boda",
    subtitle: "Wedding planner, una boda de principio a fin",
    seconds: 59.513,
    orientation: "vertical",
    format: "Vertical 9:16",
    description:
      "Los preparativos, la ceremonia y la celebración de una boda en una misma historia. Un montaje que pasa de los pequeños gestos a la energía de la fiesta.",
    focus: "Detalle y emoción, continuidad del evento y cambios de ritmo.",
    alt: "Una pareja de novios tomada de la mano durante su boda",
  },
  {
    id: "sofia-voces",
    title: "Voces del equipo",
    category: "entrevista",
    subtitle: "Sofía, personas y oficina",
    seconds: 70.984,
    orientation: "vertical",
    format: "Vertical 9:16",
    description:
      "Un acercamiento a las personas detrás del trabajo de oficina. Las presentaciones a cámara se conectan con reuniones, desplazamientos y escenas compartidas del equipo.",
    focus: "Retrato corporativo, intervenciones a cámara y planos de recurso.",
    alt: "Dos compañeros de oficina recorren juntos un pasillo",
  },
  {
    id: "cosmetica",
    title: "Una esencia, una historia",
    category: "proyectos",
    subtitle: "Spot de producto, cosmética",
    seconds: 34.737,
    orientation: "vertical",
    format: "Vertical 9:16",
    description:
      "Un recorrido entre el producto, la belleza y el paisaje. Primeros planos, luz cálida y texturas construyen una atmósfera sensorial alrededor de una fragancia.",
    focus: "Planos de detalle, tonos cálidos y montaje sensorial.",
    alt: "Mujer con una fragancia en un paisaje de arena al atardecer",
  },
  {
    id: "sofia-logistica",
    title: "Personas en acción",
    category: "entrevista",
    subtitle: "Sofía, operación y logística",
    seconds: 60.256,
    orientation: "vertical",
    format: "Vertical 9:16",
    description:
      "Dos integrantes del equipo guían un recorrido entre la operación y la oficina. Sus intervenciones a cámara se alternan con escenas de su jornada.",
    focus: "Diálogo a cámara, contexto operativo y montaje de apoyo.",
    alt: "Dos integrantes de Sofía con chalecos naranjas presentan su entorno de trabajo",
  },
  {
    id: "cambia",
    title: "Cambia el chip",
    category: "proyectos",
    subtitle: "Campaña universitaria UDI",
    seconds: 37.106,
    orientation: "vertical",
    format: "Vertical 9:16",
    description:
      "Una campaña de lenguaje joven que mezcla pantallas, transiciones y tipografía. El universo visual de la UDI conecta la vida universitaria con la idea de cambiar de perspectiva.",
    focus: "Collage de pantallas, tipografía en movimiento y transiciones.",
    alt: "Collage de pantallas de la campaña universitaria Cambia el chip",
  },
  {
    id: "expocruz",
    title: "La Cabaña en Expocruz",
    category: "entrevista",
    subtitle: "Construpanel, recorrido de obra",
    seconds: 23.383,
    orientation: "vertical",
    format: "Vertical 9:16",
    description:
      "Un recorrido por la construcción de La Cabaña Mucarzel para Expocruz. La presentación a cámara se combina con planos del espacio y textos que destacan materiales y sistemas constructivos.",
    focus: "Presentación a cámara, texto destacado y contexto de obra.",
    alt: "Presentador con casco en la obra de La Cabaña Mucarzel",
  },
  {
    id: "video-es-arte",
    title: "Hacer un video es un arte",
    category: "proyectos",
    subtitle: "Montaje conceptual sobre el lenguaje audiovisual",
    seconds: 59.722,
    orientation: "horizontal",
    format: "Horizontal 4:3",
    description:
      "Una exploración del proceso creativo a través de escenas cinematográficas, imágenes del entorno y bloques tipográficos. El contraste entre imágenes y texto construye una reflexión sobre la idea y el guion.",
    focus:
      "Referencias cinematográficas, tipografía expresiva y montaje conceptual.",
    credit:
      "Montaje con fragmentos cinematográficos de terceros. La ficha describe el montaje; no atribuye la filmación de esas escenas.",
    alt: "Primer plano de un trompetista en una escena cinematográfica",
  },
  {
    id: "cabana-mucarzel",
    title: "Del proceso al resultado",
    category: "entrevista",
    subtitle: "La Cabaña Mucarzel, proyecto terminado",
    seconds: 26.471,
    orientation: "vertical",
    format: "Vertical 9:16",
    description:
      "La obra y el espacio terminado dialogan en una pieza breve. El presentador acompaña un montaje que alterna el avance constructivo con interiores y exteriores.",
    focus: "Antes y después, recorrido espacial y presentación a cámara.",
    alt: "Interior terminado de La Cabaña Mucarzel con un presentador en primer plano",
  },
  {
    id: "sofia-equipo",
    title: "Dentro del equipo",
    category: "entrevista",
    subtitle: "Sofía, vida de equipo",
    seconds: 45.349,
    orientation: "vertical",
    format: "Vertical 9:16",
    description:
      "Oficinas, operación y personas en su entorno cotidiano. Un formato documental que conecta distintas áreas de Sofía a través de acciones y momentos de trabajo.",
    focus: "Registro documental, personas y entorno, narrativa cotidiana.",
    alt: "Integrantes de un equipo de trabajo con chalecos de seguridad junto a camiones",
  },
  {
    id: "sensibilizacion",
    title: "Lo que no se ve",
    category: "proyectos",
    subtitle: "Campaña de sensibilización sobre salud mental",
    seconds: 41.936,
    orientation: "horizontal",
    format: "Horizontal 4:3",
    description:
      "Un montaje de sensibilización sobre el malestar emocional. La alternancia de escenas de ficción y mensajes tipográficos busca dar espacio a aquello que muchas veces permanece invisible.",
    focus: "Narrativa emocional, contraste de color y texto con imagen.",
    credit:
      "Pieza con escenas de ficción de terceros. La ficha se refiere al montaje y su intención visual, sin atribuir la filmación de los fragmentos.",
    alt: "Composición tipográfica amarilla junto a una silueta frente a una ventana",
    sensitive: true,
  },
];
