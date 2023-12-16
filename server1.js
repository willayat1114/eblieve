const express = require('express');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const db = new sqlite3.Database('mydatabase.db');

// Create users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: '62',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pdf', express.static(path.join(__dirname, 'source', 'pdf')));
app.use('/image', express.static(path.join(__dirname, 'source', 'image')));

app.get('/', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs', { errorMessage: req.flash('error') });
});

app.get('/home', checkAuthenticated, (req, res) => {
  res.render('home.ejs', { name: req.session.username });
});

app.get('/error', (req, res) => {
  res.render('error.ejs');
});

app.get('/search', checkAuthenticated, (req, res) => {
  res.render('se.ejs', { name: req.session.username });
});

app.get('/help', (req, res) => {
  res.render('help.ejs');
});

app.get('/shadow_of_hope', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.session.username });
});

app.post('/login', checkNotAuthenticated, (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error(err.message);
      return res.redirect('/error');
    }
    if (!user || user.password !== password) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/error');
    }
    req.session.isAuthenticated = true;
    req.session.username = user.username;
    res.redirect('/home');
  });
});

app.delete('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

function checkAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return res.redirect('/home');
  }
  next();
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
