const { 
    validators: { validateId },
    errors: { ExistenceError, DuplicityError, UnknownError }
} = require('com')

const { User, List } = require('../../data/models')

/**
 * add users from contact list by userId and contactId
 * 
 * @param {string} listId  The Id of the user to creete list.
 * @param {string} userId  The Id of the user to creete list.
 * @param {string} contactId The Id a contact to the user to creete list.
 *
 * @throws {ExistenceError} On existing userId
 * @throws {DuplicityError} On existing email
 */
module.exports = (listId, userId, contactId) => {
    validateId(listId, 'list id')
    validateId(userId, 'user id')
    validateId(contactId, 'user id')

    return (async () => {   
        const [list, user, contact] = await Promise.all([List.findById(listId), User.findById(userId), User.findById(contactId)])

        if (!list) throw new ExistenceError('list not found')

        if (!user) throw new ExistenceError('user not found')

        if (!contact) throw new ExistenceError('contact not found')

        if (!(user.contacts.some(contact => contact.toString() === contactId))) throw new ExistenceError('not a user contact')

        if (list.users.some(user => user.toString() === contactId)) throw new DuplicityError('contact already exists')

        await List.findByIdAndUpdate(listId, { $push: { notifyAcceptList: [contactId] } }) 
    })()
}