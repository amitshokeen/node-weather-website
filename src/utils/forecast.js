const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/faa75ef769a052b58b4d5e4d8616afaf/${latitude},${longitude}?units=si`;
    request({url, json: true}, (error, {body} = {}) => {
        if(error) {
            callback("unable to connect to the weather service", undefined);
        } else if (body.error) {
            callback(body.error, undefined);
        } else {
            callback(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. The high today is ${body.daily.data[0].temperatureHigh} and the low today is ${body.daily.data[0].temperatureLow}. There is a ${body.currently.precipProbability} % chance of rain.`);
        }
    })
    
}

module.exports = forecast