import { LoginProps } from '../Login/Login';
import "./EditProfile.css";
import { Header } from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { env } from '../../configs/env.config';

export function EditProfile({ isloggedIn }: LoginProps) {
  const [preview, setPreview] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${env.backendUrl}/api/users/profile`);
        setName(response.data.user.name);
        setPreview(`${env.backendUrl}/images/${response.data.user.profilePic}`);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profilePic) formData.append("profilePic", profilePic);

      await axios.put(
        `${env.backendUrl}/api/users/profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  if (isLoading && !preview) {
    return (
      <>
        <Header isloggedIn={isloggedIn!} />
        <div className="ep-edit-profile-page">
          <div className="ep-loading">Loading profile...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header isloggedIn={isloggedIn!} />
      <div className="ep-edit-profile-page">
        <h2>Edit Profile</h2>

        {error && <div className="ep-alert ep-alert-error">{error}</div>}
        {success && <div className="ep-alert ep-alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="ep-edit-profile-form">
          <div className="ep-image-section">
            <div className="ep-avatar-wrapper">
              <img src={preview} className="ep-avatar-large" alt="Profile" />
              <label className="ep-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                Change Photo
              </label>
            </div>
          </div>

          <div className="ep-input-group">
            <label htmlFor="name">Edit Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ep-input"
              placeholder="Enter your name"
              required
            />
          </div>

          <button
            className="ep-save-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}