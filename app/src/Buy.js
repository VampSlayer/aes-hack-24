import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ownershipShemaId,
  getAttestationsForItem,
} from "./attestations-client";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { InfuraProvider, Wallet } from "ethers";
import Attestations from "./components/Attestations";

export default function Buy() {
  const [params] = useSearchParams();
  const itemId = params.get("item_id");

  const [attestations, setAttestations] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function get() {
      setAttestations(await getAttestationsForItem(itemId));
    }

    get();
  }, [itemId]);

  const onBuy = async () => {
    setLoading(true);
    const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
    const schemaUID =
      "0x90212d44d929d10cbe1a0a2d105b5f2527b50e84b520e3259c69d2ad5fb6e702";

    const eas = new EAS(easContractAddress);

    const anyForRevoke = attestations?.filter(
      (x) => x.schemaId === ownershipShemaId && x.revoked === false
    );

    const infuraProvider = new InfuraProvider(
      "sepolia",
      "fce41d3fb5a1402f9e1ea1f49ab6d921" // INFURA PUBLIC KEY
    );

    console.log(infuraProvider._network);

    const signer = new Wallet(
      process.env.REACT_APP_WALLET_PRIVATE_KEY,
      infuraProvider
    );

    eas.connect(signer);

    if (anyForRevoke.length) {
      console.log(anyForRevoke);
      const txy = await eas.revoke({
        schema: schemaUID,
        data: {
          uid: anyForRevoke[0].id,
        },
      });
      await txy.wait();
    }

    // // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("uint16 uniqueId");
    const encodedData = schemaEncoder.encodeData([
      { name: "uniqueId", value: "46455", type: "uint16" },
    ]);
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x750438E8BFD00206329B328DC7B4FE463ccAbe9b",
        expirationTime: 0,
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });
    const newAttestationUID = await tx.wait();
    console.log(newAttestationUID);
    setAttestations(await getAttestationsForItem(itemId));
    setLoading(false);
  };

  return (
    <div>
      <div>
        <img
          alt="hat"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Felthat.jpg/640px-Felthat.jpg"
        />
      </div>
      <div>
        <h2>Price: $999</h2>
      </div>
      {loading && <h2>Purchasing & Authenticating 🧾 .....</h2>}
      <button disabled={loading} onClick={() => onBuy()}>
        Buy
      </button>
      <Attestations attestations={attestations} itemId={itemId}></Attestations>
    </div>
  );
}
