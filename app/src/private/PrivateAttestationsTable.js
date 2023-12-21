export default function PrivateAttestationsTable({ attestations }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Index:ItemId</th>
          <th>Bought</th>
          <th>Sold</th>
          <th>Merkleroot</th>
          <th>Attestation</th>
        </tr>
      </thead>
      <tbody>
        {attestations?.map((x, index) => (
          <tr key={x.id}>
            <td>
              {index}:
              {x?.data?.find((x) => x.name === "uniqueId")?.value?.value}
            </td>
            <td>{new Date(x.time * 1000).toLocaleString()}</td>
            <td>
              {x.revocationTime
                ? new Date(x.revocationTime * 1000).toLocaleString()
                : ""}
            </td>
            <td>
              {x?.data?.find((x) => x.name === "privateData")?.value?.value}
            </td>
            <td>
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://sepolia.easscan.org/attestation/view/${x.id}`}
              >
                Link
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
