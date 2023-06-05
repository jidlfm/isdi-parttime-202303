import { validators } from 'com'
const { validateId, validateCallback } = validators

import { savePost, findUserById, findPostById } from '../data'

export default function toggleLikePost(userId, postId, callback) {
    validateId(userId, 'user id')
    validateId(postId, 'post id')
    validateCallback(callback)
    
    findUserById(userId, user => {
        if (!user) {
            callback(new Error("Error to user"))

            return
        }

        findPostById(postId, post =>{
            if (!post) {
                callback(new Error(`post with id ${postId} not found`))
        
                return
            }
        
            const index = post.likes.indexOf(userId)
        
            if (index < 0)
                post.likes.push(userId)
            else 
                post.likes.splice(index, 1)
            
            savePost(post, () => callback(null))
        })
    })

 
}