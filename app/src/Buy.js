import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ownershipShemaId,
  getAttestationsForItem,
} from "./attestations-client";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import Attestations from "./components/Attestations";

export default function Buy() {
  const [params] = useSearchParams();
  const itemId = params.get("item_id");

  const [attestations, setAttestations] = useState(undefined);
  const [provider, setProvider] = useState(undefined);

  useEffect(() => {
    async function connect() {
      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        setProvider(ethers.getDefaultProvider("sepolia"));
      } else {
        setProvider(new ethers.BrowserProvider(window.ethereum));
      }
    }
    async function get() {
      const attestations = await getAttestationsForItem(itemId);
      setAttestations(attestations);
    }

    get();
    connect();
  }, [itemId]);

  const onBuy = async () => {
    const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
    const schemaUID =
      "0x90212d44d929d10cbe1a0a2d105b5f2527b50e84b520e3259c69d2ad5fb6e702";

    const eas = new EAS(easContractAddress);

    const anyForRevoke = attestations?.filter(
      (x) => x.schemaId === ownershipShemaId && x.revoked === false
    );

    const signer = await provider.getSigner();

    eas.connect(signer);

    if (anyForRevoke.length) {
      console.log(anyForRevoke);
      const revokeTx = await eas.revoke({
        schema: schemaUID,
        data: {
          uid: anyForRevoke[0].id,
        },
      });
      debugger;

      await revokeTx.wait();
    }

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("uint16 uniqueId");
    const encodedData = schemaEncoder.encodeData([
      { name: "uniqueId", value: "46455", type: "uint16" },
    ]);
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0xe7Aa2BAFD77bB007AA7E71247Bfd45c53af85B13",
        expirationTime: 0,
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });
    const newAttestationUID = await tx.wait();
    console.log(newAttestationUID);
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
      <button onClick={() => onBuy()}>Buy</button>
      <Attestations attestations={attestations} itemId={itemId}></Attestations>
    </div>
  );
}
