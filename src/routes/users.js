const express = require('express');
const router = express.Router();
// const jwt = require('express-jwt');
const nodemailer = require('nodemailer');
const config = require('../config');
const User = require('../models/Users');
const password = require('passport');


const { isAuthenticated } = require('../helpers/auth');
// const { verifyToken } = require('../controllers/verifyToken');
const aleatorio = Math.random();
const aleatorio2 = Math.random();


router.get('/users/usuarios', isAuthenticated, async (req, res, next) => {
    const user = await User.find();
    res.render('users/usuarios', { user });

});



router.get('/users/perfil', isAuthenticated, async (req, res) => {
    const imagenuser = await User.find({ perfil: 'perfil' });
    res.render('users/perfil', { imagenuser });
});


router.get('/users/perfil/:id', isAuthenticated, async (req, res) => {
    const perfil = await User.findById(req.params.id)
    res.render('users/perfil', { perfil });
})


router.post('/users/imguser/:id', isAuthenticated, async (req, res) => {

    var imguser = (req.file['filename']);
    const perfil = 'perfil';

    await User.findByIdAndUpdate(req.params.id, { imguser, perfil });

    req.flash('success_msg', 'foto de perfil actualizada!');
    res.redirect('/users/perfil');
});




router.get('/users/recuperar', async (req, res) => {
    // const {email} = req.body;
    // const user = await User.find(email);
    res.render('users/recuperar');
});

router.post('/users/recuperar', async (req, res) => {
    const { email, id } = req.body;
    const emailUser = await User.findOne({ email: email });

    if (!email) {
        req.flash('error_msg', 'El campo esta bacio!');
        res.redirect('/users/recuperar');
    }
    if (!emailUser) {
        req.flash('error_msg', 'El imail no esta registrado!');
        res.redirect('/users/recuperar');
    }
    else {

        req.flash('success_msg', 'Se ha enviado un correo electronico con las intrucciones para el cambio de su contraseña, por favor verifique!');
        contentHTML = `
   <H1>Restablecer tu contraseña:</h1>
   <ul>
   <li>${email}</li>
   <a href="http://localhost:3000/users/${aleatorio2}/cambiarPassword/${aleatorio}">
   entrar
   </a>
   <h3>Su codigo es:</h3>
   </ul>
   `
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, service: 'gmail',
            auth: {
                user: 'joseeladio28.jer@gmail.com',
                pass: 'fydnmjpgjkkrboda'
            }
        });
        var mailOptions = {
            from: 'Liquior Store',
            to: email,
            subject: 'LiquorStore',
            html: contentHTML
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);

            } else {

                console.log('email enviado:' + info.response);


            }
        });
        router.get('/users/:codigo/cambiarPassword/:codigo', async (req, res) => {
            const user = await User.find({ id, email });
            res.render('users/cambiarPassword', { user });
        });

        // const user = await User.find({id,email});
        res.redirect('/users/signin')

    }
});

router.get('/users/edit/:id', async (req, res) => {

    const user = await User.findById(req.params.id);

    res.render('users/edit-users', { user });

});

router.put('/users/edit-users/:id', async (req, res) => {

    const { email, password, username, confirm_password } = req.body;
    if (!email) {
        req.flash('error_msg', 'El email no puede quedar en blanco!')
        res.redirect('/users/usuarios');
    }
    if (!password) {
        req.flash('error_msg', 'Crea una contraseña!')
        res.redirect('/users/usuarios');

    }
    if (password != confirm_password) {
        req.flash('error_msg', 'las contraseñas no coinsisden!')
        res.redirect('/users/usuarios');

    }
    if (!username) {
        req.flash('error_msg', 'Username en blanco!')
        res.redirect('/users/usuarios');
    }
    else {
        const newUser = new User({ email, password, username, confirm_password });
        newUser.password = await newUser.encryptPassword(password);
        await User.findByIdAndRemove(req.params.id);
        await newUser.save();

        console.log(newUser.password);
        console.log(password);
        // await newUser.save();

        req.flash('success_msg', 'La contraseña se ha cambiado!');
        res.redirect('/users/usuarios');

    }

});


router.delete('/users/delete/:id', isAuthenticated, async (req, res) => {
    await User.findByIdAndRemove(req.params.id);
    req.flash('success_msg', 'Ha eliminado el usuario!')
    res.redirect('/users/usuarios');
})


router.get('/users/signin', (req, res) => {


    res.render('users/signin');
});


router.post('/users/signin', password.authenticate('local', {
    successRedirect: '/backens/principal',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;
    const token = 0;
    const errors = [];
    if (email.length <= 0) {
        errors.push({ text: 'El campo email esta en blanco' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinsiden' });

    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe ser mayor a 4 digitos' });

    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, username, email, password, confirm_password, token });

    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'El imail ya esta en uso!');
            res.redirect('/users/signup');
        } else {
            //encriptar contraseña
            const newUser = new User({ username, email, password, token });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();

            req.flash('success_msg', 'Estas registrado');

            res.redirect('/users/signin');

            contentHTML = `
   <H1>User information</h1>
   <ul>
   <li>Email: ${email}</li>
   <p>Te has registrado en liquor store..</p>
   </ul>
   `
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'joseeladio28.jer@gmail.com',
                    pass: 'Josenet1524'
                }
            });
            var mailOptions = {
                from: 'Liquior Store',
                to: email,
                subject: 'LiquorStore',
                html: contentHTML
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    console.log('hay un error pero no se cual es');

                } else {
                    console.log('email enviado:' + info.response);

                }
            });

        }

    }

});


router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/users/signin');
})



module.exports = router;

