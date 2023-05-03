import { RECENT_TRANSFERS } from "api/query";

export const getRecentTransactions = () => {
  return fetch(
    "https://graph.fusion.novanetwork.io/subgraphs/name/recycle-subgraph",
    {
      method: "POST",
      body: JSON.stringify({
        query: RECENT_TRANSFERS,
      }),
    }
  );
};
