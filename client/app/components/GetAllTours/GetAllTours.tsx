import Link from "next/link";
import {
  MdFlagCircle,
  MdLocationOn,
  MdCalendarMonth,
  MdHiking,
  MdTimelapse,
  MdGroup,
} from "react-icons/md";
import styles from "./getAllTours.module.css";

export function GetAllTours({ document }: any) {
  const [, month, , year] = new Date(document.startDates[0])
    .toString()
    .split(" ");

  return (
    <div className={`card ${styles.card}`}>
      <div className="card-body">
        <h5>{document.name}</h5>
        <div className={styles.bar}></div>
        <p>
          <span>
            <MdLocationOn size={28} color="#0099a8" />
            {document.startLocation.description}
          </span>
          <span>
            <MdCalendarMonth size={24} color="#0099a8" /> {`${month} ${year}`}
          </span>
        </p>

        <p>
          <span>
            <MdFlagCircle size={24} color="#0099a8" />{" "}
            {document.locations.length} stops
          </span>
          <span>
            <MdGroup size={24} color="#0099a8" /> {document.maxGroupSize} people
          </span>
        </p>

        <p>
          <span>
            <MdHiking size={24} color="#0099a8" /> {document.difficulty}
          </span>
          <span>
            <MdTimelapse size={24} color="#0099a8" /> {document.duration} days
          </span>
        </p>
        <hr className={styles.divider} />
        <div className={styles.detail}>
          <div>
            <p>
              <span>${document.price}</span>
            </p>
            <p>
              <span>
                {document.ratingsAverage} ratings ({document.ratingsQuantity})
              </span>
            </p>
          </div>
          <div className="text-end">
            <Link href={`/tours/${document._id}`}>Details</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
