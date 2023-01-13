// Set up express.js server
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Listen to the get requests at /cities
app.get('/cities', (req, res) => {
    // return empty list
    res.send([]);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
