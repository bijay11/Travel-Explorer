export function Panel({ document }: any) {
  return (
    <div>
      <h4>{document.name}</h4>
      <h5>Difficulty: {document.difficulty}</h5>
      <p>Location: {document.startLocation.description}</p>
      <p>MaxGroupsize: {document.maxGroupSize}</p>
      <p>Average Rating: {document.ratingsAverage}</p>
      <p>No. of ratings: {document.ratingsQuantity}</p>
      <p>Price: {document.price}</p>
    </div>
  );
}
