import React from "react";
import "./SearchResultItem.scss";

const SearchResultItem = ({ user, onSelect }) => {
  return (
    <div onClick={() => onSelect(user)} className="userChat">
      <img src={user?.photoURL} />
      <div className="userChatInfo">
        <span>{user?.displayName}</span>
      </div>
    </div>
  );
};

export default SearchResultItem;
