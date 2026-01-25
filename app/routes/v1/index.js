
const app = require('express')();

// app.use('/rule-engine', require('./rule-engine'));

// app.use('/underwriter/core');
// app.use('/underwriter/eel');

// app.use('/underwriter',require('./underwriter'))
// app.use('/loan', require('./loan'));
// app.use('/apply-loan', require('./common'));
app.use('/crm', require('./crm/crm'));
app.use('/company', require('./company/company'));


module.exports = app
