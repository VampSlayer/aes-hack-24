import { useSearchParams } from "react-router-dom";

export default function Buy() {
  const [params, _] = useSearchParams();
  const itemId = params.get("item_id");

  return (
    <div>
      <div>
        <h1>Sellify</h1>
        <h2>Hat</h2>
        <h2>Item Id</h2>
        <h2>{itemId}</h2>
      </div>
      <div>
        <img
          alt="hat"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Felthat.jpg/640px-Felthat.jpg"
        />
      </div>
      <div>
        <h2>Price: $999</h2>
      </div>
    </div>
  );
}
