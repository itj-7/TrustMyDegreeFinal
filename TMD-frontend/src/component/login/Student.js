import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Student() {
  const navigate = useNavigate();
  //the authentication check
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     navigate("/", { replace: true });
  //   }
  // }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Student;
