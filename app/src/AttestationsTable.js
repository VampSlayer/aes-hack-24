export default function AttestationsTable({ attestations }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Index</th>
          <th>Owner</th>
          <th>Bought</th>
          <th>Sold</th>
          <th>Price</th>
          <th>Marketplace</th>
          <th>Attestation</th>
        </tr>
      </thead>
      <tbody>
        {attestations?.map((x, index) => (
          <tr key={x.id}>
            <td>{index}</td>
            <td>{x.recipient}</td>
            <td>{new Date(x.time * 1000).toLocaleString()}</td>
            <td>
              {x.revocationTime
                ? new Date(x.revocationTime * 1000).toLocaleString()
                : ""}
            </td>
            <td>${x?.data?.find((x) => x.name === "price")?.value?.value}</td>
            <td>
              {x?.data?.find((x) => x.name === "marketplace")?.value?.value}
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
