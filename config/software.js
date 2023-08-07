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
};

function puerta() {
    const puertas = ["puerta1", "puerta2", "puerta3", "puerta4"];

    console.log("Lista de IDs de puertas:");
    console.log(puertas.join(", "));

    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question("Ingresa el ID de la puerta que deseas bloquear o desbloquear: ", puertaId => {
        if (!puertas.includes(puertaId)) {
            console.log("ID de puerta inválido");
            readline.close();
            return;
        }

        readline.question("¿Quieres bloquear o desbloquear la puerta? (bloquear/desbloquear): ", opcion => {
            if (opcion !== "bloquear" && opcion !== "desbloquear") {
                console.log("Opción inválida");
                readline.close();
                return;
            }

            readline.question("Ingresa la contraseña: ", contraseña => {
                if (contraseña === "tu_contraseña_comun") {
                    const estado = opcion === "bloquear" ? "bloqueada" : "desbloqueada";
                    console.log(`ID ${puertaId} ${estado}`);
                } else {
                    console.log("Contraseña incorrecta, acceso denegado");
                }

                readline.close();
            });
        });
    });
}
