import { Link } from "react-router-dom";
import { privateItems, publicItems } from "./attestations-client";

export default function Home() {
  return (
    <div className="p-5">
      <div>
        <Link to={`/analytics`}>Analytics</Link>
      </div>
      <div>
        <Link to={`https://lab.miguelmota.com/merkletreejs/example/`}>
          Hasher
        </Link>
      </div>
      <div>
        <h2>Public Sales & Public Data</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Info</th>
              <th>Buy</th>
            </tr>
          </thead>
          <tbody>
            {publicItems.map((item) => (
              <tr key={item.id}>
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
        <h2>Public Sales & Private Data</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Info</th>
              <th>Buy</th>
            </tr>
          </thead>
          <tbody>
            {privateItems.map((item) => (
              <tr key={item.id}>
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
