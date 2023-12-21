import { privateItems } from "../attestations-client";
import PrivateAttestationsTable from "./PrivateAttestationsTable";

export const PrivateAttestation = ({ itemId, attestations }) => {
  return (
    <div>
      <div>
        <h1>BrandX Item {itemId}</h1>
        <div>
          <img
            style={{ width: "150px", height: "150px" }}
            alt="product"
            src={privateItems.find((x) => x.id === itemId)?.src}
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
        <PrivateAttestationsTable attestations={attestations?.ownership} />
      </div>
    </div>
  );
};
