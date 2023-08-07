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
            `You currently have access to the following puertas: ${Object.keys(PUERTAS).join(" ")}`
        ];
    }
    const puertaId = args[0];
    const puertaDweet = PUERTAS[puertaId];
    if (!puertaDweet) {
        return `You do not have access to the puerta with ID ${puertaId}`;
    }
    return puertaDweet();
}

const PUERTAS = {
    777: function() {
        return "<p>PUERTA DE SEGURIDAD 888</p>";
    },
    34908: function() {
        return "<p>PUERTA DE SEGURIDAD 10549</p>";
    },
};