export const authenticitySchemaId =
  "0x7437bb8d227912ea09094f45194d9419bb885ce3288f1b2bb6d51fee16abd3cd";
export const ownershipShemaId =
  "0x164e58c175d73aa5c78b801431fe1bfa7082e698a57ae136dfce4be47f869c38";
export const privateOwnershipSchemaId =
  "0x2ab26750209e6f05934894519cc4e74392e45b8439017babf3f0d64ad99cae3e";

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
    ownership: mappedOwnershipAttestations?.sort((a, b) => {
      return b.time - a.time;
    }),
  };
}

export async function getAttestationsForPrivateItem(itemId) {
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
          privateOwnershipSchemaId, // ownership
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
  console.log(attestations);
  var authenticityAttestation = attestations?.filter(
    (x) => x.schemaId === authenticitySchemaId
  );
  var privateOwnershipAttestations = attestations?.filter(
    (x) => x.schemaId === privateOwnershipSchemaId
  );

  var mappedPrivateOwnershipAttestations = privateOwnershipAttestations?.map(
    (x) => {
      x.data = JSON.parse(x.decodedDataJson);
      return x;
    }
  );

  return {
    authenticity: authenticityAttestation,
    ownership: mappedPrivateOwnershipAttestations?.sort((a, b) => {
      return b.time - a.time;
    }),
  };
}

export async function getAllOwnershipAttestations() {
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
      schemaId: { in: [ownershipShemaId] },
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

  var ownershipAttestations = attestations?.filter(
    (x) => x.decodedDataJson !== ""
  );

  var mappedOwnershipAttestations = ownershipAttestations?.map((x) => {
    x.data = JSON.parse(x.decodedDataJson);
    return x;
  });

  return mappedOwnershipAttestations.sort((a, b) => {
    return b.time - a.time;
  });
}

export const publicItems = [
  {
    id: "46455",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKqjo-4tOpsXBPLBNQeEW6tSPGk6Kt1OzDoQ&usqp=CAU",
  },
  {
    id: "12345",
    src: "https://www.merchoid.com/media/mf_webp/jpeg/media/catalog/product/cache/65c63282a2b3bd0da0ec5b004bcde549/s/p/spidermannew.webp",
  },
  {
    id: "58765",
    src: "https://m.media-amazon.com/images/I/61MaiRgtJWL._AC_UY580_.jpg",
  },
  {
    id: "45678",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH4kIcgDAve5m4HcsiUQrXNu5q-4-i-aMVBA&usqp=CAU",
  },
  {
    id: "19283",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlolfuzlb7FKUs7XhXYQnQm_WgmsHPXARMZg&usqp=CAU",
  },
];

export const privateItems = [
  {
    id: "37123",
    src: "https://www.partyrama.co.uk/wp-content/uploads/2019/10/christmas-stocking-41cm-product-image.jpg",
  },
  {
    id: "37113",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShzY10Fnr2kHVzSePK4UGU1FwECX-1NOnjig&usqp=CAU",
  },
  {
    id: "37114",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEqO-c5XfH2lF4R2f3c9__vCy1EgZu_0DROQ&usqp=CAU",
  },
  {
    id: "37115",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzGZV4UEDih1EIqaOwjBU4EJAX7Ozzovyk5A&usqp=CAU",
  },
  {
    id: "37116",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYGaeRkxv33IPlHjSq0EJlJbSaj7GWmRNGjQ&usqp=CAU",
  },
];
