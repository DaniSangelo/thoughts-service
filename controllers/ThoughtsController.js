const Thought = require('../models/Thought')
const User = require('../models/User')

module.exports = class ThoughtsController {
    static async showAll(req, res) {
        res.render('thoughts/home')
    }

    static async dashboard(req, res) {
        res.render('thoughts/dashboard')
    }

    static formCreate(req, res) {
        res.render('thoughts/form-create')
    }

    static async save(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Thought.create(thought);

            req.flash('message', 'Pensamento criado com sucesso');
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log('Erro ao salvar pensamento: ' + error?.message || error);
        }
    }
}