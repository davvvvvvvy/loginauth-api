CREATE DATABASE login_api;

CREATE TABLE IF NOT EXISTS users_data (
    id       VARCHAR(255)    NOT NULL    PRIMARY KEY,
    email    VARCHAR(255)    NOT NULL,
    pass     VARCHAR(255)    NOT NULL,
    token    VARCHAR(255)    NOT NULL
)ENGINE=INNODB;