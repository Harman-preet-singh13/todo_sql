const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const sequelize = require('./sequelize')
const tasksController = require("./taskApi")

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

app.use('/tasks', tasksController)


sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
