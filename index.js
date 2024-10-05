const express = require('express');
const fs = require('fs');  // For file operations
const path = require('path');
const app = express();
const router = express.Router();

app.use(express.json());  // To parse JSON request body

// Read user.json file function
function getUserData() {
  const data = fs.readFileSync(path.join(__dirname, 'user.json'));
  return JSON.parse(data);
}

/* 
  - Return home.html page to client 
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

/* 
  - Return all details from user.json file to client as JSON format 
*/
router.get('/profile', (req, res) => {
  const user = getUserData();
  res.json(user);  // Send user data as JSON
});

/* 
  - Modify /login router to accept username and password as JSON body parameter
  - Validate against user.json and return the correct response 
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = getUserData();

  if (username === user.username) {
    if (password === user.password) {
      res.json({
        status: true,
        message: "User Is valid"
      });
    } else {
      res.json({
        status: false,
        message: "Password is invalid"
      });
    }
  } else {
    res.json({
      status: false,
      message: "User Name is invalid"
    });
  }
});

/* 
  - Modify /logout route to accept username as query parameter and display message 
*/
router.get('/logout', (req, res) => {
  const { username } = req.query;
  res.send(`<b>${username} successfully logged out.</b>`);
});

/* 
  - Error handling middleware
  - Return 500 page with message "Server Error" 
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<h1>Server Error</h1>');
});

app.use('/', router);

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Web Server is listening at port ${port}`);
});
