-- Creación de la tabla SitioWeb
CREATE TABLE IF NOT EXISTS SitioWeb (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- Creación de la tabla Cuenta
CREATE TABLE IF NOT EXISTS Cuenta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sitioId INTEGER NOT NULL,
    usuario TEXT NOT NULL,
    contrasenia TEXT NOT NULL,
    FOREIGN KEY (sitioId) REFERENCES SitioWeb(id)
);
