require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

connectDB();
app.get("/", (req, res) => res.json({ message: "Hello World!" }));

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
