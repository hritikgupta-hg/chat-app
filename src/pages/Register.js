import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import "./style.scss";
import addAvatar from "../assets/addAvatar1.png";
import { auth, storage, db } from "../firebase";
import Spinner from "../components/spinner/Spinner";

const Register = () => {
  const [signingUp, setSigningUp] = useState(false);
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [img, setImg] = useState(null);
  const [inpName, setInpName] = useState("");
  const [inpEmail, setInpEmail] = useState("");
  const [inpPass, setInpPass] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();

    setSigningUp(true);

    const displayName = inpName;
    const email = inpEmail;
    const password = inpPass;
    const file = img;

    try {
      const storageRef = ref(storage, email);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setSigningUp(false);
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // console.log(downloadURL);

            try {
              const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
              );

              await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              });

              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL: downloadURL,
              });

              await setDoc(doc(db, "userChats", res.user.uid), {});

              setSigningUp(false);
              navigate("/");
            } catch (error) {
              setErr(true);
              setSigningUp(false);
              console.log(error);
            }
          });
        }
      );
    } catch (error) {
      setSigningUp(false);
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className="logo">Chat App</div>
        <div className="title">Register</div>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Name"
            onChange={(event) => setInpName(event.target.value)}
          />
          <input
            type="email"
            placeholder="email"
            onChange={(event) => setInpEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(event) => setInpPass(event.target.value)}
          />

          <div className="labelWithSelectedImg">
            <label htmlFor="file">
              <img className="avatarIcon" src={addAvatar} />
              <span>Add Profile Picture</span>
            </label>
            {<div className="selectedImg">{img?.name}</div>}
          </div>

          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />

          {!signingUp && <button onClick={submitHandler}>Sign Up</button>}
          {signingUp && (
            <div className="processing">
              <Spinner initial={true} />
              <p>signing up...</p>
            </div>
          )}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Do you have an account? <Link to="/Login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
