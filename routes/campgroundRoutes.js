const express = require('express');
const route = express.Router();

const { campgroundSchema} = require('../schemas');

const CampGround = require('../modules/campground');
const {isLoggedIn} = require('../middleware')

const asyncError = require('../utils/asyncError');
const expressError = require('../utils/expressError');



const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }
    else {
        next();
    }
    // console.log(result)
}


// showing all campgrounds
route.get('/', asyncError(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campground/index', { campgrounds })
}))


// create a new campground form
route.get('/new',isLoggedIn, (req, res) => {
    res.render('campground/new')
})

// creating that campground and save it
route.post('/',isLoggedIn, validateCampground, asyncError(async (req, res, next) => {
    // if(!req.body.campground) throw new expressError('Invalid campground Data',400)
    const camp = await new CampGround(req.body.campground)
    await camp.save()
    req.flash('success','You successfully created a new Campground')
    res.redirect(`/campgrounds/${camp._id}`)
}))

// show page by id
route.get('/:id', asyncError(async (req, res) => {
    const campgrounds = await CampGround.findById(req.params.id).populate('reviews');
    // console.log(campgrounds)
    if(!campgrounds){
        req.flash('error','could not find campground');
        return res.redirect('/campgrounds')
    }
    res.render('campground/show', { campgrounds })
}))


// edit the campground form
route.get('/:id/edit',isLoggedIn, asyncError(async (req, res) => {
    const campgrounds = await CampGround.findById(req.params.id)
    if(!campgrounds){
        req.flash('error','could not find campground');
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campgrounds })
}))

// edit the campground and update it save it
route.put('/:id',isLoggedIn, validateCampground, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','Successfully update the campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))


// for delete
route.delete('/:id',isLoggedIn, asyncError(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success','successfully deleted campground!')
    res.redirect('/campgrounds');
}))


module.exports = route;