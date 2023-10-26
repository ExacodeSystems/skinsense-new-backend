import app from "./index.js";
import DotenvFlow from "dotenv-flow";

DotenvFlow.config();

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
