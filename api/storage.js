// Routes for /storage
var fs = require('fs');
import models from '../models';
const uuid = require('uuid/v4');
const errors = JSON.parse(fs.readFileSync('api/errors.json', 'utf8'));

//   server.get('/storage', storage.list);
//   server.get('/storage/public', storage.list);
//   server.get('/storage/private', storage.list);
//   server.get('/storage/normal', storage.list);
//   server.get('/storage/backup', storage.list);
//   server.get('/storage/cdrom', storage.list);
//   server.get('/storage/template', storage.list);
//   server.get('/storage/favorite', storage.list);
exports.list = (req, res) => {
    req.log.info(req.params); //debug
    res.statusCode = 501;
    res.end();
}

//   server.post('/storage', storage.create);
exports.create = (req, res) => {
    var newstorage = models.storage_device.build(req.params.storage);
    newstorage.uuid = uuid();
    newstorage.validate()
    .then(() => {
        newstorage.save()
        .then((stor) => {
            res.statusCode = 201;
            var response = {};
            response.storage = {};
            response.storage.size = stor.size;
            response.storage.tier = stor.tier;
            response.storage.title = stor.title;
            response.storage.zone = stor.zone;
            // TODO backup_rule when implemented
            res.json(response);
        })
        .catch((err) => {
            req.log.error('Error when creating storage', err);
            res.statusCode = 500;
            res.end();
        });
    })
    .catch((valerr) => {
        const reason = valerr.errors[0].path;
        res.statusCode = 400;
        var errorresp = {};

        switch (reason) {
            case 'size':
                errorresp.error = errors['SIZE_INVALID'];
                break;
            case 'title':
                errorresp.error = errors['TITLE_INVALID'];
                break;
            case 'tier':
                errorresp.error = errors['TIER_INVALID'];
                break;
            case 'zone':
                errorresp.error = errors['ZONE_INVALID'];
                break;
            default:
                errorobj.error_code = "UNKNOWN_ERROR";
                req.log.debug('Unknown validation error:', valerr.errors[0]);
                break;
        }

        res.json(errorresp);
    })
    
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