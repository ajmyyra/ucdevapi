// Routes for /server
import fs from 'fs';
import models from '../../models';
const uuid = require('uuid/v4');
const errors = JSON.parse(fs.readFileSync('api/static/errors.json', 'utf8'));
const defaults = JSON.parse(fs.readFileSync('api/defaults.json', 'utf8'));

//   server.get('/server_size, virtserver.serversizes);
exports.serversizes = (req, res) => {
    var sizes = [];
    for (var cores = 1; cores <= defaults.max_cores; cores++) {
        for (var mem = 512; mem <= defaults.max_memory; mem += 512) {
            var sizeobj = {};
            sizeobj["core_number"] = cores;
            sizeobj["memory_amount"] = mem;

            sizes.push(sizeobj);
        }
    }

    var sizeresponse = {};
    sizeresponse['server_sizes'] = {};
    sizeresponse['server_sizes']['server_size'] = sizes;

    res.statusCode = 200;
    res.json(sizeresponse).end();
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
