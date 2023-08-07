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
    return camaraDweet();
}

const CAMERAS = {
    888: function() {
        return "<p>CAMARA DE SEGURIDAD 888</p><img src='config/colonia_blue.jpg' class='glitch'>";
    },
    10549: function() {
        return "<p>CAMARA DE SEGURIDAD 10549</p><img src='config/colonia_blue.jpg' class='glitch'>";
    },
}