import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Levels from './database/models/levelsModel.js';
import Users from './database/models/usersModel.js';
import internshipRoutes from './routes/internshipRoutes.js';
import internalRoutes from './routes/internalRoutes.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import LocalStrategy from 'passport-local';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
).then(() => {
    console.log('Connected to MongoDB');
}
).catch((error) => {
    console.log(error);
}
);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {domain: 'localhost:3000'}
    }))

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy({usernameField: 'email',  passwordField: 'password' }, (username, password, done) => {
      // Match user
      Users.findOne({email: username}).then(user => {
        console.log(user.email);        //logged user name.
        if (!user) {

          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        const isMatched = bcrypt.compareSync(password, user.hashedPassword);

          if (isMatched) {
              console.log('password matched.');         //logged when password matched.
            return done(null, user);
          } else { console.log('password not matched.');    //logged when password not matched.
            return done(null, false, { error_msg: 'Password incorrect' });
          } 
      });
    })
  );

  passport.serializeUser(function(user, done) {
    return done(null, user._id);
  });

  passport.deserializeUser(function(user, done) {
    Users.findById(user._id).then(user => {
        return done(null, user);
        }
    ).catch(err => {
        return done(err, null);
        }
    );
  });

app.use(passport.authenticate('session'));

app.use(express.urlencoded({ extended: false }))
app.use(flash())

app.use(bodyParser.urlencoded({ extended: false })); 

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use('/internships',internshipRoutes)
app.use("/internal", internalRoutes)


app.get('/', (req, res) => {
    res.render('home');
}
);

app.get('/login',checkNotAuthenticated, (req, res) => {
    res.render('login');
}
);

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})
);

app.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('register');
}
);

app.post('/register',checkNotAuthenticated, async (req, res) => {

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            hashedPassword: hashedPassword,
            permissionLevel: 1,
        });
        user.save().then(
            () => {
                res.redirect('/login');
            }
        ).catch((error) => {
            console.log(error);
            res.redirect('/register');
        }
        );
    }
);

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
    })


app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}`);
}
);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }