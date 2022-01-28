const express = require('express');
const db = require('./routes/db');
const articleRoute = require('./routes/articles')
const homeRoute = require('./routes/home')
const shortsRoute = require('./routes/shorts')
require('dotenv').config();
const { auth,requiresAuth } = require('express-openid-connect');

const app = express();

app.use(
    auth({
      authRequired : false,
      auth0Logout : true,
      issuerBaseURL: process.env.ISSUER_BASE_URL,
      baseURL: process.env.BASE_URL,
      clientID: process.env.CLIENT_ID,
      secret: process.env.SECRET,
      idpLogout: true,
    })
  );

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// req.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
// });
app.get('/callback', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
  });
app.listen(process.env.PORT || 3000);

app.set('view engine', 'ejs'); //express supporting some template engines like ejs,mustache,pug etc
//i guess this view engine will compile the template

app.get('/', (req, res) => {
    // res.send('Hello World!'); //sends the sting as response
    // res.render("index"); 
    res.redirect('/home');
})

app.get('/profile',requiresAuth(), (req, res) => {
    console.log("profile called")
    // res.send('Hello World!'); //sends the sting as response
    res.send(JSON.stringify(req.oidc.user)); 
})
//we can directly give articles by using app.get like following but i have done in route folder because if there is further children for articles everything will br handled in that seperate route file
// app.get('/some', (req, res) => {
//     res.send('Hello World!'); //sends the sting as response
//     // res.render("index");
// })
app.use(express.urlencoded({ extended : false}))
app.use('/articles',articleRoute)
app.use('/home',homeRoute)
app.use('/shorts',shortsRoute)
