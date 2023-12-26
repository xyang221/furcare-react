import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import ChargeSlipDetailsModal from "../components/modals/ChargeSlipDetailsModal";

export default function PetOwnerPayments() {
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Deposit", name: "Deposit" },
    { id: "Balance", name: "Balance" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const { id } = useParams();
  const [chargeslip, setChargeSlip] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [modalloading, setModalloading] = useState(false);
  const [servicesavailed, setServicesavailed] = useState([]);
  const [petowner, setPetowner] = useState([]);
  const [clientservice, setClientservice] = useState([]);
  const [openmodal, setOpenmodal] = useState(false);

  const getPayments = () => {
    setLoading(true);
    axiosClient
      .get(`/clientservices/petowner/${id}/all`)
      .then(({ data }) => {
        setLoading(false);
        setChargeSlip(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const getServicesAvailed = (r) => {
    setMessage(null);
    setModalloading(true);
    setServicesavailed([]);
    setOpenmodal(true);
    axiosClient
      .get(`/clientservices/${r.id}/services`)
      .then(({ data }) => {
        setServicesavailed(data.data);
        setPetowner(data.clientservice.petowner);
        setClientservice(data.clientservice);
        setModalloading(false);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setModalloading(false);
      });
  };

  const closeModal = () => {
    setOpenmodal(false);
  };

  const calculateTotal = () => {
    const total = servicesavailed.reduce((accumulatedTotal, item) => {
      const price = item.unit_price || 0;
      return accumulatedTotal + price * item.quantity;
    }, 0);

    return total.toFixed(2);
  };

  const windowOpenPDFforPrint = async () => {
    try {
      // Fetch PDF content
      const response = await axiosClient.get(
        `/clientservice/${clientservice.id}/generate-chargeslip`,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );

      const pdfBlob = response.data;

      const url = window.URL.createObjectURL(new Blob([pdfBlob]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `ChargeSlip-${
          clientservice.date
        }-${`${petowner.firstname}_${petowner.lastname}`}-.pdf`
      );
      document.body.appendChild(link);

      // Trigger the download
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <>
      <Box
        flex={5}
        sx={{
          minWidth: "90%",
        }}
      >
        <ChargeSlipDetailsModal
          open={openmodal}
          onClose={closeModal}
          petowner={petowner}
          clientservice={clientservice}
          servicesavailed={servicesavailed}
          calculateTotal={calculateTotal()}
          loading={modalloading}
          printPDF={windowOpenPDFforPrint}
        />

        <Divider />
        <TableContainer sx={{ height: 350 }}>
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
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {chargeslip &&
                  chargeslip
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.deposit.toFixed(2)}</TableCell>
                        <TableCell>{r.balance.toFixed(2)}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            color="info"
                            onClick={() => getServicesAvailed(r)}
                          >
                            details
                          </Button>
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
          count={chargeslip.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
