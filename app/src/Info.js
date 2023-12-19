import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Info() {
  const [params, _] = useSearchParams();
  const itemId = params.get("item_id");
  var query = `query Query($where: AttestationWhereInput) {
        attestations(where: $where) {
            id
            data
            decodedDataJson
            recipient
            attester
            time
            timeCreated
            expirationTime
            revocationTime
            refUID
            revocable
            revoked
            txid
            schemaId
            ipfsHash
            isOffchain
        }
        }`;

  var authenticitySchemaId =
    "0x7437bb8d227912ea09094f45194d9419bb885ce3288f1b2bb6d51fee16abd3cd";
  var ownershipShemaId =
    "0x90212d44d929d10cbe1a0a2d105b5f2527b50e84b520e3259c69d2ad5fb6e702";

  var variables = {
    where: {
      schemaId: {
        in: [
          authenticitySchemaId, // authenticity
          ownershipShemaId, // ownership
        ],
      },
      decodedDataJson: {
        contains: itemId,
      },
    },
  };

  const [attestations, setAttestations] = useState(undefined);

  useEffect(() => {
    async function get() {
      const response = await fetch("https://sepolia.easscan.org/graphql", {
        method: "POST",
        body: JSON.stringify({ query, variables }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setAttestations(result.data.attestations);
    }
    get();
  });

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
