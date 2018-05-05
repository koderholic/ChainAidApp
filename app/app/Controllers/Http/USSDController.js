'use strict'

//Module dependencies
const User = use('App/Models/User')
const Hash = use('Hash')
//IPFS API
var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('https://ipfs.infura.io:5001 ')

class USSDController {
    async signup ({ request,response }) {

        const validatorRules = {
            first_name: 'string',
            last_name: 'string',
            email: 'email|unique:users',
            no_of_children: 'number',
            age_range: 'string',
            marital_status: 'string',
            telephone: 'string',
            gender: 'string',
            user_type: 'string',
            password: 'string'
        }
      
        const sanitizeRule = {
            first_name: 'escape, strip_links, capitalize',
            last_name: 'escape, strip_links, capitalize',
            email: 'normalize_email',
            no_of_children: 'to_int',
            age_range: 'escape, strip_links',
            marital_status: 'escape, strip_links',
            telephone: 'escape, strip_links',
            gender: 'escape, strip_links',
            user_type: 'escape, strip_links',
            password: 'escape, strip_links'
        }
      
        const validation = await validate(request.all(), validatorRules)
        const sanitized = await sanitize(request.all(), sanitizeRule)
    
        if (validation.fails()) {
        response.status(400)
        response.json({
            success: false,
            data: request.post(),
            message: validation.messages()
        })
        return
        }

        //Initialize user object
        const user = new User()
        object.assign(user,sanitized)

        //TODO: Saves Recoipients details on the blockchain network
        if (user_type == 'recipient') {
            await ipfs.add(user, (err, ipfsHash) => {
                console.log(ipfsHash)
                if (err){
                    response.status(500)
                    response.json({
                        ok: false,
                        data: sanitized,
                        message: 'Sorry! User account could not be created due to server error,please try again'
                    })
                    return
                }
                user.chainaid_hash = ipfsHash
            });
        }

        //Save user to db
        const savedUser = await user.save()

        if (!saveduser){
            response.status(500)
            response.json({
                ok: false,
                data: sanitized,
                message: 'Sorry! User account could not be created due to server error,please try again'
            })
        }

        response.status(200)
        response.json({
            ok: true,
            data: sanitized,
            message: 'User account created successfully'
        })
    }
}

module.exports = UssdController
