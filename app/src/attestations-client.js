export const authenticitySchemaId =
  "0x7437bb8d227912ea09094f45194d9419bb885ce3288f1b2bb6d51fee16abd3cd";
export const ownershipShemaId =
  "0x90212d44d929d10cbe1a0a2d105b5f2527b50e84b520e3259c69d2ad5fb6e702";

export async function getAttestationsForItem(itemId) {
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

  const response = await fetch("https://sepolia.easscan.org/graphql", {
    method: "POST",
    body: JSON.stringify({ query, variables }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()).data.attestations;
}
