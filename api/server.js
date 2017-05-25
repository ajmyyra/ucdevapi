// Routes for /server

//   server.get('/server', virtserver.list);
exports.list = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/server', virtserver.create);
exports.create = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.get('/server/:uuid', virtserver.info);
exports.info = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.put('/server/:uuid', virtserver.modify);
exports.modify = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.del('/server/:uuid', virtserver.delete);
exports.delete = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/server/:uuid/start', virtserver.start);
exports.start = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/server/:uuid/stop', virtserver.stop);
exports.stop = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/server/:uuid/restart', virtserver.restart);
exports.restart = (req, res) => {
    res.statusCode = 501;
    res.end();
}
