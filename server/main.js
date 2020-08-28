const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const testing = [{ id: 1, name: "Test" }];

  res.json(testing);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
