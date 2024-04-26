// Import required modules
const express = require('express');
// Create an Express app
const app = express();
// Define a sample API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
