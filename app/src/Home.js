import { Link } from "react-router-dom";
import { items } from "./attestations-client";

export default function Home() {
  return (
    <table className="table">
      <thead>
        <th>Id</th>
        <th>Info</th>
        <th>Buy</th>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr>
            <td>{item.id}</td>
            <td>
              <Link to={`/info?item_id=${item.id}`}>Info</Link>
            </td>
            <td>
              <Link to={`/buy?item_id=${item.id}`}>Buy</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
