import models from '../models'
import restify from 'restify'
import bunyan from 'bunyan'
import os from 'os'

const log = bunyan.createLogger( { name: 'ucdevapi', level: 'DEBUG' } )

export function startServer() {
  const server = restify.createServer();
  server.use(restify.CORS());
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.bodyParser({ mapParams: true }));
  server.use(restify.authorizationParser());

  server.post('/register', function(req, res, next) {
    var newuser = models.user.build(req.params);
    const userpwd = newuser.generateHash(req.params.password);
    newuser.password = userpwd;

    models.user.findAll({ // TODO promisify correctly to make prettier
      where: { username: req.params.username },
      logging: log.debug.bind(log) })
      .then( (user) => {
        if (!user || user.length < 1) {
          newuser.save()
          .then ( (createduser) => {
            res.statusCode = 201;
            res.end(JSON.stringify('{ success: true, message: "Registration successful." }'));
          })
          .catch ( (error) => {
            log.error("Error in registering user " + req.params.username + ": " + error);
            res.statusCode = 500;
            res.end(JSON.stringify('{ success: false, message: "Error in registration. Please try again." }'));
          });
        } 
        else {
          log.info("User " + req.params.username + " already exists.");
          res.statusCode = 409;
          res.end(JSON.stringify('{ success: false, message: "Username is already taken. Try another." }'));
        }
      }).catch( (error) => {
        log.error("Error in user lookup for user " + req.params.username + ": " + error);
        res.statusCode = 500;
        res.end(JSON.stringify('{ success: false, message: "Error in registration. Please try again." }'));
      });
  })

  server.use(function authenticate(req, res, next) {
    if (req.authorization.scheme === "Basic") {
      models.user.findOne({
        where: { username: req.authorization.basic.username },
        logging: log.debug.bind(log) })
        .then( (user) => {
          if (req.authorization.basic.username === user.username && user.validPassword(req.authorization.basic.password)) {
            log.debug("Request accepted from user " + user.username);
            next();
          }
          else {
            throw new Error("Wrong password.");
          }
        }).catch( (error) => {
          log.error("Auth failed for user " + req.authorization.basic.username + ": " + error);
          res.statusCode = 403;
          res.json(JSON.parse('{ "error" : { "error_code" : "AUTHENTICATION_FAILED", "error_message" : "Authentication failed using the given username and password." } }'));
        })
    }
    else {
      log.error("No authentication header provided.");
      res.statusCode = 401;
      res.json(JSON.parse('{ "error" : { "error_code" : "AUTHENTICATION_FAILED", "error_message" : "The use of this dev API requires authentication. Create your account at /register." } }'));
    }
    
  })

  // test route for debug
  server.post('/foo', function(req, res, next) {
    console.log("Reached /foo");
    console.log(req.params);
  })
  // TODO other API functionality. First everything will just return 501 Not Implemented.

  server.listen( process.env.PORT || 8080, process.env.IP || "0.0.0.0", () =>
    log.info( '%s server listening at %s', server.name, server.url )
  )
}