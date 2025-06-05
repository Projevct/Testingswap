// /api/solana-nfts.js

import axios from 'axios';

export default async function handler(req, res) {
  const { wallet } = req.query;
  if (!wallet) return res.status(400).json({ error: 'Wallet address is required' });

  try {
    const url = `https://api.helius.xyz/v0/addresses/${wallet}/nfts?api-key=${process.env.HELIUS_API_KEY}`;
    const response = await axios.get(url);

    const nfts = response.data.map((item) => ({
      name: item.content?.metadata?.name || 'Unnamed NFT',
      image: item.content?.links?.image || '',
      marketplace: 'Solana',
    }));

    res.status(200).json(nfts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Helius fetch error' });
  }
}
