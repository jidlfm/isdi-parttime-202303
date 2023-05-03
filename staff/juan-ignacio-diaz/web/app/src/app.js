import { Component } from './library/composito.js'
import { context } from './ui.js'

import Login from './pages/login.js'
import Register from './pages/register.js'
import Home from './pages/home.js'

export default class App extends Component {
    constructor() {
        super(`<div></div>`)

        const showLogin = home => {
            const login = new Login

            login.onRegisterClick = () => {
                const register = new Register

                register.onLoginClick = () => {
                    this.remove(register)
                    this.add(login)
                }

                register.onRegistered = () => {
                    this.remove(register)
                    this.add(login)
                }

                this.remove(login)
                this.add(register)
            }

            login.onAuthenticated = () => {
                const home = new Home

                home.onLoggedOut = () => {
                    this.remove(home)
                    this.add(login)
                }

                this.remove(login)
                this.add(home)
            }

            if (home)
                this.remove(home)
            this.add(login)
        }

        if (context.userId) {
            const home = new Home

            home.onLoggedOut = () => showLogin(home)

            this.add(home)
        } else showLogin()
    }

}