import * as restify from 'restify'

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
    console.log('ERROR NAME ', err.errors);
    err.toJSON = () => {
        return {
            message: err.message
        }
    }
    
  
    switch(err.name) {
        case 'CastError':
            err.statusCode = 400;
        break;
        case 'ValidationError':
            err.statusCode = 400;
            const messages: any[] = []
        
            for (let name in err.errors) {
              
                messages.push({ message: err.errors[name].message});
            }

            console.log('MESSAGES', messages);

            err.toJson = () => ({
                errors: messages
            });
        break;
    }

    done();
}