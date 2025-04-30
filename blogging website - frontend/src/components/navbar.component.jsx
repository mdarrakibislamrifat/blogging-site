import { Link, Outlet } from "react-router";
import logo from "../imgs/logo.png";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";

export default function Navbar() {
  const [searchBoxVisibility, setSeachBoxVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { userAuth } = useContext(UserContext);

  useEffect(() => {
    if (userAuth !== undefined) {
      setIsLoading(false);
    }
  }, [userAuth]);

  if (isLoading) {
    return null; // Or a spinner if you want to show loading
  }

  const { access_token, profile_img } = userAuth || {};

  return (
    <>
      <nav
        className="navbar"
        key={userAuth ? userAuth.access_token : "no-user"}
      >
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="Logo" className="w-full" />
        </Link>

        <div
          className={
            "absolute w-full bg-white left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto" +
            (searchBoxVisibility ? " show" : " hide") +
            " md:opacity-100 md:pointer-events-auto"
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
          />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSeachBoxVisibility((currentVal) => !currentVal)}
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>

          <Link className="hidden md:flex gap-2" to="/editor">
            <i className="fi fi-rr-file-edit"></i>
            Write
          </Link>

          {access_token ? (
            <>
              <Link to="/dashboard/notification">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rs-bell text-2xl block mt-1"></i>
                </button>
              </Link>

              <div className="relative">
                <button className="w-12 h-12 mt-1">
                  <img
                    src={profile_img}
                    className="w-full h-full object-cover rounded-full"
                    alt="User"
                  />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
}
