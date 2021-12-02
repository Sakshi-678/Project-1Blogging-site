const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const route = require("./routes/route.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", route);

mongoose.connect(
    "mongodb+srv://user-open-to-all:hiPassword123@cluster0.xgk0k.mongodb.net/Muskan_Sayyad-database?retryWrites=true&w=majority",{ useNewUrlParser: true })
	.then(() => console.log("mongodb running and connected"))
	.catch((err) => console.log(err));
// mongoose.connect('mongodb://localhost/MS_DB')
// .then(()=>console.log('Connected to MongoDB Test Environment..'))
// .catch(err=>console.error('Could not connect to mongo',err))

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

