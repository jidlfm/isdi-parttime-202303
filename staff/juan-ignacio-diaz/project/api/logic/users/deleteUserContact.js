const { 
    validators: { validateId },
    errors: { ExistenceError }  
} = require('com')

const { User } = require('../../data/models')

/**
 * Delete a user's contact by userId
 * 
 * @param {oid} userId The user's userId
 * @param {oid} contactId The contact's userId
 * 
 * @throws {ExistenceError} On existing userId
 * @throws {InvalidDataError} On invalid password
 */
module.exports = (userId, contactId) => {
    validateId(userId, 'user id')
    validateId(contactId, 'user id')

    return (async () => {   
        const [user, contact] = await Promise.all([User.findById(userId), User.findById(contactId)])

        if (!user) throw new ExistenceError('user not found')

        if (!contact) throw new ExistenceError('contact not found')

        await User.findByIdAndUpdate(userId, { $pullAll: { contacts: [contactId] } }) 
    })()
}