import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { avsAbi } from "@/lib/abi";
import { avsAddress } from "@/lib/contracts";
import { useReadContract } from "wagmi";
import { Entry } from "@/components/entry";

export const Route = createFileRoute("/entries")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: entries, isPending } = useReadContract({
    address: avsAddress,
    abi: avsAbi,
    functionName: "total_entries",
  });

  if (isPending) {
    return (
      <div className="container mx-auto px-4">
        <Table className="border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Registrator</TableHead>
              <TableHead>Hash</TableHead>
              <TableHead>Data ID</TableHead>
              <TableHead>Image ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Loading...</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Registrator</TableHead>
            <TableHead>Hash</TableHead>
            <TableHead>Data ID</TableHead>
            <TableHead>Image ID</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: Number(entries) }, (_, i) => (
            <Entry key={i} id={BigInt(i)} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
