import { LoginProps } from './Login';
import "../styles/EditProfile.css";
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { env } from '../configs/env.config';
export function EditProfile({isloggedIn}: LoginProps){

  const [preview  , setPreview] = useState<string>("");
  const [name , setName] = useState<string>("");
  const [profilePic , setProfilePic] = useState<File | null>(null);

  const navigate = useNavigate();

  useEffect(()=>{  
    const fetchUser = async()=>{
      try{
        const response = await axios.get(`${env.backendUrl}/api/users/profile`);

        setName(response.data.user.name);
        setPreview(`${env.backendUrl}/images/${response.data.user.profilePic}`);

      }catch(error){
        console.log(error);
      }
    }
    fetchUser();
  } , []);

  const handleSubmit = async(e : React.FormEvent)=>{
    e.preventDefault();

    const formData = new FormData();
    formData.append("name" , name);
    if(profilePic) formData.append("profilePic" , profilePic);

    await axios.put(
      `${env.backendUrl}/api/users/profile` , 
      formData ,
      {headers : {"Content-Type" : "multipart/form-data"}}
    );
    navigate("/profile");
  }

  const handleImageChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
    if(!e.target.files) return ;
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  }

  return(
    <>
      <Header 
        isloggedIn={isloggedIn}
      />
         <div className="ep-edit-profile-page">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit} className="ep-edit-profile-form">
        <div className="ep-image-section">
          <img src={preview} className="ep-avatar large" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="ep-input-group">
          <label>Edit Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='ep-input'
          />
        </div>

        <button
        className='ep-save-btn'
        type="submit">Save Changes</button>
      </form>
    </div>
    </>
  );
}