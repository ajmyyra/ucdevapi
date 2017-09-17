// Routes for /storage
var fs = require('fs');
import models from '../models';
const uuid = require('uuid/v4');
const errors = JSON.parse(fs.readFileSync('api/errors.json', 'utf8'));

const removeInternals = (storage, detailed) => {
    var pubStorage = {};
    pubStorage.access = storage.access;
    pubStorage.license = storage.license;
    pubStorage.size = storage.size;
    pubStorage.state = storage.state;
    pubStorage.tier = storage.tier;
    pubStorage.title = storage.title;
    pubStorage.type = storage.type;
    pubStorage.uuid = storage.uuid;
    pubStorage.zone = storage.zone;

    if (detailed) {
        pubStorage.servers = {};
        pubStorage.servers.server = [];
        // TODO populate server array from database
        // TODO pubStorage.backup_rule
    }
    
    return pubStorage;
}
exports.removeInternals = removeInternals;

//   server.get('/storage', storage.list);
//   server.get('/storage/public', storage.list);
//   server.get('/storage/private', storage.list);
//   server.get('/storage/normal', storage.list);
//   server.get('/storage/backup', storage.list);
//   server.get('/storage/cdrom', storage.list);
//   server.get('/storage/template', storage.list);
//   server.get('/storage/favorite', storage.list);
exports.list = (req, res) => {

    var searchopts = {};
    searchopts.userAnnotationId = req.user.annotation_id;
    
    const urlparts = req.url.split('/');
    if (urlparts.length > 2) {
        switch(urlparts[2]) {
            case 'public':
                searchopts.access = 'public';
                break;
            case 'private':
                searchopts.access = 'private';
                break;
            case 'normal':
                searchopts.type = 'normal';
                break;
            case 'backup':
                searchopts.type = 'backup';
                break;
            case 'cdrom':
                searchopts.type = 'cdrom';
                break;
            case 'template':
                searchopts.type = 'template';
                break;
            case 'favorite':
                searchopts.favorite = true;
            default:
                break;
        }
    }

    models.storage_device.findAll({
        where: searchopts 
    }).then((storages) => {
        var storageresp = {};
        storageresp.storages = {};
        storageresp.storages.storage = [];

        storages.forEach((s) => {
            storageresp.storages.storage.push(removeInternals(s, false));
        });

        res.statusCode = 200;
        res.json(storageresp);

    }).catch((err) => {
        req.log.error('Error when fetching storages', err);
        res.statusCode = 500;
        res.end();
    })
    
}

//   server.post('/storage', storage.create);
exports.create = (req, res) => {
    var newstorage = models.storage_device.build(req.params.storage);
    newstorage.uuid = uuid();
    newstorage.userAnnotationId = req.user.annotation_id;
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
    }).catch((valerr) => {
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
                errorresp.error = errors['UNKNOWN_ERROR'];
                req.log.debug('Unknown validation error:', valerr.errors[0]);
                break;
        }

        res.json(errorresp);
    });
    
}

//   server.get('/storage/:uuid', storage.info);
exports.info = (req, res) => {
    models.storage_device.findOne({
        where: { 
            uuid: req.params.uuid,
            userAnnotationId: req.user.annotation_id
        }
    }).then((storage) => {
        if (!storage || storage.length < 1) {
            res.statusCode = 404;
            res.end();
        }
        else {
            res.statusCode = 200;
            res.json(removeInternals(storage, true));
        }     
    }).catch((err) => {
        req.log.error('Problem when fetching event:', err);
        res.statusCode = 500;
        res.end();
    });
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