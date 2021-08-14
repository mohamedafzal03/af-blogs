const express = require('express');
const db = require('./routes/db');
const articleRoute = require('./routes/articles')
const shortsRoute = require('./routes/shorts')

const app = express();
app.listen(process.env.PORT || 5555);

app.set('view engine', 'ejs'); //express supporting some template engines like ejs,mustache,pug etc
//i guess this view engine will compile the template

app.get('/', (req, res) => {
    // res.send('Hello World!'); //sends the sting as response
    res.render("index"); 
})
//we can directly give articles by using app.get like following but i have done in route folder because if there is further children for articles everything will br handled in that seperate route file
// app.get('/some', (req, res) => {
//     res.send('Hello World!'); //sends the sting as response
//     // res.render("index");
// })
app.use(express.urlencoded({ extended : false}))
app.use('/articles',articleRoute)
app.use('/shorts',shortsRoute)
