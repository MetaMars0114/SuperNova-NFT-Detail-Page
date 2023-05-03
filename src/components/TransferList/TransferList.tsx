import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
  Tooltip,
} from "@material-ui/core";
import * as React from "react";
import Link from "@material-ui/core/Link";
import { hexToDate, hexToNumber, hexToString } from "@etclabscore/eserialize";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const rightPaddingFix = {
  paddingRight: "24px",
  border: "0px",
};

const StyledTableRow = styled(TableRow)`
  cursor: pointer;
  &:hover {
    background: #15161726;
  }
`

function TransferList({ transfers }: any) {
  const { t } = useTranslation();
  const history = useHistory()

  
  const sortedTransfers = transfers.sort(
    (a: { block: string }, b: { block: string }) => {
      return Number(b.block) - Number(a.block);
    }
  );

  const handleClickRow = React.useCallback((transfer) => {
    const tokenId = transfer?.token?.id ?? 0;
    history.push(`/detail/${Number(tokenId)}`)
  }, [history])

  if (!transfers) {
    return null;
  }

  return (
    <div
      style={{
        overflowX: "auto",
        margin: "auto",
        padding: "5px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography style={{ fontWeight: "bold" }}>
                {t("Block")}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography style={{ fontWeight: "bold" }}>
                {t("Timestamp")}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography style={{ fontWeight: "bold" }}>
                {t("From")}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography style={{ fontWeight: "bold" }}>{t("To")}</Typography>
            </TableCell>
            <TableCell>
              <Typography style={{ fontWeight: "bold" }}>
                {t("Token Id")}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTransfers.map((b: any, index: number) => {
            // Calculate difference of block timestamp from that of parent.
            return (
              <StyledTableRow key={b.block} onClick={() => handleClickRow(b)}>
                <TableCell component="th" scope="row" style={rightPaddingFix}>
                  <Link
                    component={({
                      className,
                      children,
                    }: {
                      children: any;
                      className: string;
                    }) => (
                        <>{children}</>
                    )}
                  >
                    {parseInt(b.block, 16)}
                  </Link>
                </TableCell>

                <TableCell style={rightPaddingFix}>
                  <Typography>
                    {t("Timestamp Date", { date: hexToDate(b.timestamp) })}
                    &nbsp;
                  </Typography>
                </TableCell>

                <TableCell style={rightPaddingFix}>
                  <Typography>{b.from.id}</Typography>
                </TableCell>

                <TableCell style={rightPaddingFix}>
                  <Typography>{b.to.id}</Typography>
                </TableCell>

                <TableCell style={rightPaddingFix}>
                  <Typography>{Number(b.token.id)}</Typography>
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default TransferList;
