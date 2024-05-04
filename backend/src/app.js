const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');
const { listAllSettings } = require('@/middlewares/settings');
const useLanguage = require('@/locale/useLanguage');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(
    cors({
      origin: 'https://crm.elgatoconbolsas.es',
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Your language settings middleware goes here if needed

// Here our API Routes
app.use('/api', coreAuthRouter);
app.use('/api', coreApiRouter); // No JWT verification needed for coreApiRouter
app.use('/api', erpApiRouter); // No JWT verification needed for erpApiRouter
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// If that above routes didn't work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Production error handler
app.use(errorHandlers.productionErrors);

// Done! We export it so we can start the site in start.js
module.exports = app;
