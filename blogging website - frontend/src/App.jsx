import { Route, Routes } from "react-router";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect } from "react";
import { lookInSession } from "./common/session";
import { useState } from "react";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState();

  useEffect(() => {
    const userInSession = lookInSession("user");

    if (userInSession) {
      setUserAuth(JSON.parse(userInSession));
    } else {
      setUserAuth(null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
