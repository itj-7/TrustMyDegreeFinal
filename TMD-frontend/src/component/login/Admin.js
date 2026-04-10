import styles from "./admin.module.css";
import Navbar from "../admin/Navbar";
import { Outlet,useNavigate } from "react-router-dom"; //my mistake here
import { useEffect } from "react";
function Admin() {
  const navigate = useNavigate();

  //the authentication check
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     navigate("/", { replace: true });
  //   }
  // }, []);

  return (
    <div className={styles.admin}>
      <div className={styles.nav}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Outlet />

        {/* <AddCertificate /> */}
        {/* <CertificateList /> */}
        {/* <Statistics /> */}
      </div>
    </div>
  );
}

export default Admin;
