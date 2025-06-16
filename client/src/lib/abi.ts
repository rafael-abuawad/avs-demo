export const avsAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "registrator",
        type: "address",
      },
      {
        indexed: false,
        name: "hash",
        type: "bytes32",
      },
      {
        indexed: false,
        name: "data_id",
        type: "string",
      },
      {
        indexed: false,
        name: "image_id",
        type: "string",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "EntryAdded",
    type: "event",
  },
  {
    inputs: [
      {
        name: "data_id",
        type: "string",
      },
      {
        name: "image_id",
        type: "string",
      },
      {
        components: [
          {
            name: "key",
            type: "string",
          },
          {
            name: "value",
            type: "uint256",
          },
        ],
        name: "data_entries",
        type: "tuple[]",
      },
    ],
    name: "add_entry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "total_entries",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "arg0",
        type: "uint256",
      },
    ],
    name: "entries",
    outputs: [
      {
        components: [
          {
            name: "registrator",
            type: "address",
          },
          {
            name: "hash",
            type: "bytes32",
          },
          {
            name: "data_id",
            type: "string",
          },
          {
            name: "image_id",
            type: "string",
          },
          {
            name: "timestamp",
            type: "uint256",
          },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
