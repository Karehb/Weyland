function camara(args) {
    if (args.length === 0) {
        return [
            "<p>Se necesita una ID valida: <code>camara id</code></p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`
        ];
    }
    const camaraId = args[0];
    const camaraDweet = CAMERAS[camaraId];
    if (!camaraDweet) {
        return [
            `No tienes acceso a la camara con la ID ${camaraId}`,
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`
        ];
    }
    return camaraDweet();
}

const CAMERAS = {
    34: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-34</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam1.jpg' class='glitch'>"
        ];
    },
    156: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-156</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam2.jpg' class='glitch'>"
        ];
    },
    888: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-888</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam3.jpg' class='glitch'>"
        ];
    },
    1059: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-1059</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam5.jpg' class='glitch'>"
        ];
    },
    3660: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-3660</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam6.jpg' class='glitch'>"
        ];
    },
    5112: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-5112</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/camBroken.jpg' class='glitch'>"
        ];
    },
    "g11_lab": function() {
        return [
            "<p class='shimmer' 1em>Video g11_lab</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam8.jpg' class='glitch'>"
        ];
    },
    10218: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-10218</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam7.jpg' class='glitch'>"
        ];
    },
    46035: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-46035</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam9.jpg' class='glitch'>"
        ];
    },
    46038: function() {
        return [
            "<p class='shimmer' 1em>Video CAM-46038</p>",
            `Tienes acceso a las siguientes camaras: ${Object.keys(CAMERAS).join(" ")}`,
            "<img src='config/cam10.jpg' class='glitch'>"
        ];
    },
    "xxxx": function() {
        return [
            "<p class='shimmer' 1em>Imagen Desconocida</p>",
            "<p class='glow'>Fallo critico en la transmisión</p>",
            "<img src='config/cam4.jpg' class='glitch'>"
        ];
    },
}

function puerta(args) {
  if (args.length === 0) {
    const camerasList = Object.keys(PUERTAS).join("\n");
    return [
      "<p>An ID must be provided: <code>puerta $id</code></p>",
      `You currently have access to the following doors:\n${camerasList}`
    ];
  }

  const puertaId = args[0];
  const puertaDweet = PUERTAS[puertaId];
  if (!puertaDweet) {
    return `You do not have access to the door with ID ${puertaId}`;
  }

  return puertaDweet();
}

const PUERTAS = {
  1: function() {
    return "<p>PUERTA 1 BLOQUEADA</p>";
  },
  2: function() {
    return "<p>PUERTA 2 BLOQUEADA</p>";
  },
  3: function() {
    return "<p>PUERTA 3 BLOQUEADA</p>";
  },
  4: function() {
    return "<p>PUERTA 4 BLOQUEADA</p>";
  },
};