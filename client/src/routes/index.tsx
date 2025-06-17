import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2Icon, SparklesIcon, Loader2Icon } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { avsAbi } from "@/lib/abi";
import { avsAddress } from "@/lib/contracts";
import { toast } from "sonner";
import { ConnectKitButton } from "connectkit";
import { NoWallet } from "@/components/no-wallet";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { isConnected } = useAccount();
  const [keyValues, setKeyValues] = useState<{ key: string; value: number }[]>([
    { key: "", value: 0 },
  ]);
  const [jsonOutput, setJsonOutput] = useState("");
  const [hashedJson, setHashedJson] = useState("");
  const [dataId, setDataId] = useState("");
  const [imageId, setImageId] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();

  const dataEntries = useMemo(
    () =>
      keyValues
        .filter((item) => item.key && item.value !== 0)
        .map(({ key, value }) => ({
          key: key,
          value: isNaN(value) ? BigInt(0) : BigInt(value),
        })),
    [keyValues],
  );

  const handleAddPair = () => {
    setKeyValues([...keyValues, { key: "", value: 0 }]);
  };

  const handleAddDummyData = () => {
    const cryptoPool = [
      { key: "BTC", basePrice: 68000 },
      { key: "ETH", basePrice: 3500 },
      { key: "SOL", basePrice: 150 },
      { key: "DOGE", basePrice: 15 },
      { key: "ADA", basePrice: 1 },
      { key: "XRP", basePrice: 1 },
      { key: "DOT", basePrice: 7 },
      { key: "LINK", basePrice: 15 },
      { key: "AVAX", basePrice: 35 },
      { key: "MATIC", basePrice: 1 },
    ];

    // Shuffle the pool to get random items
    const shuffledPool = [...cryptoPool].sort(() => 0.5 - Math.random());

    // Select a random number of items (e.g., 3 to 5)
    const numberOfItems = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 items
    const selectedItems = shuffledPool.slice(0, numberOfItems);

    const dummyData = selectedItems.map(({ key, basePrice }) => {
      // Add some randomness to the price (+/- 50%)
      const randomFactor = 1 + (Math.random() - 0.5) * 1;
      const value = Math.round(basePrice * randomFactor);
      return { key, value };
    });

    setKeyValues(dummyData);
  };

  const handleDeletePair = (index: number) => {
    const updatedKeyValues = keyValues.filter((_, i) => i !== index);
    setKeyValues(updatedKeyValues);
  };

  const handleKeyChange = (index: number, newKey: string) => {
    const updatedKeyValues = [...keyValues];
    if (!updatedKeyValues[index]) return;

    updatedKeyValues[index].key = newKey;
    setKeyValues(updatedKeyValues);
  };

  const handleValueChange = (index: number, newValue: number) => {
    const updatedKeyValues = [...keyValues];
    if (!updatedKeyValues[index]) return;

    updatedKeyValues[index].value = newValue;
    setKeyValues(updatedKeyValues);
  };

  const handleAddEntry = async () => {
    toast.promise(
      writeContractAsync({
        address: avsAddress,
        abi: avsAbi,
        functionName: "add_entry",
        args: [dataId, imageId, dataEntries],
      }),
      {
        loading: "Adding entry...",
        success: "Entry added successfully",
        error: "Failed to add entry",
      },
    );
  };

  const generateArweaveId = () => {
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
    const base64 = btoa(
      String.fromCharCode.apply(null, Array.from(randomBytes)),
    );
    const base64url = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return base64url;
  };

  useEffect(() => {
    if (dataEntries.length === 0) {
      setJsonOutput("");
      setHashedJson("");
      return;
    }

    const abi = parseAbiParameters("(string key, uint256 value)[]");

    const jsonString = JSON.stringify(
      dataEntries,
      (_key, value) => (typeof value === "bigint" ? Number(value) : value),
      2,
    );
    setJsonOutput(jsonString);

    const encodedData = encodeAbiParameters(abi, [dataEntries]);
    setHashedJson(keccak256(encodedData));
  }, [dataEntries]);

  return (
    <div className="container mx-auto px-4 relative">
      <Card>
        <CardHeader>
          <CardTitle>Key-Value Pairs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {keyValues.map((kv, index) => (
              <div key={index} className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Key"
                  value={kv.key}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleKeyChange(index, e.target.value)
                  }
                />
                <Input
                  placeholder="Value"
                  value={kv.value}
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleValueChange(index, e.target.valueAsNumber)
                  }
                />
                {keyValues.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeletePair(index)}
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleAddPair}
              >
                Add Pair
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddDummyData}
              >
                <SparklesIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {jsonOutput && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>JSON Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-4">
                <code>{jsonOutput}</code>
              </pre>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Hashed JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-4">
                <code className="break-words">{hashedJson}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setDataId(generateArweaveId());
                setImageId(generateArweaveId());
              }}
            >
              Upload File
            </Button>
            {imageId && (
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-4">
                <code className="break-words">{imageId}</code>
              </pre>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 mb-16">
        {isConnected ? (
          <Button
            disabled={
              !isConnected ||
              isPending ||
              dataEntries.length === 0 ||
              !dataId ||
              !imageId
            }
            className="w-full"
            onClick={handleAddEntry}
          >
            {isPending && <Loader2Icon className="w-4 h-4 animate-spin" />}
            {isPending ? "Adding entry..." : "Add Entry"}
          </Button>
        ) : (
          <ConnectKitButton.Custom>
            {({ show }) => {
              return (
                <Button className="w-full" onClick={show}>
                  Connect Wallet
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
        )}
      </div>

      <NoWallet />
    </div>
  );
}
