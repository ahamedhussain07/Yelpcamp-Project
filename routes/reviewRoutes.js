const express = require('express');
const route = express.Router({mergeParams:true});

const CampGround = require('../modules/campground');
const Review = require('../modules/review');

const { reviewSchema } = require('../schemas')

const asyncError = require('../utils/asyncError');
const expressError = require('../utils/expressError');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next();
    }
}


// for creating reviews
route.post('/', validateReview , asyncError(async (req, res) => {
    // res.send("You'r review is awesome")
    console.log(req.params)
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','successfully created review');
    res.redirect(`/campgrounds/${campground._id}`)
}))


route.delete('/:reviewId',asyncError(async(req,res)=>{
    // res.send('Delete me !!!!')
    const {id,reviewId}= req.params;
    await CampGround.findByIdAndUpdate(id,{$pull :{reviews:reviewId}}) // to remove the reviewId
    await Review.findByIdAndDelete(reviewId)// it remove the review data but not objectId
    // that's why we using $pull to remove the reviewId
    req.flash('success','successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = route;