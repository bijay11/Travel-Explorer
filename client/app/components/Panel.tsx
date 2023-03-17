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
        <span>Location: {document.startLocation.description}</span>
        Date: {`${month} ${year}`}
      </p>

      <p>
        <span>Number of stops: {document.locations.length}</span>
        <span>Group size: {document.maxGroupSize}</span>
      </p>

      <p>
        <span>Difficulty: {document.difficulty}</span>
        <span>Duration: {document.duration}</span>
      </p>
      <hr className={styles.divider} />
      <div className={styles.detail}>
        <div>
          <p>Price: {document.price}</p>
          <p>Average Rating: {document.ratingsAverage}</p>
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
