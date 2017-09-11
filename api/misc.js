// Routes for /plan, /zone and /timezone
var fs = require('fs');
const plans = JSON.parse(fs.readFileSync('api/plans.json', 'utf8'));
const zones = JSON.parse(fs.readFileSync('api/zones.json', 'utf8'));
const timezones = JSON.parse(fs.readFileSync('api/timezones.json', 'utf8'));

//   server.get('/plan', misc.plans);
exports.plans = (req, res) => {
    res.statusCode = 200;
    res.json(plans);
}

//   server.get('/zone', misc.zones);
exports.zones = (req, res) => {
    res.statusCode = 200;
    res.json(zones);
}

//   server.get('/timezone', misc.timezones);
exports.timezones = (req, res) => {
    res.statusCode = 200;
    res.json(timezones);
}