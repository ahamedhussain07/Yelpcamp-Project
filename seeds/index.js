const mongoose = require('mongoose');
const CampGround = require('../modules/campground'); 
const cities = require('./cities');
const {descriptors,places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;
db.on("error",console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log("Database connected")
});


// in seedhelpers.js we have 2 array one is descriptors and places
// we randomly choosing that two of array each name and adding one and save it in a database

const sample = array => array[Math.floor(Math.random()* array.length)];

const seedDB = async ()=>{
    // delete all database
    await CampGround.deleteMany({});
    // const c = new CampGround({title:'newYork'})
    // c.save()

    // after delete create a new 50 database
    for(let i =0 ; i <50;i++){
        const random1000 = Math.floor(Math.random()* 1000);
        const price = Math.floor(Math.random()*20) + 10 ;
        const camp = new CampGround({
            // get location from cities.js it have 1000 cities details
            // we get a random 50 cities with cityName and State
            location:`${cities[random1000].city} , ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251', // get a random image
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem deserunt veniam nostrum quasi iste. Placeat nulla adipisci illo tempore rem cumque quia modi facilis dignissimos voluptate repellat totam, dolore repudiandae?',
            price:price // this line is also equal to price : price we give that in short
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close() // close the connection after running seedDB function
})