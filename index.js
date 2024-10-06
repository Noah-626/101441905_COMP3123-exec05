const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

app.use(express.json());
/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req,res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Server Error' });
    }
    res.json(JSON.parse(data));
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: false, message: 'Missing credentials' });
  }

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Server Error' });
    }

    let user;
    try {
      user = JSON.parse(data); // Since the file contains a single user object
      console.log("Parsed user:", user);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ message: 'Error parsing JSON data' });
    }

    // Now validate the single user object
    if (user.username !== username) {
      return res.status(404).json({ status: false, message: 'UserName is invalid' });
    }

    if (user.password !== password) {
      return res.status(401).json({ status: false, message: 'Password is invalid' });
    }

    res.json({ status: true, message: 'User Is valid' });
  });
});


/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req, res) => {
  const username = req.query.username;
  if (username) {
    res.send(`<b>${username} successfully logged out.</b>`);
  } else {
    res.send(`<b>Username is required for logout.</b>`);
  }
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});


app.use('/', router);

app.listen(process.env.port || 8083);

console.log('Web Server is listening at port '+ (process.env.port || 8083));