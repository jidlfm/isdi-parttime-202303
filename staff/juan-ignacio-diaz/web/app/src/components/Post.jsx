import { context } from '../ui'

import retrieveUser from '../logic/retrieveUser'
import toggleLikePost from '../logic/toggleLikePost'
import toggleSavePost from '../logic/toggleSavePost'


export default function Post ({ post: { id, author, image, text, date, likes, dateLastModified}, onModifyPost, onEditPost, onMenssageAlert}) {
    console.log('Post  -> render')

    function handleLikePost (event) {
        event.preventDefault()

        try {
            toggleLikePost(context.userId, id)

            onModifyPost()
        }
        catch(error){
            onMenssageAlert(error.message)
        }
    }

    function handleSavePost (event) {
        event.preventDefault()

        try {
            toggleSavePost(context.userId, id)

            onModifyPost()
        }
        catch(error){
            onMenssageAlert(error.message)
        }
    }

    function handleEditPost (event) {
        event.preventDefault()

        onEditPost(id)
    }

    try {
        const activeUser = retrieveUser(context.userId)
        const postUser = retrieveUser(author)
 

        return <article className="post-article post-text">
        <div className="post-Author">
            <h1 className="name">{postUser.name}</h1>
        </div>
        <div className = "post-menssage">
            <img src={image} className="post-image"/>
            <p>{text}</p>
        </div>
        <button className = "button-likes" onClick={handleLikePost}>{likes && likes.includes(context.userId) ? '❤️' : '🤍'} ({likes? likes.length : 0})</button>
        <button className = "button-save" onClick={handleSavePost}> {activeUser.savePosts && activeUser.savePosts.includes(id)? 'Saved' : 'Unsaved'}</button>
        <div className = "post-info">
            <time>Date {date.toLocaleString()}</time>
            {postUser.id === activeUser.id ?  <button onClick={handleEditPost}>Edit</button> : ''}           
            <time>{dateLastModified ? 'Last Modified ' + dateLastModified.toLocaleString(): ''}</time>
        </div>
    </article>
    }
    catch (error) {
        onMenssageAlert(error.message)
    }
}