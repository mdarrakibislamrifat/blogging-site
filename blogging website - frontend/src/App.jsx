import { Route, Routes } from "react-router";
import Navbar from "./components/navbar.component";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="signin" element={"Sign in page"} />
        <Route path="signup" element={"Sign Up page"} />
      </Route>
    </Routes>
  );
};

export default App;
