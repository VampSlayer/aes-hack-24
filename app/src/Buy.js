import { useSearchParams } from 'react-router-dom';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { Wallet } from 'ethers';

export default function Buy() {
  const [params, _] = useSearchParams();
  const itemId = params.get('item_id');

  const onBuy = async () => {
    const easContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
    const schemaUID =
      '0x90212d44d929d10cbe1a0a2d105b5f2527b50e84b520e3259c69d2ad5fb6e702';

    const eas = new EAS(easContractAddress);
    // Signer must be an ethers-like signer.
    const signer = new Wallet(
      '89dda4a142da71958c198179f8ce889360faf9d53ed11fa57e6fa3dc3648a860'
    );

    await eas.connect(signer);
    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder('uint16 uniqueId');
    const encodedData = schemaEncoder.encodeData([
      { name: 'uniqueId', value: '0', type: 'uint16' },
    ]);
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: '0x0000000000000000000000000000000000000000',
        expirationTime: 0,
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });
    const newAttestationUID = await tx.wait();
  };

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
          alt='hat'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Felthat.jpg/640px-Felthat.jpg'
        />
      </div>
      <div>
        <h2>Price: $999</h2>
      </div>
      <button onClick={() => onBuy()}>Buy</button>
    </div>
  );
}
