const mongoose = require('mongoose');
var cloudDbPath = 'mongodb+srv://af-blog:7402637728@af-blog-cluster.oijyy.mongodb.net/af-blog?retryWrites=true&w=majority';
var localDbPath = 'mongodb://localhost:27017/blog-app';
mongoose.connect(cloudDbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'haha connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('mongo db connected')
});
// exports.db = db;