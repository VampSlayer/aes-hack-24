import { Link } from "react-router-dom";

export default function Home() {
  return (
    <nav>
      <p>
        <Link to={"/info"}>Info</Link>
      </p>
      <p>
        <Link to={"/buy"}>Buy</Link>
      </p>
    </nav>
  );
}
