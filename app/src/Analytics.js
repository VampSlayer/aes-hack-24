import AttestationsTable from "./AttestationsTable";
import { useEffect, useState } from "react";
import { getAllOwnershipAttestations } from "./attestations-client";

const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const mode = (arr) =>
  arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();

export default function Analytics() {
  const [attestations, setAttestations] = useState(undefined);
  const [info, setInfo] = useState(undefined);

  useEffect(() => {
    async function get() {
      setAttestations(await getAllOwnershipAttestations());
    }
    get();
  }, []);

  useEffect(() => {
    if (attestations) {
      /// average price
      const prices = attestations.flatMap((x) => {
        return x?.data?.find((x) => x.name === "price")?.value?.value;
      });

      const averagePrice = Math.floor(average(prices));

      /// who bought the most

      const onwers = attestations.flatMap((x) => {
        return x?.recipient;
      });

      const modeOwner = mode(onwers);

      /// time between purchase and sale

      const timeBetweenBoughtAndSold = attestations.flatMap((x) => {
        return (x?.time - x?.revocationTime) / 1000 / 60 / 60;
      });

      const averageTimeBetweenBoughtAndSold = Math.floor(
        average(timeBetweenBoughtAndSold)
      );

      /// marketplace

      const marketplaces = attestations.flatMap((x) => {
        return x?.data?.find((x) => x.name === "marketplace")?.value?.value;
      });

      const modeMarketplace = mode(marketplaces);

      // most traded item

      const ids = attestations.flatMap((x) => {
        return x?.data?.find((x) => x.name === "uniqueId")?.value?.value;
      });

      const modeId = mode(ids);

      setInfo({
        averagePrice,
        modeOwner,
        averageTimeBetweenBoughtAndSold,
        modeMarketplace,
        modeId,
      });
    }
  }, [attestations]);

  return (
    <div>
      <h1>BrandX Analytics</h1>
      <div className="containter">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-heading">Average pice sold for</div>
              <div className="card-body">${info?.averagePrice}</div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-heading">Who bought the most</div>
              <div className="card-body">{info?.modeOwner}</div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-heading">Average hold time (minutes)</div>
              <div className="card-body">
                {info?.averageTimeBetweenBoughtAndSold}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-heading">Most traded on marketplace</div>
              <div className="card-body">{info?.modeMarketplace}</div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-heading">Most traded item</div>
              <div className="card-body">{info?.modeId}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2>Sales</h2>
        <AttestationsTable attestations={attestations}></AttestationsTable>
      </div>
    </div>
  );
}
