import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// import Modal from "../../components/modal/Modal";

const Img = ({ src, className }) => {
  // const [showPic, setShowPic] = useState(false);
  return (
    <LazyLoadImage
      className={className || ""}
      alt=""
      effect="blur"
      src={src}
      // onClick={() => setShowPic(true)}
    />
  );
};

export default Img;
