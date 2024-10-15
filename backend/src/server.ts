// Responsible for starting the server and listening on a specified port.
// It typically imports the app.ts and calls the listen method.
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("BooksAndBids!");
});