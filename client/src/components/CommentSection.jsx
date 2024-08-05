import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useState } from 'react'
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom';

function CommentSection({ postId }) {

    const { currentUser } = useSelector(state => state.user);

    const [comment, setComment] = useState("")
    const [commentError, setCommentError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 50) {
            return;
        }

        try {
            const res = await fetch("/api/comment/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            });
            const data = await res.json();
            if (res.ok) {
                setComment("");
                setCommentError(null);
            }
        } catch (error) {
            setCommentError(error.message)
        }
    }

    return (
        <div className='w-full max-w-3xl mx-auto p-3'>
            {currentUser ?
                (
                    <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                        <p>Signed in as:</p>
                        <img src={currentUser.profilePicture} alt="" className='h-6 w-6 object-cover rounded-full' />
                        <Link to='/dashboard?tab=profile' className='text-xs text-cyan-500 hover:underline'>
                            @{currentUser.username}
                        </Link>
                    </div>
                ) :
                (
                    <div className="text-sm text-teal-500 my-4 flex gap-1">
                        You must be signed in to comment.
                        <Link to='/sign-in' className='text-blue-600 hover:underline'>
                            Sign in
                        </Link>
                    </div>
                )}

            {currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea
                        placeholder="Add a comment..."
                        rows='3'
                        maxLength='50'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className="flex justify-between items-center mt-5">
                        <p className='text-gray-500 text-sm'>{50 - comment.length} characters remaining</p>
                        <Button
                            type='submit'
                            gradientDuoTone="purpleToBlue"
                            outline
                        >
                            Submit
                        </Button>
                    </div>

                    {commentError && (
                        <Alert color='failure' className='mt-4'>
                            {commentError}
                        </Alert>
                    )}
                </form>
            )}

        </div>
    )
}

export default CommentSection