const express = require("express");
const mongodb = require("mongodb");
const app = express();
const router = express.Router();
const cors = require("cors");
const bcrypt = require("bcrypt");

app.use(express.urlencoded({ extended: false })); 
app.use(express.json());
app.use(cors());

let users = require("./users");
let reservaPuesto = require("./reservaPuesto");
let puestos = require("./puestos");

let MongoClient = mongodb.MongoClient;
let db;


/***********************************************************************/
/*                         CONEXIÓN A LA BBDD                          */
/***********************************************************************/

MongoClient.connect("mongodb://127.0.0.1:27017", function (err, client) {
    if(err!==null) {
        console.log(err);
    } else {
        db = client.db("Coworking");
       app.locals.db = client.db("Coworking");
    }
});


app.use("/users", users);
app.use("/reservaPuesto", reservaPuesto);
app.use("/puestos", puestos);




/*************************************************************/
/*                         PASSPORT                          */
/*************************************************************/

const passport = require("passport");
const session = require("express-session");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      db.collection("users")
        .find({ email: email })
        .toArray(function (err, users) {
          if (users.length === 0) {
            done(null, false);
          }
          const user = users[0];
          console.log(user)
          if (bcrypt.compareSync(password,user.password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
    }
  )
);




passport.serializeUser(function (user, done) {
  done(null, user.email);
});


passport.deserializeUser(function (id, done) {
  db.collection("users")
    .find({ email: id })
    .toArray(function (err, users) {
      if (users.length === 0) {
        done(null, null);
      }
      done(null, users[0]);
    });
});

app.post("/api/login",
  passport.authenticate("local", {
    successRedirect: "/api",
    failureRedirect: "/api/fail",
  })
);

app.get("/api/fail", function (req, res) {
  res.status(401).send({ mensaje: "denegado" });
});


app.get("/api", function (req, res) {
  if (req.isAuthenticated() === false) {
    return res.status(401).send({ mensaje: "necesitas loguearte" });
  }
  res.send( {error:false , mensaje: "Logueado correctamente" , usuario: req.user });
});


app.get("/api/user", function (req, res) {
  if (req.isAuthenticated()) {
    return res.send({ nombre: req.user.name });
  }
  res.send({ nombre: "No logueado" });
});






app.listen(3000, function() {
  console.log('Escuchando puerto 3000');
})          