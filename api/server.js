// Routes for /server
var fs = require('fs');
const defaults = JSON.parse(fs.readFileSync('api/defaults.json', 'utf8'));

//   server.get('/server_size, virtserver.serversizes);
exports.serversizes = (req, res) => {
    var sizes = new JSONArray();
    for (var cores = 1; cores <= defaults.max_cores; cores++) {
        for (var mem = 512; mem <= defaults.max_memory; mem += 512) {
            var sizeobj = new JSONObject();
            sizeobj.put("core_number", cores);
            sizeobj.put("memory_amount", mem);
            sizes.put(sizeobj);
        }
    }

    var sizeobj = new JSONObject();
    sizeobj.put("server_sizes", (new JSONObject).put("server_size", sizes));

    res.statusCode = 200;
    res.JSON(sizeobj);
}

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
