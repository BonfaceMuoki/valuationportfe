import React from "react";
import LogoLight2x from "../../images/logo2x.png";
import LogoDark2x from "../../images/logo-dark2x.png";
import {Link} from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
     <h4>ISK VDS</h4>
      {/* <img className="logo-light logo-img" src={LogoLight2x} alt="logo" />
      <img className="logo-dark logo-img" src={LogoDark2x} alt="logo" /> */}
    </Link>
  );
};

export default Logo;
