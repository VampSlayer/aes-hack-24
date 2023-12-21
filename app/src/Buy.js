import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ownershipShemaId,
  getAttestationsForItem,
} from "./attestations-client";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { InfuraProvider, Wallet } from "ethers";
import Attestations from "./components/Attestations";

const buyers = [
  "0x750438E8BFD00206329B328DC7B4FE463ccAbe9b",
  "0xe7Aa2BAFD77bB007AA7E71247Bfd45c53af85B13",
  "0x4544B5e851E1ECb2bE566860EB429bE02a3C8794",
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
];

const marketplaces = [
  "ClosedSea",
  "LooksCommon",
  "LostOrigin",
  "Focus",
  "Unmintable",
  "NormalRare",
  "Roof",
  "A Bay",
];

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

export default function Buy() {
  const [params] = useSearchParams();
  const itemId = params.get("item_id");

  const [attestations, setAttestations] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [priceOfItem] = useState(Math.floor(Math.random() * 1000));
  const [marketplace] = useState(marketplaces.random());
  const [buyer] = useState(buyers.random());

  useEffect(() => {
    async function get() {
      setAttestations(await getAttestationsForItem(itemId));
    }

    get();
  }, [itemId]);

  const onBuy = async () => {
    setLoading(true);
    const easContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
    const schemaUID = ownershipShemaId;

    const eas = new EAS(easContractAddress);

    const anyForRevoke = attestations?.ownership?.filter(
      (x) => x.schemaId === ownershipShemaId && x.revoked === false
    );

    const infuraProvider = new InfuraProvider(
      "sepolia",
      "fce41d3fb5a1402f9e1ea1f49ab6d921" // INFURA PUBLIC KEY
    );

    const signer = new Wallet(
      process.env.REACT_APP_WALLET_PRIVATE_KEY,
      infuraProvider
    );

    eas.connect(signer);

    if (anyForRevoke.length) {
      const revoke = await eas.revoke({
        schema: schemaUID,
        data: {
          uid: anyForRevoke[0].id,
        },
      });

      await revoke.wait();
    }

    // // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "uint16 uniqueId,uint24 price,string marketplace"
    );

    const encodedData = schemaEncoder.encodeData([
      { name: "uniqueId", value: parseInt(itemId), type: "uint16" },
      { name: "price", value: parseInt(priceOfItem), type: "uint24" },
      { name: "marketplace", value: marketplace, type: "string" },
    ]);

    const attest = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: buyer,
        expirationTime: 0,
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
        refUID: attestations.authenticity[0].id,
      },
    });

    await attest.wait();

    setAttestations(await getAttestationsForItem(itemId));
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div>
        <h1>{marketplace}</h1>
        <div>
          <img
            alt="hat"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Felthat.jpg/640px-Felthat.jpg"
          />
        </div>
        <div>
          <h2>Price: ${priceOfItem}</h2>
        </div>
        {loading && (
          <h2>
            Purchasing & Authenticating 🧾{" "}
            <div className="spinner-border" role="status"></div>
          </h2>
        )}
        <button
          className="btn btn-dark"
          disabled={loading}
          onClick={() => onBuy()}
        >
          Buy
        </button>
      </div>
      <Attestations attestations={attestations} itemId={itemId}></Attestations>
    </div>
  );
}
