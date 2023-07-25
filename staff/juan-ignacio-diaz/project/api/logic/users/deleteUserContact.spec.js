require('dotenv').config()

const { expect } = require('chai')

const mongoose = require('mongoose')
const { User } = require('../../data/models')

const deleteUserContact = require('./deleteUserContact')

const { generateUser, cleanUp, populateUser} = require('../helpers/tests')

describe('deleteUserContact', () => {
    let userTest, contactTest

    before(() => mongoose.connect(process.env.MONGODB_URL))

    beforeEach(async () => {
        userTest = generateUser()
        contactTest = generateUser()

        await cleanUp()
        await Promise.all([populateUser(userTest), populateUser(contactTest)])
        
        userTest.contacts.push(contactTest.id)
        return User.findByIdAndUpdate(userTest.id, { $push: { contacts: contactTest.id }})
    })

    it('succeeds on existing user and correct id', async () => {       
        await deleteUserContact(userTest.id, contactTest.id)

        const user = await User.findById(userTest.id)
        expect(user.name).to.equal(userTest.name)
        expect(user.mode).to.equal(userTest.mode)
        expect(user.avatar).to.equal(userTest.avatar)

        expect(user.contacts).to.have.lengthOf(0)
    })

    it('fails on existing user and incorrect id', async () => {
        const userTestNoExistsId = '000000000000000000000000'

        try {
            return await deleteUserContact(userTestNoExistsId, contactTest.id)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('user not found')
        }
    })

    it('fails on existing contact and incorrect id', async () => {
        const contactTestNoExistsId = '000000000000000000000000'

        try {
            return await deleteUserContact(userTest.id, contactTestNoExistsId)
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('contact not found')
        }
    })


    it('fails on empty userId', () =>
        expect(() => deleteUserContact('', contactTest.id)).to.throw(Error, 'user id does not have 24 characters')
    )

    it('fails on empty contactId', () =>
        expect(() => deleteUserContact(userTest.id, '')).to.throw(Error, 'user id does not have 24 characters')
    )


    after(() => 
        cleanUp()
            .then(() => mongoose.disconnect())
    )
})