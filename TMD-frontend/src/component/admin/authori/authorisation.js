import styles from "./authorisation.module.css";
import { useState, useEffect } from "react";
import tempo from "./admins.json";

function Authorisations() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }) // fetch the user who logged in
      .then((resp) => resp.json())
      .then((data) => {
        setUser(data);
        if (data.role !== "superadmin") {
          alert("Access denied");
          window.location.href = "/admin/dashboard";
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setAdmins(tempo);
  }, []);

  //   useEffect(()=>{
  //       fetch("http://localhost:5000/api/admin/admins", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       })
  //       .then((resp)=>resp.json())
  //       .then((data)=>setAdmins(data))
  //       .catch((err)=>window.alert(err));
  //   },[])

  function addAdmin(e) {
    e.preventDefault();

    fetch("http://localhost:5000/api/admin/addAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ email }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setAdmins((prev) => [...prev, { id: Date.now(), email }]);
        setEmail("");
      })
      .catch((err) => window.alert(err));
  }

  function deleteAdmin(id) {
    fetch(`http://localhost:5000/api/admin/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        // remove admin from UI
        setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      })
      .catch((err) => window.alert(err));
  }

  return (
    <div className={styles["main-content"]}>
      <div className={styles.login}>
        <div className={styles.page}>
          <h4>Manage admins</h4>
        </div>
        <div className={styles.info}>
          <div className={styles.subinfo}>
            <h4>{user ? user.name : "guest"}</h4>
            <p>{user ? user.email : "guest25@ensta.edu.dz"}</p>
          </div>
          <img src={user?.avatar || "/totalcertaficates.png"} alt="avatar" />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.title}>
            <h3>Admin Management</h3>
            <p>Manage admins and their platform access</p>
          </div>

          <form className={styles.search} onSubmit={addAdmin}>
            <div>
              <img src="/imgadm.png" alt="adm" />
              <input
                type="email"
                placeholder="admin email..."
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <input type="submit" value="add admin" />
          </form>

          <div className={styles.scroll}>
            {admins.length > 0 ? (
              admins.map((adm) => (
                <div className={styles.admin} key={adm.id}>
                  <div className={styles.left}>
                    <img src="/email.png" alt="pic" />
                    <h3>{adm.email}</h3>
                  </div>
                  <div className={styles.right}>
                    <img
                      src="/delete.png"
                      alt="delete"
                      onClick={() => deleteAdmin(adm.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <h3>No admins found</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Authorisations;
