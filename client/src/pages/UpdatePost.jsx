import React, { useEffect, useState } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from 'react-redux';

function UpdatePost() {
    const { currentUser } = useSelector(state => state.user);

    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)

    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    setPublishError(data.message)
                    return;
                }
                setFormData(data.posts[0]);
            } catch (error) {
                setPublishError("Failed to fetch post data");
            }
        };
        fetchPost();
    }, [postId]);

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError("Please select an image");
                return;
            }
            setImageUploadError(null);
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "unsigned_preset");

            const res = await fetch("https://api.cloudinary.com/v1_1/dpaxwm2xz/image/upload", {
                method: "POST",
                body: data,
            });

            const json = await res.json();
            setFormData((prev) => ({ ...prev, image: json.secure_url }));
        } catch (error) {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            navigate(`/post/${data.slug}`)
        } catch (error) {
            setPublishError("Something went wrong!");
        }
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className='p-3 max-w-3xl min-h-screen mx-auto'>
            <h1 className='text-center my-7 text-3xl font-semibold'>Update a post</h1>

            <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5 sm:flex-row justify-between">
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) => updateField('title', e.target.value)}
                        value={formData.title || ''}
                    />
                    <Select
                        onChange={(e) => updateField('category', e.target.value)}
                        value={formData.category || 'uncategorized'}
                    >
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                    </Select>
                </div>

                <div className='flex gap-5 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            "Upload Image"
                        )}
                    </Button>
                </div>

                {imageUploadError && (
                    <Alert color='failure'>{imageUploadError}</Alert>
                )}

                {formData.image && (
                    <div className="flex justify-center">
                        <img
                            src={formData.image}
                            alt="post-image"
                            width="150px" 
                            height="150px"
                        />
                    </div>
                )}

                <ReactQuill
                    theme='snow'
                    value={formData.content || ''}
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    onChange={(value) => updateField('content', value)}
                />

                <Button type='submit' gradientDuoTone='purpleToPink'>Update Post</Button>

                {publishError && (
                    <Alert color='failure'>{publishError}</Alert>
                )}
            </form>
        </div>
    );
}

export default UpdatePost;
