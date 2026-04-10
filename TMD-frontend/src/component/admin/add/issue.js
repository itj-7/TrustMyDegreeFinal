import styles from "./issue.module.css";
import { useState } from "react";
import { useEffect } from "react";

function Issue() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ date: "", file: null });
  const [fileKey, setFileKey] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }) // fetch the user who logged in
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.log(err));
  }, []);

  // handle all rhe changes
  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleReset() {
    setFormData({ date: "", file: null });
    setFileKey((k) => k + 1); // remounts the file input, clearing it
  }

  //submite function
  function handleSubmit(e) {
    e.preventDefault();
    console.log("form submited");

    const form = new FormData();
    form.append("date", formData.date);
    form.append("file", formData.file);

    fetch("http://localhost:5000/api/admin/certificates", {
      //change the api to the backend
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: form,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("SUCCESS:", data);
        alert("Certificates issued successfully");
        handleReset();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles["main-content"]}>
      <div className={styles.login}>
        <div className={styles.page}>
          <h4>Issue Certificate</h4>
        </div>
        <div className={styles.info}>
          <div className={styles.subinfo}>
            <h4>{user ? user.name : "guest"}</h4>
            <p>{user ? user.email : "guest25@ensta.edu.dz"}</p>
          </div>
          <img src={user?.avatar || "/totalcertaficates.png"} alt="avatar" />
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.top}>
            <img className={styles.a} src="/greenissue.png" alt="green" />
            <div className={styles.hp}>
              <h3>ISSUE A NEW CERTIFICATE</h3>
              <p>CertiChain Academic Authentication Platform</p>
            </div>
            <img className={styles.f} src="/vector.png" alt="vect" />
          </div>

          <form className={styles.send} onSubmit={handleSubmit}>
            <div className={styles.firstrow}>
              <div className={styles.slach}>
                <img src="/slach.png" alt="slash" />
                <h2 className={styles.h2}>Certificate Details</h2>
              </div>

              <div className={styles.date}>
                <label>Date of Completion</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.slach}>
                <img src="/slach.png" alt="slash" className={styles.img} />
                <h2 className={styles.h2}>Export excel file</h2>
              </div>
            </div>

            <div className={styles.sndrow}>
              <div className={styles.upload}>
                <img src="/hand.png" alt="file" className={styles.hand} />
                <label className={styles.lab}> Drag & drop xlxs.file</label>
                <input
                  className={styles.file}
                  type="file"
                  name="file"
                  key={fileKey}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.buts}>
              <button
                className={styles.cancle}
                type="button"
                onClick={handleReset}
              >
                Cancel
              </button>

              <input
                className={styles.issue}
                type="submit"
                value="ISSUE CERTIFICATE"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Issue;
