export const authenticitySchemaId =
  "0x7437bb8d227912ea09094f45194d9419bb885ce3288f1b2bb6d51fee16abd3cd";
export const ownershipShemaId =
  "0x164e58c175d73aa5c78b801431fe1bfa7082e698a57ae136dfce4be47f869c38";

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

  const attestations = (await response.json())?.data?.attestations;

  var authenticityAttestation = attestations?.filter(
    (x) => x.schemaId === authenticitySchemaId
  );
  var ownershipAttestations = attestations?.filter(
    (x) => x.schemaId === ownershipShemaId
  );

  var mappedOwnershipAttestations = ownershipAttestations?.map((x) => {
    x.data = JSON.parse(x.decodedDataJson);
    return x;
  });

  return {
    authenticity: authenticityAttestation,
    ownership: mappedOwnershipAttestations.sort((a, b) => {
      return b.time - a.time;
    }),
  };
}
