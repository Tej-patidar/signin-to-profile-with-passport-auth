var express = require('express');
var router = express.Router();
const User = require("../models/userschema");
const passport = require("passport");
const nodemailer=require('nodemailer');
const Localstrategy = require("passport-local");
passport.use(new Localstrategy(User.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Showing secret page
router.get("/secret", isLoggedIn, function (req, res) {
  res.render("secret");
});

// Showing register form
router.get("/register", function (req, res) {
  res.render("register");
});

// Handling user signup
router.post("/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    email:req.body.email
  });
  
  // return res.status(200).json(user);
  res.redirect('/login')
});

//Showing login form
router.get("/login", function (req, res) {
  res.render("login");
});
//Showing forgetpassword page...
router.get("/forgetpassword", function (req, res) {
  res.render("forgetpassword");
});


// showing confirm password page ... 
router.get("/forgetpassword/:id", async function (req, res, next) {
  res.render("getpassword", { userId: req.params.id })
})

// Handling send mail ........ 

router.post("/send-mail", async function (req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  console.log(user)
  if (!req.body.email && !user) return res.send("user not found");
  const mailurl = `${req.protocol}://${req.get("host")}/forgetpassword/${user
    }`;
  console.log(mailurl)
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "tarunpatidar742@gmail.com",
      pass: "lfowknebrfbebanp",
    },
  });

  const mailOptions = {
    from: "Tej Pvt. Ltd.<tarunpatidar742@gmail.com>",
    to: req.body.email,
    subject: "Password Reset Link",
    text: "Do not share this link to anyone.",
    html: `<a href=${mailurl}>Password Reset Link</a>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return res.send(err);
    console.log(info);

    return res.send(
      "<h1 style='text-align:center;color: tomato; margin-top:10%'><span style='font-size:60px;'>✔️</span> <br />Email Sent! Check your inbox , <br/>check spam in case not found in inbox.</h1><br> <a href='/signin'>Signin</a> "
    );
  });
  // res.redirect("/signin")
});

//Handling user login
router.post("/login", async function(req, res){
  try {
      // check if the user exists
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        if (result) {
          res.render("secret");
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});

// Handling user logout 
router.get("/logout", function (req, res) {
  req.logout(()=> {
      res.redirect('/');
    });
});


// post confirmpassword page ......... 

router.post("/confirmpassword/:id", async function (req, res, next) {
  try {
    // const user = await User.findById(req.params.id);
    // await user.setPassword(req.body.new_password);
    // await user.save();
    res.redirect("/login");
    console.log(req.params.id)
  } catch (err) {
    console.log(err)
    res.send(err);
  }

});








function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
