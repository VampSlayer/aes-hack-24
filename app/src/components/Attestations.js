import { authenticitySchemaId, ownershipShemaId } from "../attestations-client";

export default function Attestations({ itemId, attestations }) {
  var authenticityAttestation = attestations?.filter(
    (x) => x.schemaId === authenticitySchemaId
  );
  var ownershipAttestations = attestations?.filter(
    (x) => x.schemaId === ownershipShemaId
  );

  return (
    <div>
      <div>
        <h1>BrandX Item</h1>
      </div>
      <div>
        <h2>Authenticity</h2>

        {authenticityAttestation?.map((x) => (
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
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Owner</th>
              <th>Bought</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {ownershipAttestations
              ?.sort((a, b) => {
                return b.time - a.time;
              })
              ?.map((x, index) => (
                <tr key={x.id}>
                  <td>{index}</td>
                  <td>{x.recipient}</td>
                  <td>{new Date(x.time * 1000).toLocaleString()}</td>
                  <td>
                    {x.revocationTime &&
                      new Date(x.revocationTime * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
