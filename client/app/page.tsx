import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

async function getData() {
  const res = await fetch("http://localhost:8000/api/v1/tours");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Res ${res.status}`);
  }

  return res.json();
}

export default async function Home() {
  return (
    <main className={styles.main}>
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
    </main>
  );
}
