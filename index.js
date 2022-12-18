const express = require("express");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const { logger } = require("./middleware/logevents");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const { error } = require("console");
const PORT = process.env.PORT || 3500;

// custom middleware logger

app.use(logger);

app.use(cors(corsOptions));
// builtiin middleware to handle encoded url data form data
app.use(express.urlencoded({ extended: false }));

// buillt in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("^/", require("./Routes/root"));
app.use("/register", require("./Routes/register"));
app.use("/auth", require("./Routes/auth"));
app.use("/refresh", require("./Routes/refresh"));
app.use("/logout", require("./Routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./Routes/api/employees"));

// app.use('/')
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
