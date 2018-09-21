import * as restify from 'restify';
import {Router} from '../common/router';
import {User} from './users.model';
import { NotFoundError } from 'restify-errors';
class UsersRouter extends Router {

    constructor() {
        super();
        //escuta o event emiter "beforeRender" e retira o password do objeto que vai ser devolvido para o cliente
        this.on('beforeRender', document => {
            document.password = undefined;
        })
    }

    applyRoutes(application: restify.Server){
        application.get('/users', (req, resp, next) => {
            User.find()
            .then(this.render(resp, next))
            .catch(next);
        });

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id)
            .then(this.render(resp, next))
            .catch(next);
        });
        
        application.post('/users', (req, resp, next) => {
            let user = new User(req.body);
            user.save()
            .then(this.render(resp, next))
            .catch(next);   
        });

        application.put('/users/:id', (req, resp, next) => {
            const options = {overwrite: true, runValidators: true};
            User.update({_id: req.params.id}, req.body, options)
                .exec().then(result => {
                    if(result.n) {
                        return User.findById(req.params.id);
                    } else {
                        throw new NotFoundError('Documento não encontrado');
                    }
                }).then(this.render(resp, next))
                .catch(next);
        });

        application.patch('/users/:id', (req, resp, next) => {
            const options = {new: true, runValidators: true}; //opção que diz que o objeto que o métodio deve voltar é o novo e não o antes do update
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        });

        application.del('/users/:id', (req, resp, next) => {
            User.remove({_id: req.params.id}).exec().then((cmdResult: any) => {
                if(cmdResult.result.n) {
                    resp.send(204);
                    return next();
                } else {
                    throw new NotFoundError('Documento não encontrado');
                }

                return next();
            }).catch(next);
        });
    }
}

export const usersRouter = new UsersRouter();