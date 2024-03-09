const Thought = require('../models/Thought')
const User = require('../models/User')
const { Op } = require('sequelize');

module.exports = class ThoughtsController {
    static async showAll(req, res) {
        const search = req.query.search ? req.query.search : '';

        const thoughtsData = await Thought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            }
        });

        const thoughts = thoughtsData.map((item) => item.get({plain: true}))
        const count = thoughts.length;
        const hasQuantity = count === 0 ? false : true;

        res.render('thoughts/home', {thoughts, search, count, hasQuantity})
    }

    static async dashboard(req, res) {
        const userId = req.session.userid;
        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Thought,
            plain: true,
        });

        if (!user) {
            res.redirect('/login');
        }
        
        const thoughts = user.Thoughts.map((item) => {
            return item.dataValues
        });

        let hasNotThoughts = thoughts.length == 0 ? true : false;
        
        res.render('thoughts/dashboard', { thoughts, hasNotThoughts })
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

    static async remove(req, res) {
        const thoughtId = req.body.id;
        const userId = req.session.userid;        

        try {
            await Thought.destroy({
                where: {
                    id: thoughtId,
                    Userid: userId,
                }
            })

            req.flash('message', 'Pensamento removido com sucesso')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            });
        } catch (error) {
            console.log('Erro ao remover pensamento: ' + error?.message)
        }
    }

    static async getDataForEdit(req, res) {
        const id = req.params.id;
        const thought = await Thought.findOne({
            where: {
                id
            },
            raw: true,
        });

        res.render('thoughts/edit', {thought})
    }

    static async editSave(req, res) {
        const thoughtId = req.body.id;
        const thought = {
            title: req.body.title,
        }

        try {
            await Thought.update(thought, {
                where: {
                    id: thoughtId
                }
            });
            req.flash('message', 'Pensamento atualizado com sucesso');
            req.session.save(() => {
                res.redirect('/thoughts/dashboard');
            });
        } catch (error) {
            console.log('Erro ao atualizar registro: ' + error?.message)
        }
    }
}