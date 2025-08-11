import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function MainLayout() {
  const { pathname } = useLocation();
  const isMainPage = pathname === "/main";

  return (
    <div>
      <h1>Movies - Subscriptions Web Site</h1>
      <Navbar />

      {isMainPage && <h2>Welcome! Select a section.</h2>}

      <div style={isMainPage ? {} : layoutStyle}>
        <Outlet />
      </div>
    </div>
  );
}

const layoutStyle = {
  border: "4px solid black",
  minHeight: "480px",
  width: "60%",
  maxWidth: "100%",
  minWidth: "400px",
  paddingLeft: "1%",
  marginTop: "0.7%",
  overflowX: "auto",
};

export default MainLayout;
