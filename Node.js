const express = require('express');
const app = express();

// Sample data: a list of flashcards (in a real application, you'd use a database)
let flashcards = [
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is the largest planet?", answer: "Jupiter" }
];

// Middleware to parse JSON bodies for POST/DELETE requests
app.use(express.json());

// DELETE endpoint to remove a flashcard by its question
app.delete('/flashcards', (req, res) => {
  const { question } = req.body; // Get the question from the request body

  // Find the index of the flashcard with the matching question
  const index = flashcards.findIndex(card => card.question === question);

  if (index !== -1) {
    flashcards.splice(index, 1); // Remove the flashcard from the array
    res.status(200).json({ message: `Flashcard with question "${question}" deleted successfully` });
  } else {
    res.status(404).json({ message: `Flashcard with question "${question}" not found` });
  }
});

// Example route to view all flashcards
app.get('/flashcards', (req, res) => {
  res.status(200).json(flashcards);
});

// Set the port and start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
