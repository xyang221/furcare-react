import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Add, Archive, Close, Delete, Edit, Search } from "@mui/icons-material";
import Swal from "sweetalert2";
import PaymentModal from "../components/modals/PaymentModal";

export default function Payments() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "Date", name: "Date" },
    { id: "Ref #", name: "Ref #" },
    { id: "Type", name: "Type" },
    { id: "Total", name: "Total" },
    { id: "Amount", name: "Amount" },
    { id: "Change", name: "Change" },
    // { id: "Actions", name: "Actions" },
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

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [paymentrecord, setPaymentRecord] = useState({
    id: null,
    chargeslip_ref_no: "",
    type: "Cash",
    type_ref_no: "",
    total: null,
    amount: null,
    change: null,
  });

  const getPayments = () => {
    setMessage(null);
    setPayments([]);
    setLoading(true);
    axiosClient
      .get("/paymentrecords")
      .then(({ data }) => {
        setLoading(false);
        setPayments(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const onDelete = (r) => {
    Swal.fire({
      title: "Are you sure to archive this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/payments/${r.id}/archive`).then(() => {
          Swal.fire({
            title: "Vet was archived!",
            icon: "error",
          }).then(() => {
            getPayments();
          });
        });
      }
    });
  };

  //for modal
  const [open, openchange] = useState(false);

  const functionopenpopup = (ev) => {
    setPaymentRecord({});
    setErrors(null);
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
  };

  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);

  const onEdit = (r) => {
    setModalloading(true);
    axiosClient
      .get(`/payments/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setPaymentRecord(data);
      })
      .catch(() => {
        setModalloading(false);
      });

    openchange(true);
  };

  const onSubmit = () => {
    if (paymentrecord.id) {
      axiosClient
        .put(`/payments/${paymentrecord.id}`, paymentrecord)
        .then(() => {
          openchange(false);
          getPayments();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/payments`, paymentrecord)
        .then(() => {
          openchange(false);
          getPayments();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
        }}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Payment Records</Typography>
        </Box>

        {/* <PaymentModal
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={loading}
          payment={paymentrecord}
          setPayment={setPaymentRecord}
          clientservice={clientservice}
          pastbalance={pastbalance}
          calculateBalance={calculateBalance}
          //  errors={errors}
        /> */}

        <TableContainer sx={{ height: "!00%" }}>
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
                  <TableCell
                    colSpan={columns.length}
                    style={{ textAlign: "center" }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    style={{ textAlign: "center" }}
                  >
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {payments &&
                  payments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.chargeslip_ref_no}</TableCell>
                        <TableCell>
                          {r.type === "Cash"
                            ? `${r.type}`
                            : `${r.type} ${r.type_ref_no}`}
                        </TableCell>
                        <TableCell>{r.total.toFixed(2)}</TableCell>
                        <TableCell>{r.amount.toFixed(2)}</TableCell>
                        <TableCell>{r.change.toFixed(2)}</TableCell>
                        {/* <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              size="small"
                              color="info"
                              onClick={() => onEdit(r)}
                            >
                              <Edit fontSize="small" />
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => onDelete(r)}
                            >
                              <Archive fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell> */}
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
          count={payments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
