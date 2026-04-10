import styles from "./Request.module.css";
import { useState, useEffect } from "react";
import data from "./data.json";

function Request() {
  const [user, setUser] = useState(null); //state for the profile
  const [stats, setStats] = useState(null); // State to hold activity data
  const [request, setRequest] = useState([]);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/activity", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      // Fetch activityrow from the backend API
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => setRequest(data), []); //json data

  // useEffect(() => {
  //   console.log("called");
  //   fetch("http://localhost:5000/api/auth/Requests")       // fetch the requests from the backend API
  //     .then((res) => res.json())
  //     .then((data) => setRequest(data))
  //     .catch((err) => console.log(err));
  // }, []);

  const filteredRequests = request.filter(
    (req) =>
      req.RequestID.toLowerCase().includes(search.toLowerCase()) ||
      req.student.toLowerCase().includes(search.toLowerCase()) ||
      req.email.toLowerCase().includes(search.toLowerCase()) ||
      req.DocumentType.toLowerCase().includes(search.toLowerCase()) ||
      req.priority.toLowerCase().includes(search.toLowerCase()) ||
      req.issue_date.toLowerCase().includes(search.toLowerCase()),
  );

  function downloadExcel() {
    console.log("downlaod request");
    // add the download url of the backend

    fetch("http://localhost:5000/api/admin/requests/export", {
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

  useEffect(() => {
    setcurentPage(1);
  }, [search]); // make the search result return always to the first page

  /* the pagination */
  const [currentPage, setcurentPage] = useState(1);
  const perPage = 5; // nmbr of element to show per page
  const pagesPerGroup = 3; // make the array of list contain 4 buttons each time

  const Lastindex = currentPage * perPage;
  const Firstindex = Lastindex - perPage;

  const records = filteredRequests.slice(Firstindex, Lastindex); // the elements showing per page , it was Certificate.slice

  const numberofpages = Math.ceil(filteredRequests.length / perPage); // nmbr of pages we have
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, numberofpages);

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

  function downloadPDF(id) {
    fetch(`http://localhost:5000/api/admin/requests/${id}/download`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate-${id}.pdf`;

        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => console.log(err));
  }

  const [openMenu, setOpenMenu] = useState(null); // perform the action on status

  function updateStatus(id, newStatus) {
    //change the fetch url

    console.log("active demande");

    fetch(`http://localhost:5000/api/admin/requests/${id}/status`, {
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
        const updated = request.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c,
        );

        setRequest(updated);
        setOpenMenu(null);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles["main-content"]}>
      <div className={styles.login}>
        <h4>Requests</h4>
        <div className={styles.info}>
          <div className={styles.subinfo}>
            <h4>{user ? user.name : "guest"}</h4>{" "}
            <p>{user ? user.email : "guest25@ensta.edu.dz"}</p>
          </div>
          <img src={user?.avatar || "/totalcertaficates.png"} alt="ava" />
        </div>
      </div>

      <div className={styles.search}>
        <div className={styles.title}>
          <div>
            <h3>Document Requests</h3>
            <p>Review and manage student document submissions.</p>
          </div>

          <div className={styles.searchNav}>
            <img src="/searchbar.png" alt="search" />
            <input
              className={styles.look}
              type="search"
              name="search"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>

        <div className={styles.edit}>
          <img src="/dwnld.png" alt="search" />
          <button onClick={downloadExcel}>Export Excel</button>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles["Total-Requests"]}>
          <div>
            <img src="/TotalRequests.png" alt="TotalRequests" />
            <p>{stats ? stats.TotalRequests.percentage : "..."}</p>
          </div>
          <h5>Total Requests</h5>
          <h2>{stats ? stats.TotalRequests.number : "..."}</h2>{" "}
          {/*Display Total Requests from stats or show "..." if stats is not loaded yet*/}
        </div>

        <div className={styles["Pending-Approval"]}>
          <div>
            <img src="/PendingApproval.png" alt="PendingApproval" />
            <p>{stats ? stats.pendingApproval.percentage : "..."}</p>
          </div>
          <h5>Pending Approval</h5>
          <h2>{stats ? stats.pendingApproval.number : "..."}</h2>{" "}
          {/*Display pending approval requests from stats or show "..." if stats is not loaded yet*/}
        </div>

        <div className={styles["Approved"]}>
          <div>
            <img src="/Approved.png" alt="Approved" />
            <p>{stats ? stats.Approved.percentage : "..."}</p>
          </div>
          <h5>Approved</h5>
          <h2>{stats ? stats.Approved.number : "..."}</h2>{" "}
          {/*Display Approved requestsfrom stats or show "..." if stats is not loaded yet*/}
        </div>
        <div className={styles["Rejected"]}>
          <div>
            <img src="/Rejected.png" alt="Rejected" />
            <p>{stats ? stats.Rejected.percentage : "..."}</p>
          </div>
          <h5>Rejected</h5>
          <h2>{stats ? stats.Rejected.number : "..."}</h2>{" "}
          {/*Display Rejected requests from stats or show "..." if stats is not loaded yet*/}
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.countainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.line}>
                <th className={styles.colu}>Request ID</th>
                <th className={styles.colu}>Student</th>
                <th className={styles.colu}>Document Type</th>
                <th className={styles.colu}>Priority</th>
                <th className={styles.colu}>Submitted</th>
                <th className={styles.colu}>upload</th>
                <th className={styles.colu}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((req) => (
                  <tr className={styles.line} key={req.id}>
                    <td className={styles.column}>{req.RequestID}</td>
                    <td className={styles.column}>
                      <div className={styles.leftside}>
                        <span className={styles.student}>{req.student} </span>
                        <span className={styles.email}>{req.email} </span>
                      </div>
                    </td>
                    <td className={styles.column}>
                      {" "}
                      <span className={styles.docum}>{req.DocumentType}</span>
                    </td>
                    <td className={styles.column}>
                      <span
                        className={`${styles.priority} ${req.priority.toLowerCase() === "normal" ? styles.normal : styles.urgent}`}
                      >
                        {" "}
                        {req.priority}
                      </span>
                    </td>
                    <td className={styles.column}>
                      <span className={styles.issue_date}>
                        {" "}
                        {req.issue_date}{" "}
                      </span>
                    </td>

                    <td className={styles.column}>
                      <div className={styles.uploadcontainer}>
                        <button
                          className={styles.upload}
                          onClick={() => downloadPDF(req.RequestID)}
                        >
                          {" "}
                          &#10515; upload
                        </button>
                      </div>
                    </td>
                    <td className={styles.column}>
                      <div className={styles.actions}>
                        <span
                          className={styles.dots}
                          onClick={() =>
                            setOpenMenu(openMenu === req.id ? null : req.id)
                          }
                        >
                          {" "}
                          ⋮{" "}
                        </span>
                        {openMenu === req.id && (
                          <div className={styles.menu}>
                            <button
                              onClick={() => updateStatus(req.id, "approved")}
                            >
                              {" "}
                              approve
                            </button>{" "}
                            <button
                              onClick={() => updateStatus(req.id, "rejected")}
                            >
                              {" "}
                              reject
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

export default Request;
