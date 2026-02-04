
const app = require('express')();

// app.use('/rule-engine', require('./rule-engine'));

// app.use('/underwriter/core');
// app.use('/underwriter/eel');

// app.use('/underwriter',require('./underwriter'))
// app.use('/loan', require('./loan'));
// app.use('/apply-loan', require('./common'));

app.use('/company', require('./company/company'));
app.use('/subscription', require('./company/subscription'));
app.use('/auth', require('./authRoutes'));
app.use('/ucic_manage', require('./company/ucic_manage'));

app.use('/ucic_new', require('./company/ucic_company'));




module.exports = app
