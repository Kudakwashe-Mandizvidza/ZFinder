import React from "react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile">
      <div className="profileWrapper">
        <img className="profileCover" src="assets/cover.jpg" alt="coverphoto" />
        <img
          className="profilePhoto"
          src="assets/hydrogen.jpg"
          alt="profile pic"
        />
      </div>
      <div className="profileInfo">
        <h4 className="profileInfoName">Name</h4>
        <span className="profileInfoNameSpan">Hydrogen Bond</span>
        <h4 className="profileInfoName">About</h4>
        <span className="profileInfoNameSpan">
          I am a software developer who likes travelling....
        </span>
      </div>
    </div>
  );
};

export default Profile;
