import { useContext } from 'react'

import { context } from '../ui'
import Context from '../context'

export const DEFAULT_AVATAR_URL = "https://img.icons8.com/color/512/avatar.png"

import toggleLikePost from '../logic/toggleLikePost'
import toggleSavePost from '../logic/toggleSavePost'
import deletePost from '../logic/deletePost'

import './Post.css'

export default function Post ({ post: { id, author, image, text, date, likes, dateLastModified, fav}, onModifyPost, onEditPost}) {
    const { alert, freeze, unfreeze } = useContext(Context)

    const handleLikePost = () => {
        try {
            freeze()
            toggleLikePost(context.userId, id, error => {
                unfreeze()

                if (error){
                    alert(error.message)

                    return
                }

                onModifyPost()
            })  
        }
        catch(error){
            unfreeze()
            alert(error.message)
        }
    }

    const handleSavePost = () => {
         try {
            freeze()
            toggleSavePost(context.userId, id, error => {
                unfreeze()
                if (error){
                    alert(error.message)

                    return
                }

                onModifyPost()
            })
        }
        catch(error){
            unfreeze()
            alert(error.message)
        }
    }

    const handleEditPost = () => onEditPost(id)

    const handleDeletePost = () => {
        try{
            freeze()
            deletePost(context.userId, id, error => {
                unfreeze()
                if (error){
                    alert(error.message)

                    return
                }

                onModifyPost()
            })
        }
        catch(error){
            unfreeze()
            alert(error.message)
        }
    }

    return <>
        <article className="post-article post-text">
            <div className="post-Author">
                <img className="home-header-avatar" src={author.avatar? author.avatar : DEFAULT_AVATAR_URL} alt=""/>
                <h1 className="name">{author.name}</h1>
            </div>
            <div className = "post-menssage">
                <img src={image} className="post-image"/>
                <p>{text}</p>
            </div>
            <div className = "post-button">
                <div>
                    <button className = "button-likes" onClick={handleLikePost}>{likes && likes.includes(context.userId) ? '❤️' : '🤍'} ({likes? likes.length : 0})</button>
                    <button className = "button-save" onClick={handleSavePost}> {fav ? '📌' : '🔘'}</button>
                </div>
                <div>
                    {context.userId === author.id ? <button onClick={handleEditPost}>🖍</button> : ''} 
                    {context.userId === author.id ? <button onClick={handleDeletePost}>🗑</button> : ''}   
                </div>
            </div>
            <div className = "post-info">
                <time>📎 {date.toLocaleString()}</time>
                <time>{dateLastModified ? '✏ ' + dateLastModified.toLocaleString(): ''}</time>                          
            </div>
        </article>
    </>
}