import AttestationsTable from "./AttestationsTable";
import { useEffect, useState } from "react";
import { getAllOwnershipAttestations } from "./attestations-client";

export default function Analytics() {
  const [attestations, setAttestations] = useState(undefined);

  useEffect(() => {
    async function get() {
      setAttestations(await getAllOwnershipAttestations());
    }

    get();
  }, []);

  return (
    <div>
      <h1>BrandX Analytics</h1>
      <div>
        <h2>Sales</h2>
        <AttestationsTable attestations={attestations}></AttestationsTable>
      </div>
    </div>
  );
}
