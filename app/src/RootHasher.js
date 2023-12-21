import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { useState } from "react";

export default function Roothasher() {
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState("");
  const [marketplace, setMarketplace] = useState("");
  const [rootHash, setRootHash] = useState("");
  const [merkleTree, setMerkleTree] = useState(undefined);

  const onGenerate = () => {
    if (!owner || !price || !marketplace) {
      alert("All feilds must have values");
      return;
    }
    const data = [owner, price, marketplace];

    window.Buffer = window.Buffer || require("buffer").Buffer;

    var leaves = data.map((addr) => keccak256(addr));

    // Create tree
    var merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    setMerkleTree(merkleTree);
    var rootHash = merkleTree.getRoot().toString("hex");
    setRootHash(rootHash);
  };

  const [proof, setProof] = useState("");
  const [feild, setFeild] = useState("");

  const onCreateProof = () => {
    if (!feild || !rootHash) {
      alert("All feilds must have values");
      return;
    }

    if (!merkleTree) {
      alert("Create a Merkle proof first");
      return;
    }

    window.Buffer = window.Buffer || require("buffer").Buffer;

    let hashedFeild = keccak256(feild);

    let proof = merkleTree.getHexProof(hashedFeild);

    setProof(proof);
  };

  const onVerifyProof = () => {
    if (!feild) {
      alert("All feilds must have values");
      return;
    }
    let hashedField = keccak256(feild);
    console.log(MerkleTree.verify(proof, hashedField, rootHash, keccak256));
  };

  return (
    <div style={{ display: "grid", gridRowGap: "2rem" }}>
      <div>
        onwer:{" "}
        <input
          className="input"
          value={owner}
          onChange={(e) => {
            setOwner(e.target.value);
          }}
        />
        price:{" "}
        <input
          className="input"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
        marketplace:{" "}
        <input
          className="input"
          value={marketplace}
          onChange={(e) => {
            setMarketplace(e.target.value);
          }}
        />
        <button className="btn btn-dark" onClick={() => onGenerate()}>
          GenerateHash
        </button>
      </div>
      <div>
        root hash:{" "}
        <input
          className="input"
          value={rootHash}
          onChange={(e) => {
            setRootHash(e.target.value);
          }}
        />
        feild:{" "}
        <input
          className="input"
          value={feild}
          onChange={(e) => {
            setFeild(e.target.value);
          }}
        />
        <button className="btn btn-dark" onClick={() => onCreateProof()}>
          Create Proof
        </button>
        <div>{proof}</div>
      </div>
      <div>
        root hash:{" "}
        <input
          className="input"
          value={rootHash}
          onChange={(e) => {
            setRootHash(e.target.value);
          }}
        />
        feild:{" "}
        <input
          className="input"
          value={feild}
          onChange={(e) => {
            setFeild(e.target.value);
          }}
        />
        <button className="btn btn-dark" onClick={() => onVerifyProof()}>
          verify Proof
        </button>
        <div>{proof}</div>
      </div>
    </div>
  );
}
