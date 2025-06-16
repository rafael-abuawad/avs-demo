import { arweaveExplorerLink, formatArweaveId } from "@/lib/utils";
import { arbiscanExplorerLink, formatAddress } from "@/lib/utils";
import { TableCell, TableRow } from "./ui/table";
import { useReadContract } from "wagmi";
import { avsAbi } from "@/lib/abi";
import { avsAddress } from "@/lib/contracts";
import { Button } from "./ui/button";

export function Entry({ id }: { id: bigint }) {
  const { data: entry } = useReadContract({
    address: avsAddress,
    abi: avsAbi,
    functionName: "entries",
    args: [id],
  });

  if (!entry) {
    return null;
  }

  return (
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
          href={arweaveExplorerLink(entry.data_id)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatArweaveId(entry.data_id)}
        </a>
      </TableCell>
      <TableCell>
        <a
          className="hover:underline"
          href={arweaveExplorerLink(entry.image_id)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatArweaveId(entry.image_id)}
        </a>
      </TableCell>
      <TableCell>{entry.timestamp}</TableCell>
      <TableCell>
        <Button variant="outline" asChild>
          <a href={`/verifier/${id}`}>Verify</a>
        </Button>
      </TableCell>
    </TableRow>
  );
}
