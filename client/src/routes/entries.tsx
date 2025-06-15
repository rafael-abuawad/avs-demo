import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  arbiscanExplorerLink,
  arweaveExplorerLink,
  formatAddress,
  formatArweaveId,
} from "@/lib/utils";

export const Route = createFileRoute("/entries")({
  component: RouteComponent,
});

const entries = [
  {
    registrator: "0x1234567890123456789012345678901234567890",
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    arweave_id: "arweave_id_1",
    timestamp: "1672531199",
  },
  {
    registrator: "0x0987654321098765432109876543210987654321",
    hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    arweave_id: "arweave_id_2",
    timestamp: "1672531200",
  },
];

function RouteComponent() {
  return (
    <div className="container mx-auto px-4">
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Registrator</TableHead>
            <TableHead>Hash</TableHead>
            <TableHead>Arweave ID</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.hash}>
              <TableCell>
                <a
                  className="hover:underline"
                  href={arbiscanExplorerLink(entry.registrator, "address")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatAddress(entry.registrator)}
                </a>
              </TableCell>
              <TableCell>{entry.hash}</TableCell>
              <TableCell>
                <a
                  className="hover:underline"
                  href={arweaveExplorerLink(entry.arweave_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatArweaveId(entry.arweave_id)}
                </a>
              </TableCell>
              <TableCell>{entry.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
