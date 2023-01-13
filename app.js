const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/cities', async (req, res) => {
    console.log(`Getting cities for ${req.query.country}`);
    fetch(`https://data.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000%40public&q=${req.query.country}&sort=population&facet=feature_code`)
        .then(citiesResponse => citiesResponse.json())
        .then(data => {
            const response = data.records.map(record => {
                return {
                    cityName: record.fields.name,
                    population: record.fields.population
                }
            });
            console.log(`Received ${response.length} cities:`, response);
            res.send(response);
        });
});

app.listen(port, () => console.log(`The app is running on port ${port}! Open http://localhost:${port} to see the app.`));
