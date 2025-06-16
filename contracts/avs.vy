# pragma version ^0.4.1
# @title AVS
# @license MIT
# @author Rafael Abuawad <x.com/rabuawad>


struct Data:
    registrator: address
    hash: bytes32
    data_id: String[64]
    image_id: String[64]
    timestamp: uint256


struct KVDataEntry:
    key: String[32]
    value: uint256


hashes: HashMap[bytes32, bool]
total_entries: public(uint256)
entries: public(HashMap[uint256, Data])


event EntryAdded:
    registrator: address
    hash: bytes32
    data_id: String[64]
    image_id: String[64]
    timestamp: uint256


@external
def add_entry(data_id: String[64], image_id: String[64], data_entries: DynArray[KVDataEntry, 16]):
    encoded: Bytes[4160] = abi_encode(data_entries)
    hash: bytes32 = keccak256(encoded)

    assert not self.hashes[hash], "Hash already exists"
    self.hashes[hash] = True

    self.entries[self.total_entries] = Data(
        registrator=msg.sender,
        hash=hash,
        data_id=data_id,
        image_id=image_id,
        timestamp=block.timestamp,
    )
    self.total_entries += 1

    log EntryAdded(
        registrator=msg.sender,
        hash=hash,
        data_id=data_id,
        image_id=image_id,
        timestamp=block.timestamp,
    )
