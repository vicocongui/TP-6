CREATE TABLE
    Cuenta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL,
        contrasenia TEXT NOT NULL,
        nombreWeb TEXT NOT NULL
    );

INSERT INTO
    Cuenta (usuario, contrasenia, nombreWeb)
VALUES
    ("Vico", "pepeespiola", "Google.com");

SELECT
    *
FROM
    Cuenta;
    