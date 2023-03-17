import {
  MdFlagCircle,
  MdLocationOn,
  MdCalendarMonth,
  MdHiking,
  MdTimelapse,
  MdGroup,
} from "react-icons/md";
import styles from "./panel.module.css";

export function Panel({ document }: any) {
  const [, month, , year] = new Date(document.startDates[0])
    .toString()
    .split(" ");

  return (
    <div className={styles.panel}>
      <h4>{document.name}</h4>
      <div className={styles.bar}></div>
      <p>
        <span>
          <MdLocationOn size={28} color="#0099a8" />{" "}
          {document.startLocation.description}
        </span>
        <span>
          <MdCalendarMonth size={24} color="#0099a8" /> {`${month} ${year}`}
        </span>
      </p>

      <p>
        <span>
          <MdFlagCircle size={24} color="#0099a8" /> {document.locations.length}{" "}
          stops
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
        <div>
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tours/${document._id}`}
            className={styles.button}
          >
            Details
          </a>
        </div>
      </div>
    </div>
  );
}
