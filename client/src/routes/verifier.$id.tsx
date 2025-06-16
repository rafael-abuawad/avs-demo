import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Trash2Icon,
  SparklesIcon,
  Loader2Icon,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { useReadContract } from "wagmi";
import { avsAbi } from "@/lib/abi";
import { avsAddress } from "@/lib/contracts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/verifier/$id")({
  component: Verifier,
});

function Verifier() {
  const { id } = Route.useParams();

  const {
    data: entry,
    error,
    isLoading,
  } = useReadContract({
    address: avsAddress,
    abi: avsAbi,
    functionName: "entries",
    args: [BigInt(id)],
  });

  const [keyValues, setKeyValues] = useState<{ key: string; value: number }[]>([
    { key: "", value: 0 },
  ]);
  const [hashedJson, setHashedJson] = useState("");
  const [comparisonStatus, setComparisonStatus] = useState<
    "idle" | "matching" | "mismatch"
  >("idle");

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

    const shuffledPool = [...cryptoPool].sort(() => 0.5 - Math.random());
    const numberOfItems = Math.floor(Math.random() * 3) + 3;
    const selectedItems = shuffledPool.slice(0, numberOfItems);

    const dummyData = selectedItems.map(({ key, basePrice }) => {
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
    updatedKeyValues[index].key = newKey;
    setKeyValues(updatedKeyValues);
  };

  const handleValueChange = (index: number, newValue: number) => {
    const updatedKeyValues = [...keyValues];
    updatedKeyValues[index].value = newValue;
    setKeyValues(updatedKeyValues);
  };

  useEffect(() => {
    const dataEntries = keyValues
      .filter((item) => item.key && item.value !== 0)
      .map(({ key, value }) => ({
        key: key,
        value: BigInt(value),
      }));

    if (dataEntries.length === 0) {
      setHashedJson("");
      setComparisonStatus("idle");
      return;
    }

    const abi = parseAbiParameters("(string key, uint256 value)[]");
    const encodedData = encodeAbiParameters(abi, [dataEntries]);
    const hash = keccak256(encodedData);
    setHashedJson(hash);

    if (entry) {
      if (hash === entry.hash) {
        setComparisonStatus("matching");
      } else {
        setComparisonStatus("mismatch");
      }
    }
  }, [keyValues, entry]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  if (
    error ||
    !entry ||
    entry.hash ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
  ) {
    return (
      <div className="container mx-auto px-4 mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not fetch the entry. Please check the index or try again
            later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mb-16">
      <Card>
        <CardHeader>
          <CardTitle>Entry Details (Index: {id})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Hash:</span>
              <code className="col-span-2 break-all">{entry.hash}</code>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Data ID:</span>
              <code className="col-span-2 break-all">{entry.data_id}</code>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Image ID:</span>
              <code className="col-span-2 break-all">{entry.image_id}</code>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Registrator:</span>
              <code className="col-span-2 break-all">{entry.registrator}</code>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold">Timestamp:</span>
              <span className="col-span-2">
                {new Date(Number(entry.timestamp) * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Verify Data</CardTitle>
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

      {hashedJson && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Generated Hash</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-4">
              <code className="break-words">{hashedJson}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="mt-4">
        {comparisonStatus === "idle" && (
          <Alert>
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Verification Status</AlertTitle>
            <AlertDescription>
              Enter key-value pairs to generate a hash and compare it with the
              one from the entry.
            </AlertDescription>
          </Alert>
        )}
        {comparisonStatus === "matching" && (
          <Alert className="bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Hashes Match!</AlertTitle>
            <AlertDescription>
              The generated hash matches the hash of the entry.
            </AlertDescription>
          </Alert>
        )}
        {comparisonStatus === "mismatch" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hashes Do Not Match</AlertTitle>
            <AlertDescription>
              The generated hash does not match the hash of the entry.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
