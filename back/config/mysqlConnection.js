var mysql = require('mysql2');
const webServerConfig = require('./webConfig.js');

var con = mysql.createConnection({
    host     : webServerConfig.db_host,
    user     : webServerConfig.user_db,
    password : webServerConfig.password_db,
    database : webServerConfig.database,
    port     : webServerConfig.db_port 
});


con.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    console.log(err)
    return;
  }
   console.log('connected as id ' + con.threadId);
   });

module.exports = con;