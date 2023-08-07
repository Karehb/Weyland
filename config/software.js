function camara(args) {
    if (args.length === 0) {
        return [
            "<p>An ID must be provided: <code>camara $id</code></p>",
            `You currently have access to the following cameras: ${Object.keys(CAMERAS).join(" ")}`
        ];
    }
    const camaraId = args[0];
    const camaraDweet = CAMERAS[camaraId];
    if (!camaraDweet) {
        return `You do not have access to the camera with ID ${camaraId}`;
    }

    // Mostrar la cámara durante 3 segundos
    const camaraContent = camaraDweet();
    mostrarContenidoTemporal(camaraContent, 3000);

    return "<img src='config/camBroken.jpg' class='glitch'>";
}

function mostrarContenidoTemporal(contenido, tiempo) {
    // Obtener el contenedor donde se mostrará el contenido temporalmente
    const temporalContainer = document.createElement('div');
    temporalContainer.innerHTML = contenido;

    // Agregar el contenedor temporal al cuerpo del documento
    document.body.appendChild(temporalContainer);

    // Después de 'tiempo' milisegundos, borrar el contenido del contenedor y eliminarlo del documento
    setTimeout(() => {
        temporalContainer.innerHTML = '';
        document.body.removeChild(temporalContainer);
    }, tiempo);
}

const CAMERAS = {
    34: function() {
        return "<p>Video CAM-34</p><img src='config/cam1.jpg' class='glitch'>";
    },
    888: function() {
        return "<p>Video CAM-888</p><img src='config/cam2.jpg' class='glitch'>";
    },
    4800: function() {
        return "<p>Video CAM-4800</p><img src='config/cam3.jpg' class='glitch'>";
    },
    10549: function() {
        return "<p>Video CAM-10549</p><img src='config/cam4.jpg' class='glitch'>";
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