import { Outlet } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";

export const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
};
