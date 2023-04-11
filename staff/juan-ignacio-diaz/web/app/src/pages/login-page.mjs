import authenticateUser from '../logic/authenticate-user.mjs'
import retrieveUser from '../logic/retrieve-user.mjs'
import {context, show, hide} from '../ui.mjs'
import {registerPage} from './register-page.mjs'
import {homePage, profilePanel, profileLink, avatarImage, DEFAULT_AVATAR_URL, renderPosts} from './home-page.mjs'

export const loginPage = document.querySelector(".login")
const loginForm = loginPage.querySelector('form')

loginForm.onsubmit = function (event) {
    event.preventDefault()

    const email = event.target.email.value
    const password = event.target.password.value

    try {
        const user = retrieveUser(authenticateUser(email, password))

        loginForm.reset()
        hide(loginPage)

        openSession(user)
    }
    catch(error) {
        alert(error.message)
    }
}

loginPage.querySelector("a").onclick = function (event) {
    event.preventDefault()

    hide(loginPage)
    show(registerPage)
}

function openSession(user) {
    context.userId = user.id 

    hide(profilePanel)
    renderPosts()

    profileLink.innerText  = user.name

    avatarImage.src = user.avatar? user.avatar : DEFAULT_AVATAR_URL

    show(homePage)
}