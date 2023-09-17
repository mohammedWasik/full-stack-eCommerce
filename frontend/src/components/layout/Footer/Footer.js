import React from "react";
import playstore from "../../../images/playstore.png";
import Appstore from "../../../images/Appstore.png";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { SiGmail } from "react-icons/si";
import "./Footer.css";
const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4 className="uppercase text-2xl">DOWNLOAD OUR APP</h4>
        <p className="capitalize">
          Download App for Android and IOS mobile phone
        </p>
        <img src={playstore} alt="playstore" />
        <img src={Appstore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>Random Shop</h1>
        <p>Copyrights 2023 &copy; Mohammed Wasik</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a
          href="https://www.linkedin.com/in/mohammed-wasik-276928164"
          target="_blank"
          rel="noreferrer">
          <AiFillLinkedin className="cursor-pointer hover:text-linkedIn" />
        </a>
        <a
          href="https://github.com/mohammedWasik"
          target="_blank"
          rel="noreferrer">
          <AiFillGithub
            className="cursor-pointer hover:text-github
          dark:hover:text-white"
          />
        </a>
        <a
          href="mailto:mashrukmohammedwasik@gmail.com?"
          target="_blank"
          rel="noreferrer">
          <SiGmail className="cursor-pointer hover:text-gmail" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
