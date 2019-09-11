const Redshift = require('node-redshift');
const { redshiftClient } = require('./config');
console.log(redshiftClient)
var bdmsdw = new Redshift(redshiftClient);
 
module.exports = bdmsdw;

