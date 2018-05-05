'use strict'


const Hash = use('Hash')
const Database = use('Database')

const User = use('App/Models/User')

class UserController {


  async login ({ request, auth, session, response }) {
  
        // Get Form Data
        const { email, password } = request.all()
  
        // Retrieve User based on Form Data
        const user = await User
                             .query()
                             .where( 'user_email', user_email)
                             .first()
  
        // If user is found, verify password provided against that stored in the DB
        if ( user ) {
  
           
           // Verify the password
           const passwordVerified = await Hash.verify( password, user.password )
  
           // If verified, login user
           if ( passwordVerified ) {
              await auth.login(user)
              
                 return response.route('dashboard')
  
           }
  
        }
  
        // If user isn't found,display an error message
        session.flash({
           notification: {
              type: 'danger',
              message: `We could't verify your credentials. Please ensure you typed in the right details`
           },
           user_email: user_email
        })
  
        return response.redirect('back')


  }

  async logout({ auth, response, view }) {

    await auth.logout()
    return response.redirect('/login')

 }

}

module.exports = UserController
