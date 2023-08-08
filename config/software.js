const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CAMERAS = {
    34: function() {
        return "<p>Video CAM-34</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam1.jpg' class='glitch'>";
    },
    156: function() {
        return "<p>Video CAM-156</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam2.jpg' class='glitch'>";
    },
    888: function() {
        return "<p>Video CAM-888</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam3.jpg' class='glitch'>";
    },
    1059: function() {
        return "<p>Video CAM-1059</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam5.jpg' class='glitch'>";
    },
    3660: function() {
        return "<p>Video CAM-3660</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam6.jpg' class='glitch'>";
    },
    5112: function() {
        return "<p>Malfuncionamiento detectado</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/camBroken.jpg' class='glitch'>";
    },
    "g11_lab": function() {
        return "<p>Video G11_Lab</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam8.jpg' class='glitch'>";
    },
    10218: function() {
        return "<p>Video CAM-10218</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam7.jpg' class='glitch'>";
    },
    46035: function() {
        return "<p>Video CAM-46035</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam9.jpg' class='glitch'>";
    },
    46038: function() {
        return "<p>Video CAM-46038</p><p>Camara IDs: 34 156 888 1059 3660 5112 8556 10218 46035 46038</p><img src='config/cam10.jpg' class='glitch'>";
    },
    "xxxx": function() {
        return "<p>Imagen Desconocida</p><p>Fallo critico en la transmisión</p><img src='config/cam4.jpg' class='glitch'>";
};

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

function camara(args) {
    if (args.length === 0) {
        return [
            "<p>Se necesita una ID válida: <code>camara $id</code></p>",
            `Tienes acceso a las siguientes cámaras: ${Object.keys(CAMERAS).join(" ")}`
        ];
    }
    const camaraId = args[0];
    const camaraDweet = CAMERAS[camaraId];
    if (!camaraDweet) {
        return `No tienes acceso a la cámara con la ID ${camaraId}`;
    }
    return camaraDweet();
}

function puerta(args) {
    if (args.length === 0) {
        const puertasList = Object.keys(PUERTAS).join("\n");
        return [
            "<p>Debe proporcionar un ID: <code>puerta $id</code></p>",
            `Actualmente tienes acceso a las siguientes puertas:\n${puertasList}`
        ];
    }

    const puertaId = args[0];
    const puertaDweet = PUERTAS[puertaId];
    if (!puertaDweet) {
        return `No tienes acceso a la puerta con ID ${puertaId}`;
    }

    rl.question(`Escribe "bloquear" para bloquear la puerta ${puertaId} o "desbloquear" para desbloquearla: `, (answer) => {
        if (answer === 'bloquear') {
            console.log(`Puerta ${puertaId} bloqueada`);
        } else if (answer === 'desbloquear') {
            console.log(`Puerta ${puertaId} desbloqueada`);
        } else {
            console.log('Respuesta inválida. No se realizó ninguna acción.');
        }
        rl.close();
    });
}

// Ejemplo de uso
camara([34]); // Llamada a la función camara con el ID de la cámara
puerta([1]); // Llamada a la función puerta con el ID de la puerta