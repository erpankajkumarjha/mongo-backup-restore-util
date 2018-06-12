'use strict';
var http = require('http');
var config = require('./config/configuration');

/*
 * MongoDB BackUp
 */
var backup = require('./lib/mongodb-backup');
http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/x-tar' // force header for tar download
  });
  backup({
    uri: 'mongodb://'+ config.mongo.username +':'+ config.mongo.password + '@'+ config.mongo.host +':'+ config.mongo.port +'/'+ config.mongo.database_name, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.sovantis.com:<dbport>/<dbdatabase>
    root: __dirname+config.mongo.backup_dir+'/MONGO_'+ Date.now(), // write files into this dir
    // stream: res, // send stream into client response, will download a tar
    callback: function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Mongo Database Backup: Finish');
            return;
        }
    }
  });


/*
    * MongoDB Restore
*/
var restore = require('./lib/mongodb-restore');

  restore({
    uri: 'mongodb://'+ config.mongo.username +':'+ config.mongo.password + '@'+ config.mongo.host +':'+ config.mongo.port +'/'+ config.mongo.database_name,   // mongodb://<dbuser>:<dbpassword>@<dbdomain>.sovantis.com:<dbport>/<dbdatabase>
    //root: __dirname + '/dbName',  // read backup(s) file(s) from this dir
    // dropCollections: [ 'login' ], // drop this collections before restore
    drop: true, // drop entire database before restore backup
    root: __dirname+config.mongo.restore_dir,
    callback: function(err) {
        if (err) {
            console.error(err);
        } else {
          console.log('Mongo Database Restore: Finish');
          return;
        }
    }
  });


}).listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
