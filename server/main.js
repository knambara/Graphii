const express = require("express");
const app = express();

// app.get("/", (req, res) => {
//   const testing = [{ id: 1, name: "Test" }];

//   res.json(testing);
// });

// const port = 5000;

// app.listen(port, () => console.log(`Server started on port ${port}`));

const path = require("path");
const publicPath = path.join(__dirname, "..", "client/build");
const port = process.env.PORT || 5000;

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
