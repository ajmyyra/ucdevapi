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

  server.post('/register', function(req, res, next) {
    var newuser = models.user.build(req.params);
    const userpwd = newuser.generateHash(req.params.password);
    newuser.password = userpwd;

    models.user.findAll({ // TODO promisify to make it shiny and nice.
      where: { username: req.params.username },
      logging: log.debug.bind(log) })
      .then( (user) => { // TODO why user exists when it doesn't
        if (!user) {
          newuser.save()
          .then ( (createduser) => {
            res.statusCode = 201;
            res.end(JSON.stringify('{ success: true, message: "Registration successful." }'));
          })
          .catch ( (error) => {
            log.error("Error in registering user " + req.params.username + ": " + error);
            res.statusCode =500;
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

  // TODO user authentication. Use model.user.validPassword(givenpwd) for validation.
  // TODO other API functionality. First everything will just return 501 Not Implemented.

  server.listen( process.env.PORT || 8080, process.env.IP || "0.0.0.0", () =>
    log.info( '%s server listening at %s', server.name, server.url )
  )
}