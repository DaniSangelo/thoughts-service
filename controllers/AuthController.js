const User = require('../models/User')
const bcrypt = require('bcryptjs');
module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect('login')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async create(req, res) {
        const { name, email, password, passwordConfirm } = req.body;

        if (password !== passwordConfirm) {
            req.flash('message', 'As senhas não conferem, tente novamente')
            res.render('auth/register')

            return
        }

        const userExist = await User.findOne({where: {email}})

        if(userExist) {
            req.flash('message', 'Email já está em uso!')
            res.render('auth/register')

            return
        }

        const salt = bcrypt.genSaltSync(10);

        const hashPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            password: hashPassword,
            email
        }
        
        try {
            const createdUser = await User.create(user);
            //initialize session
            req.session.userid = createdUser.id;
            req.flash('message', 'Cadastro realizado com sucesso')
            req.session.save(() => {
                res.redirect('/');
            })
        } catch (error) {
            console.log(`Faile to save user registration: ${error}`)
        }

        // res.render('auth/register')
    }
}