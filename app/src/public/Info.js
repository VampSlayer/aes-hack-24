import Attestations from "./Attestations";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  authenticitySchemaId,
  getAttestationsForItem,
} from "../attestations-client";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { InfuraProvider, Wallet } from "ethers";

export default function Info() {
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

  const onAuthenticate = async () => {
    setLoading(true);
    const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
    const schemaUID = authenticitySchemaId;
    const eas = new EAS(easContractAddress);
    const infuraProvider = new InfuraProvider(
      "sepolia",
      "fce41d3fb5a1402f9e1ea1f49ab6d921" // INFURA PUBLIC KEY
    );

    const signer = new Wallet(
      process.env.REACT_APP_WALLET_PRIVATE_KEY,
      infuraProvider
    );

    await eas.connect(signer);
    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("bool isAuthentic,uint16 uniqueId");
    const encodedData = schemaEncoder.encodeData([
      { name: "isAuthentic", value: true, type: "bool" },
      { name: "uniqueId", value: parseInt(itemId), type: "uint16" },
    ]);
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x0000000000000000000000000000000000000000",
        expirationTime: 0,
        revocable: false, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });
    await tx.wait();
    setAttestations(await getAttestationsForItem(itemId));
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {attestations?.authenticity?.length ? (
        <Attestations attestations={attestations} itemId={itemId} />
      ) : (
        <div>
          <h2>This item has never been Authenticated</h2>
          {loading && (
            <h2>
              Authenticating 🧾{" "}
              <div className="spinner-border" role="status"></div>
            </h2>
          )}
          <button
            disabled={loading}
            onClick={() => onAuthenticate()}
            className="btn btn-success"
          >
            Authenticate now
          </button>
        </div>
      )}
    </div>
  );
}
