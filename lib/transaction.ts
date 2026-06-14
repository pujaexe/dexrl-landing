export const handleTxHashTo = (toChainId: number, txHash: string) => {
    const chains = [
      {
        chainId: 1,
        name: "ETH",
        url: "https://etherscan.io/tx/",
      },
      {
        chainId: 56,
        name: "BSC",
        url: "https://bscscan.com/tx/",
      },
      {
        chainId: 137,
        name: "POL",
        url: "https://polygonscan.com/tx/",
      },
      {
        chainId: 8453,
        name: "BASE",
        url: "https://basescan.org/tx/",
      },
      {
        chainId: 1151111081099710,
        name: "SOL",
        url: "https://solscan.io/tx/",
      },
    ];
  
    const url = chains.find(
      ({ chainId }) => chainId === toChainId
    )?.url;
    return `${url}${txHash}`;
  };