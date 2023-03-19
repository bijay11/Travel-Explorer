import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { getAllTours } from "@/fetchData/getAllTours";
import { GetAllTours } from "./components/GetAllTours/GetAllTours";

export default async function Home() {
  const tours = await getAllTours();
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
      </div>

      <ul className={styles.panelContainer}>
        {documents.map((document: any) => (
          <li key={document._id}>
            <GetAllTours document={document} />
          </li>
        ))}
      </ul>
    </main>
  );
}
