import models from '../models';
import restify from 'restify';
import bunyan from 'bunyan';
import os from 'os';

const log = bunyan.createLogger({ 
  name: 'ucdevapi', 
  level: process.env.production ? 'info' : 'debug' 
});

var ipaddr = require('./ipaddr');
var misc = require('./misc');
var virtserver = require('./server');
var storage = require('./storage');

export function startServer() {
  const server = restify.createServer({
    "name": "UpCloud Dev API",
    "log": log
  });
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.bodyParser({ mapParams: true }));
  server.use(restify.plugins.queryParser({ mapParams: true }));
  server.use(restify.plugins.authorizationParser());

  server.pre((req, res, next) => {
    req.log.info({req: req}, 'start');
    return next();
  })

  server.post('/register', (req, res, next) => {
    if (!req.params.username || !req.params.password || !req.params.email) {
      req.log.error("Error in registering user, username or password missing ");
      res.statusCode = 400;
      res.end(JSON.stringify('{ success: false, message: "Error in registration. Username, password or email not provided." }'));
    }
    
    var newuser = models.user.build(req.params);
    const userpwd = newuser.generatePassword(req.params.password);
    newuser.password = userpwd;

    models.user.findAll({
      where: { username: req.params.username }})
      .then((user) => {
        if (!user || user.length < 1) {
          newuser.save()
          .then ((createduser) => {
            req.log.info(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "User", createduser.username, "created!");
            res.statusCode = 201;
            res.end(JSON.stringify('{ success: true, message: "Registration successful." }'));
          })
          .catch ((error) => {
            req.log.error("Error in registering user " + req.params.username + ": " + error);
            res.statusCode = 500;
            var status;
            status.success = false;
            status.message = "Error in registration. Please try again later.";
            res.json(status);
          });
        } 
        else {
          req.log.info("User " + req.params.username + " already exists.");
          res.statusCode = 409;
          var status = {};
          status.success = false;
          status.message = "Username is already taken. Try another.";
          res.json(status);
        }
      }).catch( (error) => {
        req.log.error("Error in user lookup for user " + req.params.username + ": " + error);
        res.statusCode = 500;
        res.end(JSON.stringify('{ success: false, message: "Error in registration. Please try again later." }'));
      });
  })

  server.use(function authenticate(req, res, next) {
    if (req.authorization.scheme === "Basic") {
      models.user.findOne({
        where: { username: req.authorization.basic.username } 
      }).then((user) => {
        if (req.authorization.basic.username === user.username && user.validPassword(req.authorization.basic.password, user.password)) {
          req.log.debug("Request accepted from user " + user.username);
          next();
        }
        else {
          throw new Error("Wrong password.");
        }
      }).catch((error) => {
        req.log.error("Auth failed for user " + req.authorization.basic.username + ": " + error);
        res.statusCode = 403;
        res.json(JSON.parse('{ "error" : { "error_code" : "AUTHENTICATION_FAILED", "error_message" : "Authentication failed using the given username and password." } }'));
      })
    }
    else {
      req.log.error("No authentication header provided.");
      res.statusCode = 401;
      res.json(JSON.parse('{ "error" : { "error_code" : "AUTHENTICATION_FAILED", "error_message" : "The use of this dev API requires authentication. Create your account at /register." } }'));
    }
    
  })

  // Plan, zone and timezone actions

  server.get('/plan', misc.plans);
  server.get('/zone', misc.zones);
  server.get('/timezone', misc.timezones);

  // Server actions
  server.get('/server_size', virtserver.serversizes);
  server.get('/server', virtserver.list);
  server.post('/server', virtserver.create);
  server.get('/server/:uuid', virtserver.info);
  server.put('/server/:uuid', virtserver.modify);
  server.del('/server/:uuid', virtserver.delete);
  server.post('/server/:uuid/start', virtserver.start);
  server.post('/server/:uuid/stop', virtserver.stop);
  server.post('/server/:uuid/restart', virtserver.restart);
  server.post('/server/:uuid/storage/attach', storage.attach);
  server.post('/server/:uuid/storage/detach', storage.detach);
  server.post('/server/:uuid/cdrom/load', storage.loadcdrom);
  server.post('/server/:uuid/cdrom/eject', storage.ejectcdrom);


  // Storage actions
  server.get('/storage', storage.list);
  server.get('/storage/public', storage.list);
  server.get('/storage/private', storage.list);
  server.get('/storage/normal', storage.list);
  server.get('/storage/backup', storage.list);
  server.get('/storage/cdrom', storage.list);
  server.get('/storage/template', storage.list);
  server.get('/storage/favorite', storage.list);
  server.post('/storage', storage.create);
  server.get('/storage/:uuid', storage.info);
  server.put('/storage/:uuid', storage.modify);
  server.del('/storage/:uuid', storage.delete);
  server.post('/storage/:uuid/clone', storage.clone);
  server.post('/storage/:uuid/templatize', storage.templatize);
  server.post('/storage/:uuid/backup', storage.createbackup);
  server.post('/storage/:uuid/restore', storage.restorebackup);
  server.post('/storage/:uuid/favorite', storage.addfavorite);
  server.del('/storage/:uuid/favorite', storage.delfavorite);

  // IP address actions
  server.get('/ip_address', ipaddr.list);
  server.post('/ip_address', ipaddr.allocate);
  server.get('/ip_address/:ip', ipaddr.info);
  server.put('/ip_address/:ip', ipaddr.modify);
  server.del('/ip_address/:ip', ipaddr.delete);

  // TODO firewall

  server.listen( process.env.PORT || 8080, process.env.IP || "0.0.0.0", () =>
    log.info( '%s server listening at %s', server.name, server.url )
  )

}