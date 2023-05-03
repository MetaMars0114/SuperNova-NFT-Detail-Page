export const RECENT_TRANSFERS = `
{
  transfers(first: 25) {
    from {
      id
    }
    block
    id
    transactionHash
    to {
      id
    }
    token {
      id
    }
    timestamp
  }
}
`;

export const TRANSFER = `
{
  transfers(first: 25) {
    from {
      id
    }
    block
    id
    transactionHash
    to {
      id
    }
    token {
      id
    }
    timestamp
  }
}
`;

