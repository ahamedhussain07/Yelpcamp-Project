const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const campgroundSchema = Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});


campgroundSchema.post('findOneAndDelete', async function (doc) {
    // console.log('Deleting!!!!')
    // console.log(doc) // it print the deleted campground
    if (doc) { // if doc has something
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);