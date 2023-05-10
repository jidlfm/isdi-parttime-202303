import { validateEmail, validatePassword } from './helpers/validators.js'
import { findUserByEmail } from './helpers/data-managers.js'

export default function authenticateUser(email, password) {
    validateEmail(email)
    validatePassword(password)

    const user = findUserByEmail(email)

    if (!user || user.password !== password) 
        throw new Error('wrong email or password')
    
    return user.id
}