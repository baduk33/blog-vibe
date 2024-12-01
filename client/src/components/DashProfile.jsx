import { Alert, Button, TextInput, Modal } from 'flowbite-react'
import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage"
import { app } from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailed, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice'
import { IoAlertCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom'
function DashProfile() {

  const { currentUser, error, loading } = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [formData, setFormData] = useState({})
  const [showModel, setShowModel] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePasswordError, setUpdatePasswordError] = useState(null)

  const filePickerRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile])

  const uploadImage = async () => {

    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setImageFileUploadProgress(progress.toFixed(0));
    }, (error) => {
      setImageFileUploadError("Could not upload image (File must be less than less than 2MB");
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        })
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait while image is uploading");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailed(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailed(error.message));
      setUpdateUserError(error.message);
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setUpdatePasswordError("New password and confirmation password do not match");
      return;
    }

    try {
      const res = await fetch(`/api/user/updatePassword/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setUpdatePasswordError(data.message);
      } else {
        setUpdatePasswordError(null);
        setUpdateUserSuccess("Password updated successfully");
        setShowModel(false);
      }
    } catch (error) {
      setUpdatePasswordError("Failed to update password");
    }
  };


  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST'
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess(data));
      }
      navigate("/sign-in");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-lg mx-auto  p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0
                },
                path: {
                  stroke: `rgba(52, 162, 199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">
            {imageFileUploadError}
          </Alert>
        )}

        <TextInput
          type='text'
          placeholder='Username'
          id='username'
          defaultValue={currentUser.username}
          readOnly
        />
        <TextInput
          type='email'
          placeholder='Email'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          placeholder='Password'
          id='password'
          onChange={handleChange}
          onClick={() => {
            setShowModel(true)
            setModalType("password")
          }}
          readOnly
        />

        <Button type='submit' gradientDuoTone="purpleToBlue" outline disabled={loading || imageFileUploading}>
          {loading ? "loading..." : "Update"}
        </Button>
        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>
              <Button
                type='button'
                gradientDuoTone="cyanToBlue"
                className='w-full'
              >
                Create a post
              </Button>
            </Link>
          )
        }
      </form>
      <div className='text-red-600 flex justify-between mt-5'>
        <span
          className='cursor-pointer'
          onClick={() => {
            setShowModel(true)
            setModalType("delete")
          }}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert color="failure" className='mt-5'>
          {updateUserError}
        </Alert>
      )}

      {error && (
        <Alert color="failure" className='mt-5'>
          {error}
        </Alert>
      )}

      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        {modalType === "delete" ? (
          <Modal.Body>
            <div className="text-center">
              <IoAlertCircleOutline className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='text-lg mb-4 text-gray-500 dark:text-gray-400'>Are you sure you want to delete your Account?</h3>
              <div className='flex justify-center gap-5'>
                <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                <Button color='gray' onClick={() => setShowModel(false)}>No, cancel</Button>
              </div>
            </div>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <div className="text-center">
              <IoAlertCircleOutline className='w-10 h-10 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='text-lg mb-4 text-gray-500 dark:text-gray-400'>Are you sure you want to change your Password?</h3>
              <form onSubmit={handleChangePassword} className='flex flex-col gap-4'>
                <TextInput
                  type='password'
                  placeholder='Old Password'
                  id='oldPassword'
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                />
                <TextInput
                  type='password'
                  placeholder='New Password'
                  id='newPassword'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextInput
                  type='password'
                  placeholder='Confirm New Password'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="flex justify-center gap-5">
                  <Button color='failure' type='submit'>Yes, Change Password</Button>
                  <Button color='gray' onClick={() => setShowModel(false)}>No, cancel</Button>
                </div>
              </form>
            </div>
            {updatePasswordError && (
              <Alert color="failure" className='mt-5'>
                {updatePasswordError}
              </Alert>
            )}
          </Modal.Body>
        )}

      </Modal>
    </div >
  )
}

export default DashProfile