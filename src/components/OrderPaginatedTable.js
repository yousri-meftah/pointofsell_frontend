import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const OrderPaginatedTable = ({
  data,
  columns,
  onRowClick,
  page,
  totalPages,
  onPageChange,
}) => {
  console.log("dattttaaa = ",data);
  
  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
              <TableCell>Lines</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} onClick={() => onRowClick(row.id)}>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.format
                      ? column.format(row[column.field])
                      : row[column.field]}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton>
                    <MenuIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-end mt-4">
        <Pagination
          count={totalPages}
          page={page - 1}
          onChange={(_, newPage) => onPageChange(newPage + 1)}
        />
      </div>
    </div>
  );
};

export default OrderPaginatedTable;
