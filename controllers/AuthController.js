const User = require('../models/User')
const bcrypt = require('bcryptjs');
module.exports = class AuthController {
    static loginForm(req, res) {
        res.render('auth/login')
    }

    static async login(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({raw: true, where: { email: email }});

        if (!user) {
            req.flash('message', 'Credenciais inválidas');
            res.render('auth/login')    
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            req.flash('message', 'Credenciais inválidas');
            res.render('auth/login')    
            return
        }

        req.session.userid = user.id;
        req.flash('message', `Seja bem-vindo ${user.name}`)

        req.session.save(() => {
            res.redirect('/')
        })
        
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