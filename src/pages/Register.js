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
  const [profileURL, setProfileURL] = useState(null);

  const [inpNameIsTouched, setInputNameIsTouched] = useState(false);
  const [inpEmailIsTouched, setInputEmailIsTouched] = useState(false);
  const [inpPasswordIsTouched, setInputPasswordIsTouched] = useState(false);

  // console.log(img);
  const validateDispayName = (name) => {
    if (name.length > 0) return true;
    return false;
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePassword = (pass) => {
    if (pass.length >= 6) {
      return true;
    } else return false;
  };

  const isInputNameValid = !inpNameIsTouched || validateDispayName(inpName);
  const isInputEmailValid = !inpEmailIsTouched || validateEmail(inpEmail);
  const isInputPasswordValid =
    !inpPasswordIsTouched || validatePassword(inpPass);

  const disabled =
    !isInputNameValid || !isInputEmailValid || !isInputPasswordValid;

  // console.log(disabled);

  // const uploadImg = async (file) => {
  //   try {
  //     const storageRef = ref(storage, email);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log("Upload is " + progress + "% done");
  //         switch (snapshot.state) {
  //           case "paused":
  //             console.log("Upload is paused");
  //             break;
  //           case "running":
  //             console.log("Upload is running");
  //             break;
  //         }
  //       },
  //       (error) => {
  //         setSigningUp(false);
  //         setErr(true);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
  //           profileURL = downloadURL;
  //         });
  //       }
  //     );
  //   } catch (error) {
  //     setSigningUp(false);
  //     setErr(true);
  //   }
  // };

  const createNewUser = async (displayName, email, password, profilePicURL) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName,
        photoURL: profilePicURL,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: profilePicURL,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});

      setSigningUp(false);
      navigate("/");
    } catch (error) {
      setErr(true);
      setSigningUp(false);
      console.log(error);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    setSigningUp(true);

    const displayName = inpName;
    const email = inpEmail;
    const password = inpPass;
    const file = img;
    console.log(file);

    try {
      if (file) {
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
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              createNewUser(displayName, email, password, downloadURL);
            });
          }
        );
      } else {
        createNewUser(displayName, email, password, null);
      }
    } catch (error) {
      setSigningUp(false);
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className="logo">ChatterBOX</div>
        <form
          onSubmit={() => {
            if (disabled) return;
            submitHandler();
          }}
        >
          <div className="title">Register</div>
          <input
            className={!isInputNameValid ? "invalid" : ""}
            type="text"
            placeholder="Display name"
            onChange={(event) => setInpName(event.target.value)}
            onBlur={() => setInputNameIsTouched(true)}
            autoFocus
          />
          {!isInputNameValid && (
            <div className="errorMessage">Enter Valid Name</div>
          )}
          <input
            className={!isInputEmailValid ? "invalid" : ""}
            type="email"
            placeholder="email"
            onBlur={() => setInputEmailIsTouched(true)}
            onChange={(event) => setInpEmail(event.target.value)}
          />
          {!isInputEmailValid && (
            <div className="errorMessage">Enter Valid Email</div>
          )}
          <input
            className={!isInputPasswordValid ? "invalid" : ""}
            type="password"
            placeholder="password"
            onBlur={() => setInputPasswordIsTouched(true)}
            onChange={(event) => setInpPass(event.target.value)}
          />
          {!isInputPasswordValid && (
            <div className="errorMessage">
              Password must contain at least 6 characters{" "}
            </div>
          )}
          <div className="labelWithSelectedImg">
            <label htmlFor="file">
              <img className="avatarIcon" src={addAvatar} />
              <span>Add Profile Picture</span>
            </label>
            {img && <div className="selectedImg">{img.name}</div>}
          </div>
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />

          {!signingUp && (
            <button
              className={disabled ? "disabled" : ""}
              onClick={submitHandler}
              disabled={disabled}
            >
              Sign Up
            </button>
          )}
          {signingUp && (
            <div className="processing">
              <Spinner initial={true} />
              <p>signing up...</p>
            </div>
          )}
          {err && <div className="errorMessage">Something went wrong</div>}
        </form>
        <p>
          Do you have an account? <Link to="/Login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
