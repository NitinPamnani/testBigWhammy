var express = require('express');
var app = express();
var port = process.env.PORT || 3027;
var morgan = require('morgan');
var mongoose  = require('mongoose');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var bodyParser = require('body-parser');
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);


//mongoose.connect('mongodb://tbwsudo:tbwsudo_2@ds163300.mlab.com:63300/tbigwhammy',{ useNewUrlParser: true});
mongoose.connect('mongodb://whammy:whammyLove_2@ds155461.mlab.com:55461/thebigwhammy',{ useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected to whammy db");
});

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


app.listen(port, function(){
  console.log("Runninng the server on port" + port);
});
