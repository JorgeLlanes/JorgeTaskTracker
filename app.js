const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

//* Connecting to MongoDB 🥭
mongoose.connect(
  "mongodb+srv://Jnrlns:741203Jll1998@cluster0.uh93i.mongodb.net/test",
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);

app.use(express.static("public"));

//* Creat a data schema
const taskSchema = {
  input: String,
};

const tasks = mongoose.model("tasks", taskSchema);

//* GET
app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

//* CREATE w MongoDB
app.post("/", (req, res) => {
  let newTask = new tasks({
    input: req.body.input,
  });
  newTask.save();
  // res.redirect("/");
});

//* READ w/ MongoDB Postman
app.get("/list", (req, res) => {
  tasks.find(function (err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: 200, tasks: response });
    }
  });
});

app.get("/findTasksByInput", function (req, res) {
  const inputTasks = req.query.input;
  tasks.find({ input: inputTasks }, function (err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: 200, resultsFound: response.length, tasks: response });
    }
  });
});

//* UPDATE w/ MongoDB Postman
app.put("/update", function (req, res) {
  const id = req.query.id;
  const newTask = req.query.input;
  tasks.findByIdAndUpdate(id, { input: newTask }, function (err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: 200, tasks: response });
    }
  });
});

//! DELETE
app.delete("/deleteTask", function (req, res) {
  const id = req.query.id;

  tasks.findByIdAndDelete(id, function (err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: 200, tasks: response });
    }
  });
});

app.listen(port, () => {
  console.log("server listening on 3000");
});
