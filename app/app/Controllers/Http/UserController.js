'use strict'

const Database = use('Database')
const Hash = use('Hash')
const { validateAll } = use('Validator')


const User = use('App/Models/User')

class UserController {

    // ======================================== //Save User, Firm, create_user codes and new users to db
  async create ({ view, request, response, session }){
    try {
      
      let count_prefix;
      const {first_name, last_name, telephone, email, password, giver_type, user_type} = request.post()
      const all_registrants = await User.all()
      const new_user = new User ()

      

      // ============ //CHECK IF REGISTRANST EXIST ========================
          const email_exist = await User.findBy('email', email)
          const telephone_exist = await User.findBy('telephone', telephone)
          
          if ((email_exist != null) || (telephone_exist != null)){
            let user_exist = email_exist || telephone_exist
            const create_user_code = await create_userCode.findBy('registrant_id', user_exist.id)

            session.flash({ notification: {
              type : "danger",
              message : "A User with this information has already registered",
            }})
            return response.redirect('back')
          } 
      // ============ //CHECK IF REGISTRANST EXIST ========================
    
      // ============ //Validation ========================
        const rules = {
            first_name : 'required',
            last_name : 'required',
            email : 'required|email|unique:users,email',
            telephone : 'required|unique:users,telephone',
            password : 'required',
        }
      
        const messages = {
          'first_name.required' : 'Please Enter Your First Name', 
          'last_name.required' : 'Please Enter Your Last Name', 
          'email.required' : 'Enter a valid email address', 
          'email.email' : 'Enter a valid email address', 
          'email.unique' : 'Email has already been registered!', 
          'telephone.required' : 'Enter a valid Telephone Number', 
          'telephone.unique' : 'Telephone Number has already been registered!',
          'password.unique' : 'Please Enter Your Unique Password',
        }
      
        const validation = await validateAll(request.all(), rules, messages)
      
        if (validation.fails()) {
          session
            .withErrors(validation.messages())
            .flashAll()
          return response.redirect('back')
        }

      // ============ //END Validation =============



      // ============ // Bind Store Registrant Details =============
          const chainaid_hash = await Hash.make(email)
          new_user.chainaid_hash = chainaid_hash
          new_user.first_name = first_name
          new_user.last_name = last_name
          new_user.telephone = telephone
          new_user.email = email
          new_user.password = password
          new_user.user_type = giver_type
          

        await new_user.save()

      // ============ // END Bind Store Registrant Details ==================


      session.flash({ notification: {
        type: 'success',
        message: 'Successfully Registered'
      } })
      // return response.redirect('back')
      return response.route('login')
  





    } catch (error) {
      console.log(error)

      session.flash({ notification: {
        type: 'danger',
        message : 'Internal Please Try Again Later'
      }})
      return response.redirect('back')

    }
  }

  async dashboard ({view}){



  }


 

}

module.exports = UserController
