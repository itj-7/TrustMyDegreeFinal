import styles from "./DashboardStudent.module.css";
import { useState, useEffect } from "react";
import diplome from "./diplome.json";
import { Link, useNavigate } from "react-router-dom";
function DashboardStudent() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [diplomes, setDiplomes] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/student/login")
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/student/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err));
  }, []);

  const filteredDiplomes = diplomes.filter(
    (dip) =>
      dip.name.toLowerCase().includes(search.toLowerCase()) ||
      dip.type.toLowerCase().includes(search.toLowerCase()) ||
      dip.date.toLowerCase().includes(search.toLowerCase()) ||
      dip.code.toLowerCase().includes(search.toLowerCase()) ||
      dip.state.toLowerCase().includes(search.toLowerCase()),
  );

  // useEffect(() => {
  //   fetch("http://localhost:5000/api/student/diplomes")
  //     .then((response) => response.json())
  //     .then((data) => setDiplomes(data))
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    setDiplomes(diplome);
  }, []);

  function downloadPDF(url, name) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const navigate = useNavigate();

  // log out function
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth
    navigate("/", { replace: true }); //remove the browser back button open paltform.
  };

  return (
    <div className={styles["main-content"]}>
      <nav className={styles.hello}>
        <div className={styles.title}>
          <h3>Hello {user ? user.name : "guest"}👋</h3>
          <p>View and share your blockchain-verified academic certificates</p>
        </div>

        <div className={styles.information}>
          {/* total certificate */}
          <div className={styles.inf}>
            <img
              src="/studenttotalcertificates.png"
              alt="studenttotalcertificates"
            />
            <div>
              <h5>Total Certificates</h5>
              <p>{stats ? stats.total_certificates : "..."}</p>
            </div>
          </div>

          {/* active certaficate */}
          <div className={styles.inf}>
            <img
              src="/studentactivecertificates.png"
              alt="studentactivecertificates"
            />
            <div>
              <h5>Active Certificates</h5>
              <p>{stats ? stats.active_certificates : "..."}</p>
            </div>
          </div>

          {/* last issued */}
          <div className={styles.inf}>
            <img src="/studentlastissued.png" alt="studentlastissued" />
            <div>
              <h5>Last Issued</h5>
              <p>{stats ? stats.last_issued : "..."}</p>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.dashboard}>
        <div className={styles.left}>
          <div className={styles.search}>
            <h3>My Certificates</h3>
            <div>
              <img src="/searchbar.png" alt="searching" />
              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.diplomes}>
            {filteredDiplomes.length > 0
              ? filteredDiplomes.map((dip) => (
                  <div key={dip.id} className={styles["diplome-div"]}>
                    <div className={styles.type}>
                      {/* <img src={dip.image} alt={dip.name} /> */}
                      <div>
                        <h4>{dip.name}</h4>
                        <p>{dip.type}</p>
                      </div>
                    </div>
                    <div className={styles.date}>
                      <div>
                        <div className={styles.calander}>
                          <img src="/calander.png" alt="calander" />
                          <h5>{dip.date}</h5>
                        </div>
                        <div className={styles.chain}>
                          <img src="/chain.png" alt="chain" />
                          <p>{dip.code}</p>
                        </div>
                      </div>

                      <span
                        className={`${styles.state} ${dip.state.toLowerCase() === "verified" ? styles.verified : styles.notveri}`}
                      >
                        {dip.state} on the Blockchain
                      </span>
                    </div>

                    <div className={styles.button}>
                      <img src="/downloadsign.png" alt="dwnld" />
                      <button
                        type="button"
                        onClick={() => downloadPDF(dip.pdf, dip.name)}
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))
              : "nothing to show"}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.request}>
            <img src="/add.png" alt="adding" />
            <h3>Request documents</h3>
            <Link to="/student/RequestStudent">
              <button>Request now</button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.policy}>
        <h4>
          © 2026 TrustMyDegree ENSTA - Verix Solution for Decentralized Academic
          Management.
        </h4>
      </div>

      <div className={styles.login}>
        <div className={styles.image}>
          <img
            src="/setting.png"
            alt="setting"
            onClick={() => setOpenMenu(!openMenu)}
            className={openMenu ? styles.rotate : ""}
          />
          {openMenu && (
            <div className={styles.menu}>
              <ul className={styles.list}>
                <li>
                  <Link to="/student/Settings">Parameters</Link>
                </li>
                <li>
                  <Link to="/student/RequestStudent">Request</Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className={styles.info}>
          <img
            src={user?.avatar || "/totalcertaficates.png"}
            alt="ava"
            className={styles.student}
          />
          <div className={styles.subinfo}>
            <h4>{user ? user.name : "guest"}</h4>{" "}
            <p>{user ? user.id : "fake id"}</p>
          </div>
          <img
            src="/exit.png"
            alt="exit"
            onClick={handleLogout}
            className={styles.exit}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardStudent;
