# pragma version ^0.4.1
# @title AVS
# @license MIT
# @author Rafael Abuawad <x.com/rabuawad>


struct Data:
    registrator: address
    hash: bytes32
    arweave_id: String[64]
    timestamp: uint256


struct KVDataEntry:
    key: String[32]
    value: uint256


total_entries: public(uint256)
entries: public(HashMap[uint256, Data])


event EntryAdded:
    registrator: address
    hash: bytes32
    arweave_id: String[64]
    timestamp: uint256


@external
def add_entry(arweave_id: String[64], data_entries: DynArray[KVDataEntry, 16]):
    encoded: Bytes[4160] = abi_encode(data_entries)
    hash: bytes32 = keccak256(encoded)

    self.entries[self.total_entries] = Data(
        registrator=msg.sender,
        hash=hash,
        arweave_id=arweave_id,
        timestamp=block.timestamp,
    )
    self.total_entries += 1

    
    log EntryAdded(
        registrator=msg.sender,
        hash=hash,
        arweave_id=arweave_id,
        timestamp=block.timestamp,
    )
