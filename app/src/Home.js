import { Link } from "react-router-dom";
import { privateItems, publicItems } from "./attestations-client";

export default function Home() {
  return (
    <div>
      <div>
        <Link to={`/analytics`}>Analytics</Link>
      </div>
      <div>
        <h2>Public Items</h2>
        <table className="table">
          <thead>
            <th>Id</th>
            <th>Info</th>
            <th>Buy</th>
          </thead>
          <tbody>
            {publicItems.map((item) => (
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
      </div>
      <div>
        <h2>Private Items</h2>
        <table className="table">
          <thead>
            <th>Id</th>
            <th>Info</th>
            <th>Buy</th>
          </thead>
          <tbody>
            {privateItems.map((item) => (
              <tr>
                <td>{item.id}</td>
                <td>
                  <Link to={`/privateInfo?item_id=${item.id}`}>Info</Link>
                </td>
                <td>
                  <Link to={`/privateBuy?item_id=${item.id}`}>Buy</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
