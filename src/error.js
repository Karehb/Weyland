/* eslint no-unused-vars: 0 */

class CommandNotFoundError extends Error {
    constructor( command ) {
        super();
        this.message = `${ command }: comando no encontrado`;
    }
}

class InvalidCommandParameter extends Error {
    constructor( command ) {
        super();
        this.message = `Parametros invalidos en el comando ${ command }`;
    }
}

class AddressNotFoundError extends Error {
    constructor( address ) {
        super();
        this.message = `Error : la dirección ${ address } no se encuentra`;
    }
}

class AddressIsEmptyError extends Error {
    constructor() {
        super();
        this.message = "Error: Necesitas especificar una dirección";
    }
}

class UsernameIsEmptyError extends Error {
    constructor() {
        super();
        this.message = "Nombre de usuario vacio";
    }
}

class InvalidCredsSyntaxError extends Error {
    constructor() {
        super();
        this.message = "Sintaxis incorrecta: inserta un nombre de usuario o usuario:contraseña";
    }
}

class InvalidPasswordError extends Error {
    constructor( userName ) {
        super();
        this.message = `Contrañesa incorrecta para ${ userName }`;
    }
}

class MailServerIsEmptyError extends Error {
    constructor() {
        super();
        this.message = "No hay nuevos correos registrados";
    }
}

class InvalidMessageKeyError extends Error {
    constructor() {
        super();
        this.message = "Número de mensaje incorrecto.";
    }
}

class AlreadyOnServerError extends Error {
    constructor( serverAddress ) {
        super();
        this.message = `Ya estas en ${ serverAddress }`;
    }
}

class UnknownUserError extends Error {
    constructor( userName ) {
        super();
        this.message = `Usuario desconocido ${ userName }`;
    }
}

class ServerRequireUsernameError extends Error {
    constructor( serverAddress ) {
        super();
        this.message = `El servidor necesita un nombre de usuario para acceder: ssh username@${ serverAddress }`;
    }
}

class JsonFetchParseError extends Error {
    constructor( message ) {
        super();
        this.message = message;
    }
}
