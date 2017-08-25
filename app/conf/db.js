module.exports = {
  postgresql: {
    user: 'postgres', //env var: PGUSER
    database: 'EPark', //env var: PGDATABASE
    password: '123', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 30, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  }
};
