// Global scope variables
let serverDatabase = {};
let userDatabase = {};
let userList = [];
let mailList = [];
let cmdLine_;
let output_;

function debugObject( obj ) {
    for ( const property in obj ) {
        console.log( `${ property }: ${ JSON.stringify( obj[ property ] ) }` );
        output( `${ property }: ${ JSON.stringify( obj[ property ] ) }` );
    }
}

/**
 * Set Header and Prompt informations.
 *
 * This function is useful to avoid code repetition.
 *
 * @param {String} msg A message to be showed when done
 */
function setHeader( msg = " " ) {
    // Setting correct header icon and terminal name
    const date = new Date();
    if ( serverDatabase.year ) {
        date.setYear( serverDatabase.year );
    }
    const promptText = `[${ userDatabase.userName }@${ serverDatabase.terminalID }] # `;

    const dateStr = `${ date.getDate() }/${ ( 1 + date.getMonth() ).toString().padStart( 2, "0" ) }/${ 2056 + date.getYear() }`;
    const header = `
    <img align="left" src="config/network/${ serverDatabase.serverAddress }/${ serverDatabase.iconName }" width="400" height="225" style="padding: 0px 0px 0px 0px">
    <h1 style="letter-spacing: 4px">${ serverDatabase.serverName }</h1>
    <p class='glow' style='font-size: 1em'>⚠ ALERTA situación excepcional activada ⚠</p>
    <p>"Todo el personal debe dirigirse a los almacenes del sector B2 inmediatamente"</p>
    <p>Esto no es un simulacro</p>
    <p>Alan P. Clarens, Administrador colonial.</p>
    <p>Conectado a: ${ serverDatabase.serverAddress } ( ${ dateStr } ) </p>
    <p>Escribe "help" para más información</p>
    `;
    // Clear content:
    output_.innerHTML = "";
    cmdLine_.value = "";
    if ( term ) {
        term.loadHistoryFromLocalStorage( serverDatabase.initialHistory );
    }
    output( [ header, msg ] );
    $( ".prompt" ).html( promptText );
}

/**
 * Cross-browser impl to get document's height.
 *
 * This function is necessary to auto-scroll to the end of page after each terminal command.
 */
function getDocHeight_() {
    const doc = document;
    return Math.max(
        Math.max( doc.body.scrollHeight, doc.documentElement.scrollHeight ),
        Math.max( doc.body.offsetHeight, doc.documentElement.offsetHeight ),
        Math.max( doc.body.clientHeight, doc.documentElement.clientHeight )
   );
}

/**
 * Scroll to bottom and clear the input value for a new line.
 */
function newLine() {
    window.scrollTo( 0, getDocHeight_() );
    cmdLine_.value = ""; // Clear/setup line for next input.
}

/**
 * Display content as terminal output.
 *
 * @param {String} data The string to be returned as a print in terminal
 * @param {Array} data The array to be returned as a print in terminal
 */
function output( data ) {
    return new Promise( ( resolve ) => {
        let delayed = 0;

        if ( data && data.constructor === Object ) {
            delayed = data.delayed;
            data = data.text;
        }

        if ( data && data.constructor === Array ) {
            if ( delayed && data.length > 0 ) {
                outputLinesWithDelay( data, delayed, () => resolve( newLine() ) );
                return;
            }
            $.each( data, ( _, value ) => {
                printLine( value );
            } );
        } else if ( data ) {
            printLine( data );
        }
        resolve( newLine() );
    } );
}

/**
 * Print lines of content with some delay between them.
 *
 * @param {Array} lines list of content to display
 * @param {Number} delayed delay in milliseconds between which to display lines
 */
function outputLinesWithDelay( lines, delayed, resolve ) {
    const line = lines.shift();
    printLine( line );
    if ( lines.length > 0 ) {
        setTimeout( outputLinesWithDelay, delayed, lines, resolve, delayed );
    } else if ( resolve ) {
        resolve();
    }
}

/**
 * Display some text, or an image, on a new line.
 *
 * @param {String} data text to display
 * @param {Object} data information on what to display
 */
function printLine( data ) {
    if ( !data.startsWith( "<" ) ) {
        data = `<p>${ data }</p>`;
    }
    output_.insertAdjacentHTML( "beforeEnd", data );
    const elemInserted = output_.lastChild;
    if ( elemInserted.classList ) { // can be undefined if elemInserted is just Text, not an HTMLElement
        if ( elemInserted.classList.contains( "glitch" ) ) {
            glitchImage( elemInserted );
        }
        if ( elemInserted.classList.contains( "particle" ) ) {
            particleImage( elemInserted );
        }
        if ( elemInserted.classList.contains( "hack-reveal" ) ) {
            hackRevealText( elemInserted, elemInserted.dataset );
        }
    }
    const text = elemInserted.textContent.trim();
    if ( elemInserted.dataset && text ) { // can be undefined if elemInserted is just Text, not an HTMLElement
        elemInserted.dataset.text = text; // needed for "desync" effect
    }
}

/**
 * The Kernel will handle all software (system calls).
 *
 * The app name will be checked first if it exists as a system 'native' command.
 * If it doesn't, it will look for a custom software defined at software.json.
 *
 * You can define commands with filetypes by naming the function as command_type.
 * The kernel will handle every `.` as a `_` when looking for the correct software.
 * i.e. the `bar_exe` function needs to be called as the `bar.exe` command in the Terminal.
 *
 * @param {String} app The app name
 * @param {Array} args A list of Strings as args
 */
function kernel( app, args ) {
    const systemApp = system[ app ] || system[ app.replace( ".", "_" ) ];
    if ( systemApp ) {
        return systemApp( args );
    }
    return software( app, args );
}

/**
 * Attempts to connect to a server.
 * If successful, sets global variables serverDatabase / userDatabase / userList / mailList
 */
kernel.connectToServer = function connectToServer( serverAddress, userName, passwd ) {
    return new Promise( ( resolve, reject ) => {
        if ( serverAddress === serverDatabase.serverAddress ) {
            reject( new AlreadyOnServerError( serverAddress ) );
            return;
        }
        $.get( `config/network/${ serverAddress }/manifest.json`, ( serverInfo ) => {
            if ( !userName && serverInfo.defaultUser ) {
                serverDatabase = serverInfo;
                userDatabase = serverInfo.defaultUser;
                $.get( `config/network/${ serverInfo.serverAddress }/userlist.json`, ( users ) => {
                    userList = users;
                } );
                $.get( `config/network/${ serverInfo.serverAddress }/mailserver.json`, ( mails ) => {
                    mailList = mails;
                } );
                setHeader( "Conexión establecida" );
                resolve();
            } else if ( userName ) {
                $.get( `config/network/${ serverInfo.serverAddress }/userlist.json`, ( users ) => {
                    const matchingUser = users.find( ( user ) => user.userId === userName );
                    if ( !matchingUser ) {
                        reject( new UnknownUserError( userName ) );
                        return;
                    }
                    if ( matchingUser.password && matchingUser.password !== passwd ) {
                        reject( new InvalidPasswordError( userName ) );
                        return;
                    }
                    serverDatabase = serverInfo;
                    userDatabase = matchingUser;
                    userList = users;
                    $.get( `config/network/${ serverInfo.serverAddress }/mailserver.json`, ( mails ) => {
                        mailList = mails;
                    } );
                    setHeader( "Conexión establecida" );
                    resolve();
                } ).fail( () => {
                    reject( new AddressNotFoundError( serverAddress ) );
                } );
            } else {
                reject( new ServerRequireUsernameError( serverAddress ) );
            }
        } ).fail( () => {
            reject( new AddressNotFoundError( serverAddress ) );
        } );
    } );
};

/**
 * This will initialize the kernel function.
 *
 * It will define the help functions, set some important variables and connect the databases.
 *
 * @param {Object} cmdLineContainer The Input.cmdline right of the div.prompt
 * @param {Object} outputContainer The output element inside the div#container
 */
kernel.init = function init( cmdLineContainer, outputContainer ) {
    return new Promise( ( resolve, reject ) => {
        cmdLine_ = document.querySelector( cmdLineContainer );
        output_ = document.querySelector( outputContainer );

        $.when(
            $.get( "config/software.json", ( softwareData ) => {
                softwareInfo = softwareData;
            } ),
            kernel.connectToServer( "localhost" )
        )
            .done( () => {
                resolve( true );
            } )
            .fail( ( err, msg, details ) => {
                console.error( err, msg, details );
                reject( new JsonFetchParseError( msg ) );
            } );
    } );
};

/**
 * Internal command functions.
 *
 * This is where the internal commands are located.
 * This should have every non-custom software command functions.
 */
system = {
    dumpdb() {
        return new Promise( () => {
            output( ":: serverDatabase - información del servidor conectado" );
            debugObject( serverDatabase );
            output( "----------" );
            output( ":: userDatabase - información del usuario conectado" );
            debugObject( userDatabase );
            output( "----------" );
            output( ":: userList - lista de usuarios registrados en el servidor" );
            debugObject( userList );
        } );
    },

/**
 *    whoami() {
 *        return new Promise( ( resolve ) => {
 *            resolve(
 *                `${ serverDatabase.serverAddress }/${ userDatabase.userId }`
 *            );
 *        } );
 *    },
 */

    clear() {
        return new Promise( ( resolve ) => {
            setHeader();
            resolve( false );
        } );
    },

/**
 *    date() {
 *        return new Promise( ( resolve ) => {
 *            const date = new Date();
 *            if ( serverDatabase.year ) {
 *                date.setYear( serverDatabase.year );
 *            }
 *            resolve( String( date ) );
 *        } );
 *    },
 */

/**
 *    echo( args ) {
 *        return new Promise( ( resolve ) => {
 *            resolve( args.join( " " ) );
 *        } );
 *    },
 */

    help( args ) {
        return new Promise( ( resolve ) => {
            const programs = allowedSoftwares();
            if ( args.length === 0 ) {
                const commands = Object.keys( system ).filter( ( cmd ) => cmd !== "dumpdb" );
                Array.prototype.push.apply( commands, Object.keys( programs ).filter( ( pName ) => !programs[ pName ].secretCommand ) );
                commands.sort();
                resolve( [
                    "Puedes leer la ayuda de cada comando escribiendo: 'help nombreComando'",
                    "Lista de comandos útiles:",
                    `<div class="ls-files">${ commands.join( "<br>" ) }</div>`,
                    "Puedes navegar por el historial de comandos utilizados usando las teclas de flechas UP y DOWN.",
                    "La tecla TAB auto-completara los comandos."
                ] );
            } else if ( args[ 0 ] === "clear" ) {
                resolve( [ "escribe:", "> clear", "función:", "El comando >clear limpiara la pantalla de información pero no afectara al historial de inputs." ] );
            } else if ( args[ 0 ] === "date" ) {
                resolve( [ "escribe:", "> date", "función:", "El comando >date imprimira la fecha actual en la terminal." ] );
            } else if ( args[ 0 ] === "echo" ) {
                resolve( [ "escribe:", "> echo args", "función:", "El comando >echo imprimira args en la terminal." ] );
            } else if ( args[ 0 ] === "help" ) {
                resolve( [ "escribe:", "> help", "función:", "El mensaje 'help' por defecto. Mostrara algunos de los comandos disponibles en el servidor." ] );
            } else if ( args[ 0 ] === "login" ) {
                resolve( [ "escribe:", "> login usuario:contraseña", "función:", "El sistema se conectara a una cuenta de usuario, para ejecutar programas o leer mensajes asignados al usuario. Se necesita contraseña" ] );
            } else if ( args[ 0 ] === "mail" ) {
                resolve( [ "escribe:", "> mail", "función:", "Muestra el listado de mensajes del usuario conectado, para leerlos usa el comando >read." ] );
            } else if ( args[ 0 ] === "ping" ) {
                resolve( [ "escribe:", "> ping address", "función:", "El comando ping intentara alcanzar una dirección valida.", 
						     "Si el ping no devuelve una respuesta valida, la dirección podría ser incorrecta, no existir o no ser alcanzable de forma local." ] );
            } else if ( args[ 0 ] === "read" ) {
                resolve( [ "escribe:", "> read x", "función:", "Permite leer los mensajes del usuario usando el número del mail, para comprobar si tienes mails o sus números usa el comando >mail." ] );
            } else if ( args[ 0 ] === "ssh" ) {
                resolve( [
                    "escribe:",
                    "> ssh dirección",
                    "> ssh usuario@dirección",
                    "> ssh usuario:contraseña@dirección", "función:",
                    "Puedes conectarte a una dirección valida para acceder a un servidor especifico de internet.",
                    "Podrias necesitar especificar un usuario si el servidor no tiene un usuario por defecto.",
                    "Podrias necesitar especificar una contraseña si la cuenta de usuario esta protegida." ] );
            } else if ( args[ 0 ] === "whoami" ) {
                resolve( [ "escribe:", "> whoami", "función:", "Muestra el servidor al que estas actualmente conectado y el login con el que estas registrado." ] );
            } else if ( args[ 0 ] in softwareInfo ) {
                const customProgram = programs[ args[ 0 ] ];
                if ( customProgram.help ) {
                    resolve( [ "escribe:", `> ${ args[ 0 ] }`, "función:", customProgram.help ] );
                }
            } else if ( args[ 0 ] in system && args[ 0 ] !== "dumpdb" ) {
                console.error( `No se ha encontrado ayuda para el comando de sistema: ${ args[ 0 ] }` );
            } else {
                resolve( [ `Comando desconocido ${ args[ 0 ] }` ] );
            }
        } );
    },

    login( args ) {
        return new Promise( ( resolve, reject ) => {
            if ( !args ) {
                reject( new UsernameIsEmptyError() );
                return;
            }
            let userName = "";
            let passwd = "";
            try {
                [ userName, passwd ] = userPasswordFrom( args[ 0 ] );
            } catch ( error ) {
                reject( error );
                return;
            }
            if ( !userName ) {
                reject( new UsernameIsEmptyError() );
                return;
            }
            const matchingUser = userList.find( ( user ) => user.userId === userName );
            if ( !matchingUser ) {
                reject( new UnknownUserError() );
                return;
            }
            if ( matchingUser.password && matchingUser.password !== passwd ) {
                reject( new InvalidPasswordError( userName ) );
                return;
            }
            userDatabase = matchingUser;
            setHeader( "login establecio" );
            resolve();
        } );
    },

    logout() {
        return new Promise( () => {
            location.reload();
        } );
    },
/**
 *    exit() {
 *        return new Promise( () => {
 *            location.reload();
 *        } );
 *    },
 */
    mail() {
        return new Promise( ( resolve, reject ) => {
            const messageList = [];

            $.each( mailList, ( index, mail ) => {
                if ( mail.to.includes( userDatabase.userId ) ) {
                    messageList.push( `[${ index }] ${ mail.title }` );
                }
            } );

            if ( messageList === "" ) {
                reject( new MailServerIsEmptyError() );
                return;
            }

            resolve( messageList );
        } );
    },

    read( args ) {
        return new Promise( ( resolve, reject ) => {
            const message = [];

            let readOption = false;
            $.each( mailList, ( index, mail ) => {
                if ( mail.to.includes( userDatabase.userId ) && Number( args[ 0 ] ) === index ) {
                    readOption = true;
                    message.push( "---------------------------------------------" );
                    message.push( `De: ${ mail.from }` );
                    message.push( `Para: ${ userDatabase.userId }@${ serverDatabase.terminalID }` );
                    message.push( "---------------------------------------------" );

                    $.each( mail.body.split( "  " ), ( _, line ) => {
                        message.push( line );
                    } );
                }
            } );

            if ( !readOption ) {
                reject( new InvalidMessageKeyError() );
                return;
            }

            resolve( message );
        } );
    },

/**
 *    ping( args ) {
 *        return new Promise( ( resolve, reject ) => {
 *            if ( args === "" ) {
 *               reject( new AddressIsEmptyError() );
 *                return;
 *            }
 *
 *            $.get( `config/network/${ args }/manifest.json`, ( serverInfo ) => {
 *                resolve( `El servidor ${ serverInfo.serverAddress } (${ serverInfo.serverName }) no se puede acceder` );
 *            } )
 *                .fail( () => reject( new AddressNotFoundError( args ) ) );
 *        } );
 *    },
 */

/**
 *    telnet() {
 *        return new Promise( ( _, reject ) => {
 *            reject( new Error( "telnet es inseguro y esta obsoleto - usa ssh en su lugar" ) );
 *        } );
 *    },
 */

/**
 *    ssh( args ) {
 *        return new Promise( ( resolve, reject ) => {
 *            if ( args === "" ) {
 *                reject( new AddressIsEmptyError() );
 *                return;
 *            }
 *            let userName = "";
 *            let passwd = "";
 *            let serverAddress = args[ 0 ];
 *            if ( serverAddress.includes( "@" ) ) {
 *                const splitted = serverAddress.split( "@" );
 *                if ( splitted.length !== 2 ) {
 *                    reject( new InvalidCommandParameter( "ssh" ) );
 *                    return;
 *                }
 *                serverAddress = splitted[ 1 ];
 *                try {
 *                    [ userName, passwd ] = userPasswordFrom( splitted[ 0 ] );
 *                } catch ( error ) {
 *                    reject( error );
 *                    return;
 *                }
 *            }
 *            kernel.connectToServer( serverAddress, userName, passwd ).then( resolve ).catch( reject );
 *        } );
 *    }
 */

};

function userPasswordFrom( creds ) {
    if ( !creds.includes( ":" ) ) {
        return [ creds, "" ];
    }
    const splitted = creds.split( ":" );
    if ( splitted.length !== 2 ) {
        throw new InvalidCredsSyntaxError();
    }
    return splitted;
}

/**
 * The custom software caller.
 *
 * This will look for custom softwares from `software.json`.
 *
 * @param {String} progName The software name
 * @param {String} args Args to be handled if any
 */
function software( progName, args ) {
    return new Promise( ( resolve, reject ) => {
        const program = allowedSoftwares()[ progName ];
        if ( program ) {
            if ( program.clear ) {
                system.clear().then( runSoftware( progName, program, args ).then( resolve, reject ) );
            } else {
                runSoftware( progName, program, args ).then( resolve, reject );
            }
        } else {
            reject( new CommandNotFoundError( progName ) );
        }
    } );
}

/**
 * Run the specified program
 *
 * @param {String} progName The software name
 * @param {Object} program Command definition from sofwtare.json
 * @param {String} args Args to be handled if any
 */
function runSoftware( progName, program, args ) {
    return new Promise( ( resolve ) => {
        let msg;
        if ( program.message ) {
            msg = { text: program.message, delayed: program.delayed };
        } else {
            msg = window[ progName ]( args );
            if ( msg.constructor === Object ) {
                if ( !msg.onInput ) {
                    throw new Error( "An onInput callback must be defined!" );
                }
                if ( msg.message ) {
                    output( msg.message );
                }
                readPrompt( msg.prompt || ">" ).then( ( input ) => msg.onInput( input ) )
                    .then( ( finalMsg ) => resolve( finalMsg ) );
                return;
            }
        }
        resolve( msg );
    } );
}

/**
 * Read user input
 *
 * @param {String} promptText The text prefix to display before the <input> prompt
 */
function readPrompt( promptText ) {
    return new Promise( ( resolve ) => {
        const prevPromptText = $( "#input-line .prompt" ).text();
        $( "#input-line .prompt" ).text( promptText );
        term.removeCmdLineListeners();
        cmdLine_.addEventListener( "keydown", promptSubmitted );
        function promptSubmitted( e ) {
            if ( e.keyCode === 13 ) {
                cmdLine_.removeEventListener( "keydown", promptSubmitted );
                term.addCmdLineListeners();
                $( "#input-line .prompt" ).text( prevPromptText );
                resolve( this.value.trim() );
            }
        }
    } );
}

/**
 * List only details about programs the current user has access on the current server.
 */
function allowedSoftwares() {
    const softwares = {};
    for ( const app in softwareInfo ) {
        const program = softwareInfo[ app ];
        if (
            ( !program.location || program.location.includes( serverDatabase.serverAddress ) ) &&
            ( !program.protection || program.protection.includes( userDatabase.userId ) )
        ) {
            softwares[ app ] = program;
        }
    }
    return softwares;
}

/*
 * Wrapper to easily define sofwtare programs that act as dweets.
 * Reference code: https://github.com/lionleaf/dwitter/blob/master/dwitter/templates/dweet/dweet.html#L250
 * Notable difference with https://dwitter.net : default canvas dimensions are width=200 & height=200
 * There are usage examples in config/software.js
 */
const FPS = 60;
const epsilon = 1.5;
/* eslint-disable no-unused-vars */
const C = Math.cos;
const S = Math.sin;
const T = Math.tan;

function dweet( u, width, height ) {
    width = width || 200;
    height = height || 200;
    const id = Date.now().toString( 36 );
    let frame = 0;
    let nextFrameMs = 0;
    function loop( frameTime ) {
        frameTime = frameTime || 0;
        const c = document.getElementById( id );
        if ( !c ) {
            return;
        }
        requestAnimationFrame( loop );
        if ( frameTime < nextFrameMs - epsilon ) {
            return; // Skip this cycle as we are animating too quickly.
        }
        nextFrameMs = Math.max( nextFrameMs + 1000 / FPS, frameTime );
        let time = frame / FPS;
        if ( time * FPS | frame - 1 === 0 ) {
            time += 0.000001;
        }
        frame++;
        const x = c.getContext( "2d" );
        x.fillStyle = "white";
        x.strokeStyle = "white";
        x.beginPath();
        x.resetTransform();
        x.clearRect( 0, 0, width, height ); // clear canvas
        u( time, x, c );
    }
    setTimeout( loop, 50 ); // Small delay to let time for the canvas to be inserted
    return `<canvas id="${ id }" width="${ width }" height="${ height }">`;
}

function R( r, g, b, a ) {
    a = typeof a === "undefined" ? 1 : a;
    return `rgba(${ r | 0 },${ g | 0 },${ b | 0 },${ a })`;
}
