import React, { useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import LoadingComponent from "./components/Loading";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage";
import LogIn from "./pages/LogIn";
import ProtectedPage from "./pages/ProtectedPage";
import Signup from "./pages/Signup";
import NormalRoute from "./routing-components/NormalRoute";
import ProtectedRoute from "./routing-components/ProtectedRoute";
import { getLoggedIn, logout } from "./services/auth";
import * as PATHS from "./utils/paths";

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return setIsLoading(false);
    }
    getLoggedIn(accessToken).then((res) => {
      if (!res.status) {
        return setIsLoading(false);
      }
      setUser(res.data.user);
      setIsLoading(false);
    });
  }, []);

  function handleLogout() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setUser(null);
      return setIsLoading(false);
    }
    setIsLoading(true);
    logout(accessToken).then((res) => {
      if (!res.status) {
        // deal with error here
        console.error("Logout was unsuccessful: ", res);
      }
      localStorage.removeItem("accessToken");
      setIsLoading(false);
      return setUser(null);
    });
  }

  function authenticate(user) {
    setUser(user);
  }

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <div className="App">
      <Navbar handleLogout={handleLogout} user={user} />
      <Switch>
        <NormalRoute exact path={PATHS.HOMEPAGE} component={HomePage} />
        <NormalRoute
          exact
          path={PATHS.SIGNUPPAGE}
          authenticate={authenticate}
          component={Signup}
        />
        <NormalRoute
          exact
          path={PATHS.LOGINPAGE}
          authenticate={authenticate}
          component={LogIn}
        />
        <ProtectedRoute
          exact
          path={PATHS.PROTECTEDPAGE}
          component={ProtectedPage}
          user={user}
        />
      </Switch>
    </div>
  );
}
