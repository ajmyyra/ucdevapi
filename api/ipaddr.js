// Routes for /ip_address

//   server.get('/ip_address', ipaddr.list);
exports.list = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.post('/ip_address', ipaddr.allocate);
exports.allocate = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.get('/ip_address/:ip', ipaddr.info);
exports.info = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.put('/ip_address/:ip', ipaddr.modify);
exports.modify = (req, res) => {
    res.statusCode = 501;
    res.end();
}

//   server.del('/ip_address/:ip', ipaddr.delete);
exports.delete = (req, res) => {
    res.statusCode = 501;
    res.end();
}