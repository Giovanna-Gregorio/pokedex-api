const express = require('express');
const cors = require('cors');
const app = express();
const consign = require('consign');
const database = require('./config/database');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());
app.use(cors());
app.database = database;

consign()
    .then('./api')
    .then('./routes/routes.js')
    .into(app)

app.listen(3003);