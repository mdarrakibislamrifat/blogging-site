import { Link } from "react-router";
import AnimationWrapper from "../common/page-animation";
import { UserContext } from "../App";
import { useContext } from "react";
import { removeFromSession } from "../common/session";

export default function UserNavigationPanel() {
  const { userAuth, setUserAuth } = useContext(UserContext);
  const { username } = userAuth || {};

  const signOutUser = (e) => {
    e.stopPropagation();
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };

  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute right-0 border border-grey w-60 duration-200 user-nav-panel">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          Write
        </Link>
        <Link to={`/user/${username}`} className="link pl-8 py-4">
          Profile
        </Link>
        <Link to={"/dashboard/blog"} className="link pl-8 py-4">
          Dashboard
        </Link>
        <Link to={"/settings/edit-profile"} className="link pl-8 py-4">
          Settings
        </Link>
        <span className="absolute border-t border-grey w-[100%"></span>
        <button
          className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
          onClick={signOutUser}
          onBlur={(e) => e.preventDefault()}
        >
          <h1 className="font-bold text-xl mg-1">Sign Out</h1>
          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
}
