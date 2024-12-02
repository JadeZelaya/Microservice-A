const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const app = express();

// Path to the CSV file
const csvFilePath = path.join(__dirname, 'flashcards.csv');

// Sample data (for in-memory flashcards)
let flashcards = [
  { question: "What is 2 + 2?", answer: "22" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is the largest planet?", answer: "Jupiter" }
];


// Middleware to parse JSON bodies for POST/DELETE requests
app.use(express.json());

// DELETE endpoint to remove all flashcards
app.delete('/flashcards/all', (req, res) => {
  try {
    // Clear in-memory flashcards
    flashcards = [];

    // Clear the CSV file, keeping only the header
    clearFlashcardsCsv();

    res.status(200).json({ message: "All flashcards deleted and CSV cleared." });
  } catch (error) {
    console.error('Error clearing CSV file:', error);
    res.status(500).json({ message: "Error clearing CSV file", error });
  }
});

// DELETE endpoint to remove a flashcard by its question
app.delete('/flashcards', (req, res) => {
  const { question } = req.body; // Get the question from the request body

  // Find the index of the flashcard with the matching question
  const index = flashcards.findIndex(card => card.question === question);

  if (index !== -1) {
    flashcards.splice(index, 1); // Remove the flashcard from the array
    // Also delete from the CSV file
    updateCsvFile();
    res.status(200).json({ message: `Flashcard with question "${question}" deleted successfully` });
  } else {
    res.status(404).json({ message: `Flashcard with question "${question}" not found` });
  }
});

// Function to clear all flashcards from the CSV file but keep the header
function clearFlashcardsCsv() {
  const header = ['question', 'answer'];
  
  // Writing the header to the CSV file, effectively clearing it
  const writeStream = fs.createWriteStream(csvFilePath);
  const csvStream = csv.format({ headers: true, writeBOM: true });
  
  csvStream.pipe(writeStream);
  csvStream.write(header); // Write the header
  csvStream.end(); // Finish the stream
}

// Function to update the CSV file after deleting a flashcard
function updateCsvFile() {
  const header = ['question', 'answer'];

  const writeStream = fs.createWriteStream(csvFilePath);
  const csvStream = csv.format({ headers: true, writeBOM: true });

  csvStream.pipe(writeStream);
  // Write the header and flashcards data to the CSV file
  csvStream.write(header);
  flashcards.forEach(card => csvStream.write([card.question, card.answer]));
  csvStream.end(); // Finish the stream
}

// Example route to view all flashcards (GET request)
app.get('/flashcards', (req, res) => {
  res.status(200).json(flashcards);
});

// Set the port and start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

