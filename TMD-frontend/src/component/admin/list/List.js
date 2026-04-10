import styles from "./List.module.css";
import { useEffect } from "react";
import { useState } from "react";
import tempo from "./tempo.json";

function List() {
  const [user, setUser] = useState(null);
  const [certaficate, setCertaficate] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }) // fetch the user who logged in
      .then((resp) => resp.json())
      .then((data) => setUser(data))
      .catch((err) => console.log(err));
  }, []);

  // useEffect(() => {
  //   console.log("called");

  //   fetch("http://localhost:5000/api/auth/certificates", {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   })       // fetch the certaficate
  //     .then((resp) => resp.json())
  //     .then((data) => setCertaficate(data))
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    setCertaficate(tempo); // json data
  }, []);

  /* the search bar filter */
  const filteredCertificates = certaficate.filter(
    (cert) =>
      cert.student.toLowerCase().includes(search.toLowerCase()) ||
      cert.matricule.toLowerCase().includes(search.toLowerCase()) ||
      cert.type.toLowerCase().includes(search.toLowerCase()) ||
      cert.specialty.toLowerCase().includes(search.toLowerCase()) ||
      cert.status.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    setcurentPage(1);
  }, [search]); // make the search result return always to the first page

  //download the exel file
  function downloadExcel() {
    console.log("downlaod request");
    // add the download url of the backend

    fetch("http://localhost:5000/api/admin/certificates/export", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "certificates.xlsx";

        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => console.log(err));
  }

  /* the pagination */
  const [currentPage, setcurentPage] = useState(1);
  const perPage = 8; // nmbr of element to show per page
  const pagesPerGroup = 4; // make the array of list contain 4 buttons each time

  const Lastindex = currentPage * perPage;
  const Firstindex = Lastindex - perPage;

  const records = filteredCertificates.slice(Firstindex, Lastindex); // the elements showing per page , it was Certificate.slice

  const numberofpages = Math.ceil(filteredCertificates.length / perPage); // nmbr of pages we have
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, numberofpages);

  // const numbers = [...Array(numberofpages + 1).keys()].slice(1); // the list to click to change pages

  const numbers = [];
  for (let i = startPage; i <= endPage; i++) {
    numbers.push(i);
  }

  function prevPage() {
    // if (currentPage !== 1) {
    //   setcurentPage(currentPage - 1);
    // }

    if (startPage > 1) {
      setcurentPage(startPage - pagesPerGroup);
    }
  }

  function changeCurrentPage(id) {
    setcurentPage(id);
  }

  function nextPage() {
    if (endPage < numberofpages) {
      setcurentPage(endPage + 1);
    }
  }

  const [openMenu, setOpenMenu] = useState(null); // perform the action on status

  function updateStatus(id, newStatus) {
    //change the fetch url

    console.log("active demande");

    fetch(`http://localhost:5000/api/admin/certificates/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        // update the UI after backend confirms
        const updated = certaficate.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c,
        );

        setCertaficate(updated);
        setOpenMenu(null);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles["main-content"]}>
      <div className={styles.login}>
        <div className={styles.page}>
          <h4>Certificate List</h4>
        </div>
        <div className={styles.info}>
          <div className={styles.subinfo}>
            <h4>{user ? user.name : "guest"}</h4>
            <p>{user ? user.email : "guest25@ensta.edu.dz"}</p>
          </div>
          <img src={user?.avatar || "/totalcertaficates.png"} alt="avatar" />
        </div>
      </div>

      <div className={styles.search}>
        <div className={styles.searchNav}>
          <img src="/searchbar.png" alt="search" />
          <input
            className={styles.look}
            type="search"
            name="search"
            placeholder="Search by name, registration number…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        <div className={styles.edit}>
          <img src="/downloadsign.png" alt="search" />
          <button onClick={downloadExcel}>Export Excel</button>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.countainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.row}>
                <th className={styles.colu}>ID</th>
                <th className={styles.colu}>Student</th>
                <th className={styles.colu}>Matricule</th>
                <th className={styles.colu}>Type</th>
                <th className={styles.colu}>Specialty</th>
                <th className={styles.colu}>Issue Date</th>
                <th className={styles.colu}>Statut</th>
                <th className={styles.colu}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((cert) => (
                  <tr className={styles.row} key={cert.id}>
                    <td className={styles.column}>{cert.Id}</td>
                    <td className={styles.column}>
                      <img src="/students.jpg" alt="student" />
                      <span className={styles.student}>{cert.student} </span>
                    </td>
                    <td className={styles.column}>{cert.matricule}</td>
                    <td className={styles.column}>
                      <span className={styles.type}>{cert.type}</span>
                    </td>
                    <td className={styles.column}>
                      <span className={styles.specialty}>{cert.specialty}</span>
                    </td>
                    <td className={styles.column}>{cert.issue_date}</td>
                    <td className={styles.column}>
                      <span
                        className={`${styles.status} ${cert.status.toLowerCase() === "active" ? styles.active : styles.revoked}`}
                      >
                        {" "}
                        {cert.status}
                      </span>
                    </td>

                    <td className={styles.column}>
                      <div className={styles.actions}>
                        <span
                          className={styles.dots}
                          onClick={() =>
                            setOpenMenu(openMenu === cert.id ? null : cert.id)
                          }
                        >
                          {" "}
                          ⋮{" "}
                        </span>
                        {openMenu === cert.id && (
                          <div className={styles.menu}>
                            <button
                              onClick={() => updateStatus(cert.id, "Revoked")}
                            >
                              {" "}
                              Revoke
                            </button>{" "}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className={styles.row}>
                  {" "}
                  <td colSpan="7">No data found</td>{" "}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className={styles.arr}>
          <div className={styles.pagination}>
            <div className={styles["page-item"]}>
              <button className={styles.change} onClick={prevPage}>
                prev
              </button>
            </div>

            {numbers.map((n, i) => (
              <div
                className={`${styles["page-item"]} ${currentPage === n ? styles.pageActive : ""}`}
                key={i}
              >
                <button
                  className={styles["page-link"]}
                  onClick={() => changeCurrentPage(n)}
                >
                  {n}
                </button>
              </div>
            ))}

            <div className={styles["page-item"]}>
              <button className={styles.change} onClick={nextPage}>
                next
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default List;
