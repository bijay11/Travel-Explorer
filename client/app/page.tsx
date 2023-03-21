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
    <main className="container-fluid">
      <div className={styles.mainHeader}>
        <h4>Travel Explorer</h4>
        <div>
          <Link href="/signup" className="btn btn-outline-warning m-1">
            Sign Up
          </Link>
          <Link href="/login" className="btn btn-outline-info m-1">
            Login
          </Link>
        </div>
      </div>

      <h4 className={styles.heading}>All Tours ({tours.results})</h4>

      <div className="row">
        {documents.map((document: any) => (
          <div key={document._id} className="col-md-4 mb-4">
            <GetAllTours document={document} />
          </div>
        ))}
      </div>
    </main>
  );
}
