const express = require("express");
const cors = require("cors");
const https = require("https");
const { url } = require("inspector");
const { error } = require("console");
//const fetch = require("node-fetch");
//require("dotenv").config();



const PORT  = process.env.PORT || 3008;


const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());



app.get("/", function (req,res) {
   res.send("<h1> Server is up and running </h1>");
});






app.post("/weather", function(req, res) {
//    res.send("<p>weather data </p>");
    const {location, selectedPlace, selectedCountryCode} = req.body;
    console.log(req.body);

    if(!location || location.trim() === " "){
        return res.status(400).json({message:"Please input a location, location is required"}) 
    } else {
        const appid = process.env.appid;
        const units = process.env.units; 
        
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedPlace},${selectedCountryCode}&appid=${appid}&units=${units}`
        console.log("received location data");
        
        https.get(weatherUrl, function(response){
            console.log(response.statusCode);
 
            response.on("data", function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const imageURL =  `https://openweathermap.org/img/wn/${icon}@2x.png`
            const weatherDescription = weatherData.weather[0].description;
            const humidity  = weatherData.main.humidity;
            const wind = weatherData.wind.speed;
            const cityName = weatherData.name;
            const countryCode = weatherData.sys.country;

            const weatherInfo = {temp, icon, imageURL, weatherDescription, humidity, wind, cityName, countryCode}
            res.send(weatherInfo);
            })
        })
    }

    
});



app.listen(PORT, ()=> {
    console.log("server connected at port " + PORT)
});


