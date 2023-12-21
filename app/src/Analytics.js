import AttestationsTable from "./AttestationsTable";
import { useEffect, useState } from "react";
import { getAllOwnershipAttestations } from "./attestations-client";
import { Link } from "react-router-dom";

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
  const [grouped, setGrouped] = useState(undefined);
  const [info, setInfo] = useState(undefined);

  useEffect(() => {
    async function get() {
      const attestations = await getAllOwnershipAttestations();

      const grouped = attestations.reduce(
        (result, item) => ({
          ...result,
          [item?.data?.find((x) => x.name === "uniqueId")?.value?.value]: [
            ...(result[
              item?.data?.find((x) => x.name === "uniqueId")?.value?.value
            ] || []),
            item,
          ],
        }),
        {}
      );

      setGrouped(grouped);

      setAttestations(attestations);
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
      <div className="containter p-5">
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
      <div className="p-5">
        <h2>Sales</h2>
        {Object.keys(grouped || {}).map((x) => (
          <div key={x}>
            <h3>
              Item{" "}
              <Link
                to={`/info?item_id=${
                  grouped[x][0]?.data?.find((x) => x.name === "uniqueId")?.value
                    ?.value
                }`}
              >
                {
                  grouped[x][0]?.data?.find((x) => x.name === "uniqueId")?.value
                    ?.value
                }
              </Link>
            </h3>
            <AttestationsTable attestations={grouped[x]}></AttestationsTable>
          </div>
        ))}
      </div>
    </div>
  );
}
