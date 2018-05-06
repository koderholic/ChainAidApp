'use strict'

const Database = use('Database')
const Hash = use('Hash')

const User = use('App/Models/User')

class AuthController {
  async login ({ request, auth, session, response }) {

    try {  
        // Get Form Data
        const { email, password } = request.all()
  
        // Retrieve User based on Form Data
        const user = await User
                             .query()
                             .where( 'email', email)
                             .first()
  
        // If user is found, verify password provided against that stored in the DB
        if ( user ) {
  
           
           // Verify the password
           const passwordVerified = await Hash.verify( password, user.password )
  
           // If verified, login user
           if ( passwordVerified ) {
              await auth.login(user)
              
                 return response.route('dasboard')
  
           }
  
        }
  
        // If user isn't found,display an error message
        session.flash({
           notification: {
              type: 'danger',
              message: `We could't verify your credentials. Please ensure you typed in the right details`
           },
        })
  
        return response.redirect('back')

      } catch (error) {

        session.flash({
          notification: {
             type: 'danger',
             message: `Internal Error. Please Try Again Later`
          }
        })

       console.log(error)

       return response.redirect('back')
      
      }
  }

  async logout({ auth, response, view }) {

    await auth.logout()
    return response.redirect('/login')

 }
}

module.exports = AuthController
