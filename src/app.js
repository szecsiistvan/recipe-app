const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const recipeRouter = require('./routers/recipe');
const ingredientRouter = require('./routers/ingredient');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(recipeRouter);
app.use(ingredientRouter);

module.exports = app;