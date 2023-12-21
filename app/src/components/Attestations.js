import { authenticitySchemaId, ownershipShemaId } from "../attestations-client";

export default function Attestations({ itemId, attestations }) {
  return (
    <div>
      <div>
        <h1>BrandX Item</h1>
        <p>ItemX with Serial Number {itemId}</p>
      </div>
      <div>
        <h2>Authenticity</h2>

        {attestations?.authenticity?.map((x) => (
          <div key={x.id}>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://sepolia.easscan.org/attestation/view/${x.id}`}
            >
              View Authenticity attestation by BrandX
            </a>
            <p>
              ✅ Authenticated on {new Date(x.time * 1000).toLocaleString()} by{" "}
              {x.attester}
            </p>
          </div>
        ))}
      </div>
      <div>
        <h2>Ownership</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Owner</th>
              <th>Bought</th>
              <th>Sold</th>
              <th>Price</th>
              <th>Marketplace</th>
            </tr>
          </thead>
          <tbody>
            {attestations?.ownership?.map((x, index) => (
              <tr key={x.id}>
                <td>{index}</td>
                <td>{x.recipient}</td>
                <td>{new Date(x.time * 1000).toLocaleString()}</td>
                <td>
                  {x.revocationTime
                    ? new Date(x.revocationTime * 1000).toLocaleString()
                    : ""}
                </td>
                <td>${x.data.find((x) => x.name === "price").value.value}</td>
                <td>
                  {x.data.find((x) => x.name === "marketplace").value.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
