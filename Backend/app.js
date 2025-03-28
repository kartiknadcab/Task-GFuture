const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const auth = require("./routes/authRoutes");
const projects = require("./routes/projectRoutes");
const tasks = require("./routes/taskRoutes");

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", auth);
app.use("/api/projects", projects);
app.use("/api/tasks", tasks);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
