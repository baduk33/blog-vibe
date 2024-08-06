import React, { useEffect, useState } from 'react'
import moment from "moment"
import { BiSolidLike } from "react-icons/bi";
import { useSelector } from 'react-redux';
import CommentSection from './CommentSection';
import { Button, Textarea } from 'flowbite-react';

function Comment({ comment, onLike, onEdit, onDelete }) {

    const { currentUser } = useSelector(state => state.user);

    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [comment])

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: editedContent
                })
            });
            const data = await res.json();
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div className='flex border-b dark:border-gray-600 text-sm p-4'>
            <div className="flex-shrink-0 mr-3">
                <img src={user.profilePicture} alt="" className='w-10 h-10 rounded-full bg-gray-200' />
            </div>

            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="text-xs font-bold mr-1 truncate">{user ? `@${user.username}` : "anonymous user"}</span>
                    <span className='text-sm text-gray-500'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea
                            className='mb-2'
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 text-xs">
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                outline
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>

                    </>
                ) : (
                    <>
                        <p className='text-gray-500 pb-2'>{comment.content}</p>
                        <div className="flex items-center pt-2 text-sm border-t dark:border-gray-700 max-w-fit gap-2">
                            <button
                                className={`text-gray-500 hover:text-blue-400
                            ${currentUser && comment.likes.includes(currentUser._id) && "!text-blue-500"
                                    }`}
                                type='button'
                                onClick={() => onLike(comment._id)}
                            >
                                <BiSolidLike className='text-sm' />
                            </button>
                            <p className='text-gray-400'>
                                {comment.numberOfLikes > 0 &&
                                    comment.numberOfLikes +
                                    ' ' +
                                    (comment.numberOfLikes === 1 ? 'like' : 'likes')
                                }
                            </p>
                            {
                                currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <>
                                        <button
                                            type='button'
                                            className='text-gray-400 hover:text-blue-500'
                                            onClick={handleEdit}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type='button'
                                            className='text-gray-400 hover:text-red-500'
                                            onClick={() => onDelete(comment._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default Comment