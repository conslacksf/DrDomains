const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    redshiftClient: {
        user: process.env.REDSHIFT_USER ,
        database: process.env.REDSHIFT_DATABASE ,
        password: process.env.REDSHIFT_PASSWORD ,
        port: process.env.REDSHIFT_PORT ,
        host: process.env.REDSHIFT_HOST ,
        ssl: process.env.REDSHIFT_SSL
    }
  };