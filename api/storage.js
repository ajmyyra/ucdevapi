// Routes for /storage

//   server.get('/storage', storage.list);
//   server.get('/storage/public', storage.list);
//   server.get('/storage/private', storage.list);
//   server.get('/storage/normal', storage.list);
//   server.get('/storage/backup', storage.list);
//   server.get('/storage/cdrom', storage.list);
//   server.get('/storage/template', storage.list);
//   server.get('/storage/favorite', storage.list);
exports.list = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/storage', storage.create);
exports.create = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.get('/storage/:uuid', storage.info);
exports.info = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.put('/storage/:uuid', storage.modify);
exports.modify = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.del('/storage/:uuid', storage.delete);
exports.delete = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/storage/:uuid/clone', storage.clone);
exports.clone = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/storage/:uuid/templatize', storage.templatize);
exports.templatize = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/storage/:uuid/backup', storage.createbackup);
exports.createbackup = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/storage/:uuid/restore', storage.restorebackup);
exports.restorebackup = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/storage/:uuid/favorite', storage.addfavorite);
exports.addfavorite = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.del('/storage/:uuid/favorite', storage.delfavorite);
exports.delfavorite = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/server/:uuid/storage/attach', storage.attach);
exports.attach = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/server/:uuid/storage/detach', storage.detach);
exports.detach = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/server/:uuid/cdrom/load', storage.loadcdrom);
exports.loadcdrom = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/server/:uuid/cdrom/eject', storage.ejectcdrom);
exports.ejectcdrom = (req, res) => {
    res.statusCode = 501;
    res.end();
}