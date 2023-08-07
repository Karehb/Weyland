function camara(args) {
    if (args.length === 0 || typeof args[0] !== "number") {
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
    return camaraDweet();
}

const CAMERAS = {
    888: function() {
        return "<p>CAMARA DE SEGURIDAD 888</p><img src='config/colonia_blue.jpg' class='glitch'>";
    },
    10549: function() {
        return "<p>CAMARA DE SEGURIDAD 10549</p><img src='config/colonia_blue.jpg' class='glitch'>";
    },
};

function puerta(args) {
    if (args.length === 0 || typeof args[0] !== "number") {
        return [
            "<p>An ID must be provided: <code>puerta $id</code></p>",
            `You currently have access to the following doors: ${Object.keys(PUERTAS).join(", ")}`
        ];
    }
    const puertaId = args[0];
    const puertaAction = args[1];

    const puertaDweet = PUERTAS[puertaId];
    if (!puertaDweet) {
        return `You do not have access to the door with ID ${puertaId}`;
    }

    if (PUERTAS[puertaId].hasOwnProperty(puertaAction)) {
        return PUERTAS[puertaId][puertaAction];
    } else {
        return `Invalid action for door with ID ${puertaId}. Please specify a valid action.`;
    }
}

const PUERTAS = {
    lab: {
        bloquear: "ID lab bloqueada",
        desbloquear: "ID lab desbloqueada",
        contenido: "<p>PUERTA lab</p>"
    },
    exit: {
        bloquear: "ID exit bloqueada",
        desbloquear: "ID exit desbloqueada",
        contenido: "<p>PUERTA exit</p>"
    },
    // Agrega más IDs y sus contenidos aquí:
    10550: {
        bloquear: "ID 10550 bloqueada",
        desbloquear: "ID 10550 desbloqueada",
        contenido: "<p>PUERTA 10550</p>"
    },
};