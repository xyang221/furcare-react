import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { Add, Delete, Edit, Search } from "@mui/icons-material";


const Tablemui = () => {
  const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Roles" },
    { id: "email", name: "Description" },
    { id: "Actions", name: "Actions" },
  ];

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRoles = () => {
    setLoading(true);
    axiosClient
      .get("/zipcodes")
      .then(({ data }) => {
        setLoading(false);
        setRoles(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDelete = (r) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    axiosClient.delete(`/roles/${r.id}`).then(() => {
      // setNotification("Role deleted");
      getRoles();
    });
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <Paper
      sx={{
        minWidth:"90%",
        padding: "10px",
        margin:"10px"
      }}
    >
      <Box
        p={2}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography variant="h4">Roles</Typography>{" "}
       
        <Button
          component={Link}
          to={"/roles/new"}
          variant="contained"
          size="small"
        >
          <Add />
          <Typography fontSize="12px"> Role</Typography>
        </Button>
      </Box>
      
      <TableContainer sx={{  height: 380 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  style={{ backgroundColor: "black", color: "white" }}
                  key={column.id}
                >
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {loading && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  Loading...
                </TableCell>
              </TableRow>
            </TableBody>
          )}

          {!loading && (
            <TableBody>
              {roles &&
                roles
                  .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((r) => (
                    <TableRow hover role="checkbox" key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.area}</TableCell>
                      <TableCell>{r.province}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Button
                            component={Link}
                            to={`/roles/` + r.id}
                            variant="contained"
                            size="small"
                            color="info"
                          >
                            <Edit fontSize="small" />
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => onDelete(r)}
                          >
                            <Delete fontSize="small" />
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25]}
        rowsPerPage={rowperpage}
        page={page}
        count={roles.length}
        component="div"
        onPageChange={handlechangepage}
        onRowsPerPageChange={handleRowsPerPage}
      ></TablePagination>
    </Paper>
  );
};

export default Tablemui;
