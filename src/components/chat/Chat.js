import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";

import "./Chat.scss";
// import Cam from "../../assets/cam.png";
// import Add from "../../assets/add.png";
// import More from "../../assets/more.png";
import Messages from "../messages/Messages";
import Input from "../input/Input";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  // const { width, height } = useSelector((state) => state.dimension);
  // // if (width > 1000) {
  // //   navigate("/");
  // // }
  // const navigate = useNavigate();

  // const [dimensions, setDimensions] = useState({
  //   height: window.innerHeight,
  //   width: window.innerWidth,
  // });

  // useEffect(() => {
  //   function handleResize() {
  //     setDimensions({
  //       height: window.innerHeight,
  //       width: window.innerWidth,
  //     });
  //   }

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // if (dimensions.width > 1000) navigate("/");

  const { user, chatId } = useSelector((state) => state.chat);
  if (!user) navigate("/");

  return (
    <div className="chat">
      {!user && (
        <div className="initialMessage">start chatting with someone...👋</div>
      )}
      {user && (
        <>
          <div className="chatInfo">
            <div>{user?.displayName}</div>
            {/* <div className="chatIcons">
              <img src={Cam} />
              <img src={Add} />
              <img src={More} />
            </div> */}
          </div>
          <Messages user={user} chatId={chatId} />
          <Input user={user} chatId={chatId} />
        </>
      )}
    </div>
  );
};

export default Chat;
