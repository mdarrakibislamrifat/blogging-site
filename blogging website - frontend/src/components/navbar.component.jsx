import { Link } from "react-router";
import logo from "../imgs/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="flex-none w-10">
        <img src={logo} alt="" className="w-fullgit branch -M main" />
      </Link>

      <div className="absolute w-full bg-white left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw]">
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-auto bg-grey p-4 pl-6 md:pr-6 rounded-full placeholder:text-dark-grey"
        />
        <i className="fi fi-rr-search"></i>
      </div>
    </nav>
  );
}
