const express = require('express');
var cors = require('cors');
const pool = require('./connection');
const app = express();
const userRoute = require ('./routes/user');
const areaRoute = require ('./routes/area');
const tipoRoute = require ('./routes/type');
const equipoRoute = require('./routes/equipo');
const dashboardRoute = require('./routes/dashboard');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/area',areaRoute); 
app.use('/type',tipoRoute);
app.use('/equipo',equipoRoute);
app.use('/dashboard', dashboardRoute);

module.exports = app;
  