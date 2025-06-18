# pragma version ^0.4.1
# @title AVS
# @license GPL-3.0
# @author Rafael Abuawad <x.com/rabuawad>


struct Data:
    registrator: address
    hash: bytes32
    metadata_id: String[64]
    timestamp: uint256


struct Attribute:
    trait_type: String[32] # Label
    value: uint256


struct Metadata:
    name: String[64]
    description: String[256]
    image: String[64]
    attributes: DynArray[Attribute, 16]


hashes: HashMap[bytes32, bool]
total_entries: public(uint256)
entries: public(HashMap[uint256, Data])


# @dev Stores the base URI for computing `tokenURI`.
BASE_URI: constant(String[23]) = "https://arweave.net/tx/"


event EntryAdded:
    _registrator: address
    _hash: bytes32
    _metadata_id: String[64]
    _timestamp: uint256


event Transfer:
    _from: address
    _to: address
    _token_id: uint256


@external
def mint(
    metadata_id: String[64],
    metadata: Metadata,
):
    encoded: Bytes[4256] = abi_encode(metadata)
    hash: bytes32 = keccak256(encoded)

    assert not self.hashes[hash], "avs: hash already exists"
    self.hashes[hash] = True


    current_entry: uint256 = self.total_entries
    self.entries[current_entry] = Data(
        registrator=msg.sender,
        hash=hash,
        metadata_id=metadata_id,
        timestamp=block.timestamp,
    )
    self.total_entries += 1

    log EntryAdded(
        _registrator=msg.sender,
        _hash=hash,
        _metadata_id=metadata_id,
        _timestamp=block.timestamp,
    )

    log Transfer(
        _from=empty(address),
        _to=msg.sender,
        _token_id=current_entry,
    )


@external
@pure
def name() -> String[14]:
    return "Yo Custodio VS"


@external
@pure
def symbol() -> String[4]:
    return "YCVS"


@external
@view
def totalSupply() -> uint256:
    return self.total_entries


@external
@view
def balanceOf(owner: address) -> uint256:
    if self == owner:
        return self.total_entries
    return 0


@external
@view
def tokenURI(token_id: uint256) -> String[192]:
    if token_id >= self.total_entries:
        return ""
    return concat(BASE_URI, self.entries[token_id].metadata_id)
