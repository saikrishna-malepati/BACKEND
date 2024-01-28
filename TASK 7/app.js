const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    // Store the username in the browser's local storage
    res.cookie('username', username);
    res.redirect('/');
  } else {
    res.send('Invalid username');
  }
});

app.get('/', (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.sendFile(__dirname + '/send msg.html');
  } else {
    res.redirect('/login');
  }
});

app.post('/send-message', (req, res) => {
  const username = req.cookies.username;
  const { message } = req.body;
  if (username && message) {
    // Store the message in a file with username information
    const data = `${username}: ${message}\n`;
    fs.appendFile('messages.txt', data, (err) => {
      if (err) throw err;
      console.log('Message stored in messages.txt');
    });
    res.send('Message sent successfully!');
  } else {
    res.send('Invalid message or user not logged in.');
  }
});

app.get('/read-messages', (req, res) => {
  // Read messages from the file and send them as a response
  fs.readFile('messages.txt', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading messages file.');
    } else {
      const messages = data.split('\n').filter(Boolean);
      res.json({ messages });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
