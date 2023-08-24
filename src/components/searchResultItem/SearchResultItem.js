import React from "react";
import "./SearchResultItem.scss";

const SearchResultItem = ({ user, onSelect }) => {
  return (
    <div onClick={() => onSelect(user)} className="searchResultUser">
      <img src={user?.photoURL} />
      <div className="SearchResultUserInfo">
        <span>{user?.displayName}</span>
      </div>
    </div>
  );
};

export default SearchResultItem;
