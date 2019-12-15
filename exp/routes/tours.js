const express = require('express');
const Tour = require('../models/tour');
const Comment = require('../models/comment'); 
const Reservation = require('../models/reservation');
const catchErrors = require('../lib/async-error');

const router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET questions listing. */
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const tours = await Tour.paginate(query, {
    sort: {createdAt: -1}, 
    populate: 'author', 
    page: page, limit: limit
  });
  res.render('tours/index', {tours: tours, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('tours/new', {tour: {}});
});

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  res.render('tours/edit', {tour: tour});
}));

router.get('/:id', catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('guide');
  const comment = await Comment.find({tour: tour.id}).populate('customer');
  const reservation = await Reservation.find({tour: tour.id}).populate('guide');
  tour.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록???

  await tour.save();
  res.render('tours/guidetour', {tour: tour, comments: comment, reservation: reservation});
}));

router.put('/:id', catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    req.flash('danger', 'Not exist guide tour');
    return res.redirect('back');
  }
  tour.title = req.body.title;
  tour.goTo = req.body.goTo;
  tour.simpleContent = req.body.simpleContent;
  tour.pricePer = req.body.pricePer;
  //img: {type: String}
  tour.startTime = req.body.startTime;
  tour.allTourList = req.body.allTourList.split(" ").map(e => e.trim()),
  tour.tourExpression = req.body.tourExpression;

  await tour.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/tours');
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Tour.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/tours');
}));

router.post('/', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  var tour = new Tour({
    guide: user._id,
    title: req.body.title,
    goTo: req.body.goTo,
    simpleContent: req.body.simpleContent,
    pricePer: req.body.pricePer,
    //img: {type: String},
    startTime: req.body.startTime,
    allTourList: req.body.allTourList.split(" ").map(e => e.trim()),
    tourExpression: req.body.tourExpression
  });
  await tour.save();
  req.flash('success', 'Successfully posted your guide tour');
  res.redirect('/tours');
}));

router.post('/:id/reservation', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const tour = await Tour.findById(req.params.id);

  console.log(user._id)
  
  if (!tour) {
    req.flash('danger', 'Not exist guide tour');
    return res.redirect('back');
  }

  var reservation = new Reservation({
    customer: user._id,
    tour: tour._id,
    tourDate: req.body.tourDate,
    numberOfPerson: req.body.numberOfPerson
  });
  await reservation.save();
  req.flash('success', 'Successfully maked your reservation');
  res.redirect(`/tours/${req.params.id}`);
}));

router.post('/:id/comments', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    req.flash('danger', 'Not exist guide tour');
    return res.redirect('back');
  }

  var comment = new Comment({
    customer: user._id,
    tour: tour._id,
    content: req.body.content
  });
  await comment.save();
  tour.numComments++;
  await tour.save();

  req.flash('success', 'Successfully posted your comment');
  res.redirect(`/tours/${req.params.id}`);
}));

module.exports = router;