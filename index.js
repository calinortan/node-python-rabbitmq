const express = require('express');
const app = express();

const RabbitmqResolver = require('./src/RabbitmqResolver')
mq = new RabbitmqResolver('USERS');

app.get('/', (req, res) => {
  mq.getMessage('USERS').then((users) => {
    res.send(users);
  })
});

app.listen(7000, () => {
  console.log('app listening on port 7000!');
});
