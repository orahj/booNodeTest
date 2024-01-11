'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// schema for the data
const profileSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  mbti: String,
  enneagram: String,
  variant: String,
  tritype: Number,
  socionics: String,
  sloan: String,
  psyche: String,
  image: String,
  comments: [{ text: String, user: String }],
  votes: { type: Number, default: 0 },
});

// Mongoose model
const Profile = mongoose.model('Profile', profileSchema);

// variable to store the profile
let profile;

// GET route for specific profile record
router.get('/:id', async (req, res, next) => {
  const profileId = parseInt(req.params.id, 10);
  //const {id} = req.params;
  try {
    // Retrieve the specific profile record based on the provided ID
    profile = await Profile.findOne({ id: profileId });

    if (!profile) {
      profile = {
        "id": 1,
        "name": "A Martinez",
        "description": "Adolph Larrue Martinez III.",
        "mbti": "ISFJ",
        "enneagram": "9w3",
        "variant": "sp/so",
        "tritype": 725,
        "socionics": "SEE",
        "sloan": "RCOEN",
        "psyche": "FEVL",
        "image": "https://soulverse.boo.world/images/1.png",
      }
    }

    res.render('profile_template', {
      profile: profile,
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});

// GET route to retrieve all records
router.get('/', async (req, res, next) => {
  try {
    // Retrieve the specific profile record based on the provided ID
    const profiles = await Profile.find({ });

    if (!profiles) {
      return res.status(404).send('Profile not found');
    }

    // Send the retrieved profile data as a JSON response
    res.json(profiles);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});

// POST route to create a new profile record using Postman
router.post('/', async (req, res, next) => {
  try {
    const profileData = req.body;

    // Create a new instance of the profile model with the new data
    const newProfileInstance = new Profile(profileData);

    // Save the new data to the in-memory MongoDB database
    await newProfileInstance.save();

    // Send a success response
    res.status(201).json({ message: 'Profile created successfully', profile: newProfileInstance.toObject() });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});

// Add a comment to a profile's profile
router.post('/:id/comments', async (req, res, next) => {
  const profileId = parseInt(req.params.id, 10);
  const { text, user } = req.body;

  try {
    const profile = await Profile.findOne({ id: profileId });

    if (!profile) {
      return res.status(404).send('Profile not found');
    }

    profile.comments.push({ text, user });
    await profile.save();

    res.json({ message: 'Comment added successfully', profile });
  } catch (error) {
    next(error);
  }
});

// Vote on a profile's profile
router.post('/:id/vote', async (req, res, next) => {
  const profileId = parseInt(req.params.id, 10);

  try {
    const profile = await Profile.findOne({ id: profileId });

    if (!profile) {
      return res.status(404).send('Profile not found');
    }

    // Increment the vote count
    profile.votes += 1;
    await profile.save();

    res.json({ message: 'Vote added successfully', profile });
  } catch (error) {
    next(error);
  }
});

module.exports = function() {

  router.get('/*', function(req, res, next) {
    res.render('profile_template', {
      profile: profile,
    });
  });

  return router;
}