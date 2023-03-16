import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Panel } from "./components/Panel";

async function getData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tours`
  );
  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const tours = await getData();
  if (!tours) return null;

  const {
    data: { documents },
  } = tours;

  return (
    <main className={styles.main}>
      <div className={styles.mainHeader}>
        <h4>Travel Explorer</h4>
        <div>
          <Link
            href="/signup"
            className={`${styles.authButtons} ${styles.signUpBtn}`}
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className={`${styles.authButtons} ${styles.loginBtn}`}
          >
            Login
          </Link>
        </div>
        <ul>
          {documents.map((document: any) => {
            console.log("test document", document);
            return (
              <li key={document._id}>
                <Panel document={document} />
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
