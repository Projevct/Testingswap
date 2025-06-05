import { useState } from 'react';

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [nfts, setNfts] = useState([]);

  const fetchNFTs = async () => {
    if (!wallet) return alert("Enter a wallet address");
    try {
      const res = await fetch(`/api/solana-nfts?wallet=${wallet}`);
      const data = await res.json();
      setNfts(data);
    } catch (err) {
      console.error("Failed to fetch NFTs:", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Enter wallet address"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />
      <button onClick={fetchNFTs}>Fetch NFTs</button>
      <ul>
        {nfts.map((nft, idx) => (
          <li key={idx}>
            <p>{nft.name}</p>
            <img src={nft.image} alt={nft.name} width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
}
