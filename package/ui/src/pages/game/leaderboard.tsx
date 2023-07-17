import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { useJunofarmsLeaderboardQuery } from "../../codegen/Junofarms.react-query";
import useJunofarmsQueryClient from "../../hooks/use-juno-junofarms-query-client";

export default function Leaderboard() {
  const junofarmsQueryClient = useJunofarmsQueryClient();
  const leaderboard = useJunofarmsLeaderboardQuery({
    client: junofarmsQueryClient,
    options: {
      refetchInterval: 10000,
      suspense: true,
    },
  });

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Address</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {leaderboard.data?.map(([address, total], idx) => (
            <Tr key={address}>
              <Td>{idx + 1}</Td>
              <Td>{address}</Td>
              <Td>{total}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
