module.exports = {
    development: {
      client: 'mysql',
      connection: {
        host: 'localhost',
        user: 'root',
        password: 'new_password',
        database: 'chat'
      },
      migrations: {
        directory: __dirname + '/db/migrations'
      },
      seeds: {
        directory: __dirname + '/db/seeds'
      }
    },
  
    production: {
      client: 'mysql',
      connection: process.env.DATABASE_URL,
      migrations: {
        directory: __dirname + '/db/migrations'
      },
      seeds: {
        directory: __dirname + '/db/seeds'
      }
    }
  };
  