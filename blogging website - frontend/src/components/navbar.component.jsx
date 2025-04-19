import { Link } from "react-router";
import logo from "../imgs/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="flex-none w-10">
        <img src={logo} alt="" />
      </Link>
    </nav>
  );
}
