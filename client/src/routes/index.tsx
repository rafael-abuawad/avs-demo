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
import { Trash2Icon, SparklesIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [keyValues, setKeyValues] = useState<{ key: string; value: number }[]>([
    { key: "", value: 0 },
  ]);
  const [jsonOutput, setJsonOutput] = useState("");
  const [hashedJson, setHashedJson] = useState("");
  const [arweaveId, setArweaveId] = useState("");

  const handleAddPair = () => {
    setKeyValues([...keyValues, { key: "", value: 0 }]);
  };

  const handleAddDummyData = () => {
    const dummyData = [
      { key: "BTC", value: 68000 },
      { key: "ETH", value: 3500 },
      { key: "SOL", value: 150 },
      { key: "DOGE", value: 15 },
    ];
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

  const handleGenerateArweaveId = () => {
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
    const base64 = btoa(
      String.fromCharCode.apply(null, Array.from(randomBytes)),
    );
    const base64url = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    setArweaveId(base64url);
  };

  useEffect(() => {
    const dataEntries = keyValues
      .filter((item) => item.key && item.value !== 0)
      .map(({ key, value }) => ({
        key: key,
        value: BigInt(value),
      }));

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
  }, [keyValues]);

  return (
    <div className="container mx-auto px-4">
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
          <CardTitle>Arweave ID</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button variant="outline" onClick={handleGenerateArweaveId}>
              Upload File & Generate ID (mock)
            </Button>
            {arweaveId && (
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-4">
                <code className="break-words">{arweaveId}</code>
              </pre>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 mb-16">
        <Button className="w-full">Add Entry</Button>
      </div>
    </div>
  );
}
