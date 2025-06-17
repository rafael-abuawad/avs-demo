# AVS-Inspired Demo

This project is a full-stack Web3 application that demonstrates a simple on-chain data anchoring pattern, inspired by the architecture of an Actively Validated Service (AVS). It consists of a smart contract written in Vyper and a frontend application built with React and Vite.

## On-Chain Data Anchoring: An AVS-Inspired Approach

It's important to clarify that **this project is not a true Actively Validated Service (AVS)**. A complete AVS, like those built on EigenLayer, involves a network of off-chain operators who stake assets to guarantee the validity and availability of off-chain data.

This project implements only the foundational on-chain component of such a system.

### How it's implemented here

This project showcases the core on-chain principle: keeping complex data off-chain while anchoring its cryptographic proof on-chain.

The `avs.vy` smart contract allows users to register a collection of key-value data.
1. The off-chain data is encoded and hashed into a single `bytes32` value.
2. This hash, along with metadata like the `registrator`'s address and a timestamp, is stored immutably on the blockchain.

This creates a tamper-proof, on-chain ledger of data "fingerprints." A full AVS would build on this by adding a layer of staked operators responsible for guaranteeing the availability and validity of the off-chain data corresponding to each hash.

### Benefits of this model

This on-chain anchoring approach provides a powerful middle ground between storing everything on-chain and relying on simple off-chain pointers.

**Compared to storing raw data on-chain:**
- **Cost-Effective:** Storing a 32-byte hash is vastly cheaper than storing kilobytes or megabytes of raw data on Ethereum, making the system economically viable for large datasets.
- **Scalability:** It circumvents the strict gas limits on block size, allowing for a virtually unlimited amount of data to be anchored to the chain.

**Compared to using NFTs with an IPFS link:**
- **A Foundation for Active Validation:** An NFT simply points to an off-chain resource (like an IPFS file). It doesn't inherently guarantee that the file is correct, available, or uncorrupted. This project's model provides the on-chain anchor that a full AVS would use to enforce such guarantees. The *active validation* would come from the staked operators who are paid to ensure data integrity and availability, a layer that could be built on top of this contract.
- **Stronger Guarantees (with a full AVS):** In a complete AVS, operators are economically bound to keep the off-chain data accessible. If data is lost, the responsible operators can be slashed. This provides a much stronger guarantee than IPFS alone, where data can become unavailable if no one is pinning it.
- **Structured Data Flexibility:** The `avs.vy` contract registers a hash of structured key-value pairs. This is more flexible for complex data models than a typical NFT metadata schema, which is often a flat JSON file.

## Tech Stack

- **Smart Contracts**: Vyper
- **Blockchain Development Environment**: ApeWorX
- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Web3 Connectivity**: wagmi, ConnectKit

## Project Structure

```
.
├── contracts/        # Vyper smart contracts
│   └── avs.vy
├── scripts/          # Deployment scripts
│   └── deploy.py
├── client/           # Frontend application
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
├── ape-config.yaml   # ApeWorX configuration
└── pyproject.toml    # Python project configuration
```

## Getting Started

### Prerequisites

- [UV](https://docs.astral.sh/uv/)
- [Bun](https://bun.sh)
- Python 3.12+

### Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd avs-demo
    ```

2.  **Install Python dependencies**

    ```bash
    uv sync
    ```

3.  **Install Ape plugins**

    ```bash
    uv run ape plugins install .
    ```

3.  **Install frontend dependencies**

    ```bash
    cd client && bun install
    ```

### Running the Application

1.  **Deploy the smart contract**

    You'll need a funded account in your ApeWorX environment. Load your account and run the deployment script:

    ```bash
    ape run scripts/deploy.py --network <your-network>
    ```

2.  **Start the frontend development server**

    ```bash
    cd client && bun run dev
    ```

    The application will be available at `http://localhost:3000`.

## Available Scripts

### Frontend (`/client`)

-   `bun run dev`: Starts the development server.
-   `bun run build`: Builds the application for production.
-   `bun run test`: Runs the test suite.
-   `bun run format`: Formats the code with Prettier.
