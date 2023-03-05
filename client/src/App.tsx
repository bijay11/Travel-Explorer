import "./styles.css";
import Image from "./React-icon.png";

export const App = () => (
  <>
    <h1>
      React component - {process.env.NODE_ENV} {process.env.name}
    </h1>
    <img src={Image} alt="React Logo" width="300" height="200" />
  </>
);
