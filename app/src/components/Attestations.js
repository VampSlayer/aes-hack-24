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
        <h1>Item Id</h1>
        <h1>{itemId}</h1>
      </div>
      <div>
        <h2>Authenticity</h2>
        <code>{JSON.stringify(authenticityAttestation)}</code>
      </div>
      <div>
        <h2>Ownership</h2>
        <code>{JSON.stringify(ownershipAttestations)}</code>
      </div>
    </div>
  );
}
