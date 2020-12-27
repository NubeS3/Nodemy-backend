const express = require('express');

const Course = require('../models/course.model');
const Rating = require('../models/rating.model');

const authentication = require('../middlewares/authentication.middleware');
const requestValidation = require('../middlewares/requestValidation.middleware');

const createRatingRequest = require('../requests/rating/createRating.request');
const getRatingsRequest = require('../requests/rating/getRatings.request');
const updateRatingRequest = require('../requests/rating/updateRating.request');
const deleteRatingRequest = require('../requests/rating/deleteRating.request');

const ratingRoute = express.Router();

ratingRoute.post('/ratings', authentication, requestValidation(createRatingRequest), async (req, res) => {
  try {
    let hasBought = false;
    for (let i = 0; i < req.user.boughtCourses.length; ++i) {
      if (req.user.boughtCourses[i].courseId === req.body.courseId) {
        hasBought = true;
        break;
      }
    }

    if (!hasBought) {
      return res.status(400).send({
        error: 'You have not bought this course yet!',
      });
    }

    let rating = await Rating.findOne({ courseId: req.body.courseId, userId: req.user._id.toString() });
    if (rating) {
      return res.status(400).send({
        message: 'You can not start another rating for this course!',
      });
    }

    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(404).send({
        error: 'Found no course!',
      });
    }

    rating = new Rating({
      ...req.body,
      userId: req.user._id.toString(),
    });
    await rating.save();

    res.status(201).send({
      rating,
    });
  }
  catch (error) {
    res.status(500).send({
      error: 'Internal Server Error',
    });
  }
});

ratingRoute.get('/ratings/:courseId', requestValidation(getRatingsRequest), async (req, res) => {
  try {
    const ratings = await Rating.getListRatings(req.query.page || 1, req.params.courseId);
    res.send(ratings);
  }
  catch (error) {
    res.status(500).send({
      error: 'Internal Server Error',
    });
  }
});

ratingRoute.patch('/ratings/:courseId', authentication, requestValidation(updateRatingRequest), async (req, res) => {
  try {
    const rating = await Rating.findOne({ courseId: req.params.courseId, userId: req.user._id.toString() });
    if (!rating) {
      return res.status(404).send({
        error: 'Found no rating!',
      });
    }

    let hasChanged = false;
    Object.keys(req.body).forEach((prop) => {
      if (rating[prop] !== req.body[prop]) {
        rating[prop] = req.body[prop];
        hasChanged = true;
      }
    });

    if (hasChanged) {
      await rating.save();
    }

    res.send({
      rating,
    });
  }
  catch (error) {
    res.status(500).send({
      error: 'Internal Server Error',
    });
  }
});

ratingRoute.delete('/ratings/:courseId', authentication, requestValidation(deleteRatingRequest), async (req, res) => {
  try {
    const rating = await Rating.findOne({ courseId: req.params.courseId, userId: req.user._id.toString() });
    if (!rating) {
      return res.status(404).send({
        error: 'Found no rating!',
      });
    }

    await rating.delete();

    res.send({
      rating,
    });
  }
  catch (error) {
    res.status(500).send({
      error: 'Internal Server Error',
    });
  }
});

module.exports = ratingRoute;