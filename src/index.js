const express = require('express');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
// const auth = require('./middleware/auth');



//initilizations
const app = express();
require('./database');

require('./config/passport');

// para subir la imagen
const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/uploads'),
    filename: (req,file,cb) =>{
        cb(null,uuid() + path.extname(file.originalname));
    }
  });

 
  
//setting

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'

}));
app.set('view engine', '.hbs');


//email


//middlewars

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(flash());

//codigo de imagen tambien
app.use(multer({
    storage,
    dest: path.join(__dirname,'public/uploads')
}).single('imagen'));


//gloval variables

app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//rutas


// app.post('/upload', (req,res) => {
//        console.log(req.file);
//        console.log(imagen);
//        console.log(req.file.filename)
//         res.send('uploadded') ;
// });
  
// app.use(AuthToken);
// app.use(require('./controllers/verifyToken'));
app.use(require('./routes/index'));

app.use(require('./routes/users'));

// app.get('/private',auth, function(req,res){
//      res.status(200).send({message: 'tienes acceso'})

// })










//static files

app.use(express.static(path.join(__dirname, 'public')));

//server is listenig


 
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

