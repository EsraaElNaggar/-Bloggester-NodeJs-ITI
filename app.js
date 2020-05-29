const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// var upload = multer({ dest: 'uploads/' })

require('dotenv/config');

const app = express();


// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('./public'));

// Import Routes
const blogsRoute = require('./routes/blogs');
app.use('/blogs', blogsRoute);

const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

const authRoute = require('./routes/authentication');
app.use('/api/user', authRoute);

app.get("/", (req, res) => {
    return res.send("bla bla bla from home");
});

// Connect to db
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
        if (err)
            return console.error(err);
        console.log("Connected Successfully to DataBase")
    }
);


// listen to the server
app.listen(process.env.PORT || 4000, () => {
    console.log('Server is running ')
});
