const log = console.log;
const path = require('path');
const express = require('express'); //express is actually a function and we call it to create a new express application
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars eingine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
    res.render('index.hbs', {
        title: 'Weather App', 
        name: 'Amit Shokeen'
    });    //we can even use 'index', the hbs extension is not needed. Notice that index.hbs is inside the 'views' folder
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About I, me, myself',
        name: 'Amit Shokeen'
    });
});

app.get('/products', (req, res) => {
    if(!req.query.some) {
        return res.send({
            error: 'You must provide proper search term'
        })
    }
    log(req.query);
    res.send({
        products: []
    })
    
})

app.get('/help', (req, res) => {
    res.render('help', {
        name: 'Amit Shokeen', 
        phone: '0435286001',
        title: 'This is some title...blah blah blah'
    });
});

app.get('/help/*', (req, res) => {
    //res.send('Help article not found');
    res.render('404.hbs', {
        errorMessage: 'Help article not found',
        name: 'Amit Shokeen', 
        title: '404'
    })
});

app.get('/weather', (req, res) => {
    const address = req.query.address
    if(!address){
        return res.send({
            error: 'You must provide an address'
        });
    }
    log(address);
    geocode(address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error });
            }
            res.send({
                address,
                location,
                forecast: forecastData
            });
        })
    });
});

app.get('*', (req, res) => {
    res.render('404.hbs',{
        errorMessage: 'Page not found', 
        name: 'Amit Shokeen',
        title: '404'
    })
});

app.listen(3000, () => {
    log('Server is up on port 3000.');
});