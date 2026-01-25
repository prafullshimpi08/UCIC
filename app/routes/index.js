const app = require('express')();
// const { verifyApiKey } = require('shared-services').auth;

app.use('/v1',require('./v1/index'))
// app.use('/worldline' ,require('./v1/index'))
// app.use('/nach' ,require('./v1/index'))
// app.use('/esing' ,require('./v1/index'))

module.exports = app