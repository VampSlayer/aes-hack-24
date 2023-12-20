import Attestations from "./components/Attestations";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAttestationsForItem } from "./attestations-client";

export default function Info() {
  const [params] = useSearchParams();
  const itemId = params.get("item_id");

  const [attestations, setAttestations] = useState(undefined);

  useEffect(() => {
    async function get() {
      const attestations = await getAttestationsForItem(itemId);
      setAttestations(attestations);
    }

    get();
  }, [itemId]);

  return <Attestations attestations={attestations} itemId={itemId} />;
}
