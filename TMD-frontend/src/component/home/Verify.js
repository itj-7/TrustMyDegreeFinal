import styles from "./Verify.module.css";
import { useState } from "react";

function Verify() {
  const [code, setCode] = useState("");

  function handleVerify(e) {
    console.log(code);
    e.preventDefault();

    fetch("http://localhost:5000/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => window.alert(err));
  }

  return (
    <div className={styles["main-content"]}>
      <h1>
        Verify Your Diploma <span> Instantly </span>
      </h1>
      <p>
        Enter a diploma ID, QR code, or graduate email to check authenticity
        against our global blockchain ledger.
      </p>

      <form className={styles.verify} onSubmit={handleVerify}>
        <div className={styles.info}>
          <h6>ID du Certificat</h6>
          <div className={styles.inputBox}>
            <img src="/inputee.png" alt="inputee" />
            <input
              type="text"
              placeholder="#1847"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <input
          type="submit"
          value="Verify Certificate ➜"
          className={styles.submit}
        />
      </form>

      <div>
        <div className={styles.online}>
          <img src="dot.png" alt="dots" />
          <h6>Network Online</h6>
        </div>

        <div className={styles.secure}>
          <img src="/secure.png" alt="secure" />
          <h6>256-bit SSL Secure </h6>
        </div>
      </div>
    </div>
  );
}

export default Verify;
