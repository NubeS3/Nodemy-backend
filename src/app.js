const https = require('https');
const fs = require('fs');
const express = require("express");
require("./db/mongoose.db");
require('./db/clearTotalRegisteredLastWeek.db');

const cors = require("./middlewares/cors.middleware");

const app = express();

app.use(express.json());
app.use(cors);

app.get("/", (_, res) => {
  res.send({
    message: 'Welcome to Nodemy APIs service',
  });
});

const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.route");
const categoryRoute = require("./routes/category.route");
const courseRoute = require('./routes/course.route');
const lectureRoute = require('./routes/lecture.route');
const sectionRoute = require('./routes/section.route');
const ratingRoute = require('./routes/rating.route');

app.use(userRoute);
app.use(adminRoute);
app.use(categoryRoute);
app.use(courseRoute);
app.use(lectureRoute);
app.use(sectionRoute);
app.use(ratingRoute);

app.use('*', (_, res) => {
  res.status(404).send({
    error: 'Not Found',
  });
});

process.on('uncaughtException', function (exception) {
  console.log(exception);
});

process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging, throwing an error, or other logic here
});


if (process.env.PHASE === 'DEVELOPMENT') {
  const port = process.env.PORT || 8081;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
else {
  const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${process.env.HOST}/privkey.pem`, 'utf8');
  const certificate = fs.readFileSync(`/etc/letsencrypt/live/${process.env.HOST}/cert.pem`, 'utf8');
  const ca = fs.readFileSync(`/etc/letsencrypt/live/${process.env.HOST}/chain.pem`, 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca
  };

  const server = https.createServer(credentials, app);
  server.listen(443, () => {
    console.log(`Server is running on port 443`);
  });
}