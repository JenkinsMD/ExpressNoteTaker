const nt = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

// GET Route for retrieving all the feedback
nt.get('/', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting feedback
nt.post('/', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newFeedback = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newFeedback, './db/db.json');

    const response = {
      status: 'success',
      body: newFeedback,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

// DELETE Route for a specific note
nt.delete('/:id', (req, res) => {

  const notesId = req.params.id;
 
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {

      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((notes) => notes.id !== notesId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

     
      // Respond to the DELETE request
      res.json(`Item ${notesId} has been deleted 🗑️`);
    });
});

module.exports = nt;
