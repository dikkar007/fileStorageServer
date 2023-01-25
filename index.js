const express = require('express');
const app = express();
const debug = require('debug')('myapp:server');
const path = require('path');
const multer = require('multer');
const logger = require('morgan');
const serveIndex = require('serve-index')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        cb(null, path.parse(file.originalname).name.replace(/ /g,'_') + '-' + Date.now() + path.extname(file.originalname))
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });

//get the router
//const userRouter =require('./routes/user.route');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug');
//app.use(express.static('public'));
app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

app.get('/', function(req,res) {
    res.render('form.pug');
})

app.post('/upload', upload.single('file'), function(req,res) {
    debug(req.file);
    //console.log('storage location is ', 'http://'+req.hostname +':5001/ftp/' + req.file.name);
    let publicPath= 'http://'+req.hostname +':5001/ftp/' + req.file.filename;
    return res.send('<html> <body>storage location is : <a href='+publicPath+'>'+publicPath+'</a></body></html>');
})

//if end point is /users/, use the router.
//app.use('/users', userRouter);

const port = process.env.PORT || 5001;
app.listen(port, () => {
    debug('Server is up and running on port ', port);
})