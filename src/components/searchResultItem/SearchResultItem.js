import React from "react";
import "./SearchResultItem.scss";
import DefaultDisplayImage from "../../assets/user.png";

const SearchResultItem = ({ user, onSelect }) => {
  return (
    <div onClick={() => onSelect(user)} className="searchResultUser">
      <img src={user?.photoURL ? user?.photoURL : DefaultDisplayImage} />
      <div className="SearchResultUserInfo">
        <span>{user?.displayName}</span>
      </div>
    </div>
  );
};

export default SearchResultItem;
