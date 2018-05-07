'use strict'

//Module dependencies
const User = use('App/Models/User')
const AidProvision = use('App/Models/AidProvision')
const Hash = use('Hash')
const { sanitize, validate } = use('Validator')
//IPFS API
var IPFS  = require('ipfs-mini')
var ipfs = new IPFS({host: '127.0.0.1', port: '5001', protocol: 'http'})

class USSDController {
    async signup ({ request,response }) {

        const validatorRules = {
            first_name: 'string',
            last_name: 'string',
            email: 'email',
            no_of_children: 'number',
            age_range: 'string',
            marital_status: 'string',
            telephone: 'string|unique:users',
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
        Object.assign(user,sanitized)

        //TODO: Saves Recoipients details on the blockchain network
        if (sanitized.user_type == 'recipient') {
            await ipfs.addJSON(user, (err, ipfsHash) => {
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

        if (!savedUser){
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

    async account ({ request, response }){
        const validatorRules = {
            telephone: 'string'
        }

        const sanitizeRule = {
            telephone: 'escape, strip_links'
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

        //Serch the user table if the recipient exist using unique telephone number
        const recipient = await User.findBy({ telephone: sanitized.telephone })
        console.log('recipient', recipient)
        if (!recipient) {
            response.status(403)
            response.json({
                success: false,
                data: request.post(),
                message: 'Sorry, you do not have an asccount with us'
            })
            return
        }

        //Checks the Aid provision table with the recipient id for yet to be collected provisions
        const recipientAccount = await AidProvision.query().where({ recipient_id: recipient.id, received_status: 0 }).fetch()
        console.log('recipientAccount', recipientAccount)
        if (recipientAccount.rows.length == 0) {
            response.status(200)
            response.json({
                success: false,
                data: request.post(),
                message: 'There is no provision at this time'
            })
            return
        }

        response.status(200)
        response.json({
            success: true,
            data: recipientAccount
        })
    }
}

module.exports = USSDController
