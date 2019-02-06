const path = require('path');

const express = require('express');
const morgan = require('morgan');
const react = require('express-react-views');
const homeOffice = require('@ukhomeoffice/frontend-toolkit');

console.log(process.env);

module.exports = () => {

  const app = express();

  app.set('trust proxy', true);
  app.set('view engine', 'jsx');
  app.set('views', path.resolve(__dirname, '../views'));

  app.engine('jsx', react.createEngine());

  app.use('/public', express.static(path.resolve(__dirname, '../public')));
  app.use('/public', express.static(homeOffice.assets));

  app.use(morgan('dev'));

  app.use((req, res) => res.render('index', {
    version: process.env.HEROKU_RELEASE_VERSION,
    released: process.env.HEROKU_RELEASE_CREATED_AT,
    stylesheets: ['/public/css/app.css'],
    scripts: ['/public/js/index.js']
  }));

  return app;

};
