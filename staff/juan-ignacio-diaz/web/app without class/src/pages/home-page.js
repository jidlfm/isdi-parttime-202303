import { context, show, hide, toggle } from "../ui.js"

import { loginPage } from "./login-page.js"
import { msAlert } from "./alert-page.js"

import retrieveUser from "../logic/retrieve-user.js"
import retrievePosts from "../logic/retrieve-posts.js"
import toggleLikePost from "../logic/toggle-like-post.js"
import toggleSavePost from "../logic/toggle-save-post.js"

import initProfilePanel from "../components/profile-panel.js"
import initAddPostPanel from "../components/add-post-panel.js"
import initEditPostPanel from "../components/edit-post-panel.js"

export const homePage = document.querySelector(".home")
export const profileLink = homePage.querySelector("a")
export const DEFAULT_AVATAR_URL = "https://img.icons8.com/color/512/avatar.png"

const avatarImage = homePage.querySelector(".home-header-avatar")
const addPostButton = homePage.querySelector(".add-post-button")

const profilePanel = initProfilePanel(homePage, avatarImage)
const addPostPanel = initAddPostPanel(homePage, renderPosts)
const { editPostPanel, editPostForm } = initEditPostPanel(homePage, renderPosts)

const postListPanel = homePage.querySelector(".post-list")

profileLink.onclick = function (event) {
    event.preventDefault()

    toggle(profilePanel, postListPanel)
}

homePage.querySelector("button[name=logout]").onclick = function(event){
    avatarImage.src = DEFAULT_AVATAR_URL
    homePage.querySelector(".name").innerText  = ""
    hide(homePage, profilePanel)

    closeSession()
}

addPostButton.onclick = () => show(addPostPanel)

export function renderPosts() {
    try {
        const posts = retrievePosts(context.userId)
        const activeUser = retrieveUser(context.userId)

        postListPanel.innerHTML = ""

        posts.forEach(post => {
            const postItem = document.createElement("article")
            postItem.className = "post-article post-text"


            const postAuthor = document.createElement("div")
            postAuthor.className = "post-Author"

            const user = retrieveUser(post.author)

            const postAuthorName = document.createElement("h1")
            postAuthorName.className = "name"
            postAuthorName.innerText = retrieveUser(post.author).name
            
            if (user.avatar) {
                const postAuthorAvatar = document.createElement("img")
                postAuthorAvatar.className = "home-header-avatar"
                postAuthorAvatar.src = user.avatar

                postAuthor.append(postAuthorAvatar, postAuthorName)
            }
            else 
                postAuthor.append(postAuthorName)

            const postMessage = document.createElement("div")
            postMessage.className = "post-menssage"

                const image = document.createElement("img")
                image.src = post.image
                image.className = "post-image"

                const text = document.createElement("p")
                text.innerText = post.text

            postMessage.append(image, text)

            postItem.append(postAuthor, postMessage)

            const postInfo = document.createElement("div")
            postInfo.className = "post-info"

                const date = document.createElement("time")
                date.innerText = post.date.toLocaleString()

                if (post.author === context.userId) {
                    const button = document.createElement("button")
                    button.innerText = "Edit"

                    button.onclick = function() {
                        editPostForm.querySelector("input[type=hidden]").value = post.id
                        editPostForm.querySelector("input[type=url]").value = post.image
                        editPostForm.querySelector("textarea").value = post.text

                        show(editPostPanel)
                    }

                    postInfo.append(date, button)
                } 
                else {
                    postInfo.append(date)
                }

                const likeButton = document.createElement('button')
                const countLikes = post.likes && post.likes.length || 0
                likeButton.innerText = post.likes && post.likes.includes(context.userId) ? `❤️ (${countLikes})` : `🤍 (${countLikes})`
                
                likeButton.onclick = function() {
                    try {
                        toggleLikePost(context.userId, post.id)
    
                        renderPosts()
                    } catch(error) {
                        alert(error.message)
                    }
                }

                postItem.appendChild(likeButton)

                const savePostButton = document.createElement('button')
                savePostButton.innerText = activeUser.savePosts && activeUser.savePosts.includes(post.id)? `Saved` : `Unsaved`      
                      
                savePostButton.onclick = function() {
                    try {
                        toggleSavePost(context.userId, post.id)
    
                        renderPosts()
                    } catch(error) {
                        alert(error.message)
                    }
                }

                postItem.appendChild(savePostButton)

                if ("dateLastModified" in post) {
                    const dateLastModified = document.createElement("time")
                    dateLastModified.innerText = "Last Modified " + post.dateLastModified.toLocaleString()

                    postInfo.appendChild(dateLastModified)
                }       

            postItem.appendChild(postInfo)

            postListPanel.appendChild(postItem)
        })

    } catch(error) {
        msAlert(error.message)
    }
}

export function openSession(userId) {
    try {
        context.userId = userId
        
        const user = retrieveUser(userId) 

        hide(profilePanel)
        renderPosts()

        profileLink.innerText  = user.name

        avatarImage.src = user.avatar? user.avatar : DEFAULT_AVATAR_URL

        show(homePage)

        return true
    } catch (error) {
        msAlert(error.message)

        return false
    }

}

function closeSession() {
    delete context.userId

    show(loginPage)
}