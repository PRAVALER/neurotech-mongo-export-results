const express = require('express');
const app =  express();
const indexRouter = require('./indexRouter');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/v1', indexRouter);
app.listen(3005, () =>
  console.log('Example app listening on port 3005!'),
);
module.exports = app;