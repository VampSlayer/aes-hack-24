import { items } from "./attestations-client";
import AttestationsTable from "./AttestationsTable";

export default function Attestations({ itemId, attestations }) {
  return (
    <div>
      <div>
        <h1>BrandX Item {itemId}</h1>
        <div>
          <img
            style={{ width: "150px", height: "150px" }}
            alt="product"
            src={items.find((x) => x.id === itemId)?.src}
          />
        </div>
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
        <AttestationsTable
          attestations={attestations.ownership}
        ></AttestationsTable>
      </div>
    </div>
  );
}
