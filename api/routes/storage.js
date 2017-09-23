// Routes for /storage
import fs from 'fs';
import models from '../../models';
const uuid = require('uuid/v4');
const errors = JSON.parse(fs.readFileSync('api/static/errors.json', 'utf8'));
const defaults = JSON.parse(fs.readFileSync('api/defaults.json', 'utf8'));

const removeInternals = (storage, detailed) => {
    var pubStorage = {};
    pubStorage.access = storage.access;
    if (detailed) {
        pubStorage.backup_rule = "";
        pubStorage.backups = {};
        pubStorage.backups.backup = [];
        // TODO actual backup_rule and listing of backups
        pubStorage.servers = {};
        pubStorage.servers.server = [];
        // TODO populate server array from database
    }
    pubStorage.license = storage.license;
    pubStorage.size = storage.size;
    pubStorage.state = storage.state;
    pubStorage.tier = storage.tier;
    pubStorage.title = storage.title;
    pubStorage.type = storage.type;
    pubStorage.uuid = storage.uuid;
    pubStorage.zone = storage.zone;

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
        res.json(storageresp).end();

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
            // TODO actual backup_rule when implemented

            res.json(response).end();
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

        res.json(errorresp).end();
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
            var error = {};
            error.error = errors['STORAGE_NOT_FOUND'];
            res.statusCode = 404;
            res.json(error).end();
        }
        else {
            res.statusCode = 200;
            res.json(removeInternals(storage, true)).end();
        }     
    }).catch((err) => {
        req.log.error('Problem when fetching event:', err);
        res.statusCode = 500;
        res.end();
    });
}

//   server.put('/storage/:uuid', storage.modify);
exports.modify = (req, res) => {
    models.storage_device.findOne({
        where: { 
            uuid: req.params.uuid,
            userAnnotationId: req.user.annotation_id
        }
    }).then((storage) => {
        if (!storage || storage.length < 1) {
            var error = {};
            error.error = errors['STORAGE_NOT_FOUND'];
            res.statusCode = 404;
            res.json(error).end();
        }
        else {
            var error = {};
            if (storage.type != 'normal') {
                error.error = errors['STORAGE_TYPE_ILLEGAL'];
                res.statusCode = 409;
                res.json(error).end();
            }
            if (storage.state != 'online') {
                error.error = errors['STORAGE_STATE_ILLEGAL'];
                res.statusCode = 409;
                res.json(error).end();
            }
            // TODO check if attached to a running server (or just to a server? check!)
            if (!req.params.storage) {
                error.error = errors['STORAGE_INVALID'];
                res.statusCode = 400;
                res.json(error).end();
            }

            var changes = {};
            if (req.params.storage.size) {
                if (req.params.storage.size > defaults.max_storage_size || req.params.storage.size < storage.size) {
                    error.error = errors['SIZE_INVALID'];
                    res.statusCode = 400;
                    res.json(error).end();
                }
                else {
                    changes.size = req.params.storage.size;
                }
            }
            if (req.params.storage.title) {
                if (req.params.storage.title.length > defaults.max_storage_name_length) {
                    error.error = errors['TITLE_INVALID'];
                    res.statusCode = 400;
                    res.json(error).end();
                }
                else {
                    changes.title = req.params.storage.title;
                }
            }
            // TODO backup_rule when implemented

            if (JSON.stringify(changes) != JSON.stringify({}) && JSON.stringify(error) === JSON.stringify({})) {
                storage.updateAttributes(changes)
                .then((changed) => {
                    res.statusCode = 202;
                    res.json(removeInternals(changed, true)).end();
                }).catch((err) => {
                    req.log.error('Problem when changing storage attributes:', err);
                    res.statusCode = 500;
                    res.end();
                });
            }
            else {
                if (JSON.stringify(error) === JSON.stringify({})) {
                    error.error = errors['STORAGE_INVALID'];
                    res.statusCode = 400;
                    res.json(error).end();
                }
            }
        }     
    }).catch((err) => {
        req.log.error('Problem when fetching event:', err);
        res.statusCode = 500;
        res.end();
    });
}

//   server.del('/storage/:uuid', storage.delete);
exports.delete = (req, res) => {
    models.storage_device.findOne({
        where: { 
            uuid: req.params.uuid,
            userAnnotationId: req.user.annotation_id
        }
    }).then((storage) => {
        if (!storage || storage.length < 1) {
            var error = {};
            error.error = errors['STORAGE_NOT_FOUND'];
            res.statusCode = 404;
            res.json(error).end();
        }
        else {
            var error = {};
            if (storage.state != 'online') {
                error.error = errors['STORAGE_STATE_ILLEGAL'];
                res.statusCode = 409;
            }
            // TODO check if attached to server

            if (JSON.stringify(error) != JSON.stringify({})) {
                res.json(error).end();
            }
            else {
                storage.destroy()
                .then(() => {
                    res.statusCode = 204;
                    res.end();
                }).catch((err) => {
                    req.log.error('Problem deleting storage:', err);
                    res.statusCode = 500;
                    res.end();
                })
            }
        }
    }).catch((err) => {
        req.log.error('Problem when fetching storage for deletion:', err);
        res.statusCode = 500;
        res.end();
    });
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