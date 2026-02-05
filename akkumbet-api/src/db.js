import mariadb from 'mariadb';

export const db = mariadb.createPool({
    host: 'localhost',
    user: 'akkumbet_user',
    password: 'password',
    database: 'akkumbet',
    connectionLimit: 5
});