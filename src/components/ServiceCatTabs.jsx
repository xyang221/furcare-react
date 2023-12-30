import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Button, Tab, Typography } from "@mui/material";
import axiosClient from "../axios-client";
import Consultation from "../pages/Services/Consultation";
import ServiceAvail from "../pages/Services/ServiceAvail";
import Deworming from "../pages/Services/Deworming";
import TestResults from "../pages/Services/TestResults";
import {
  Apartment,
  Block,
  ContentCut,
  ControlPointDuplicate,
  Error,
  FolderCopy,
  Healing,
  Home,
  Hotel,
  LocalHospital,
  MedicalServices,
  Medication,
  Pets,
  Vaccines,
} from "@mui/icons-material";
import TreatmentForm from "../pages/TreatmentForm";
import Vaccination from "../pages/Services/Vaccination";
import AdmissionTabs from "./AdmissionTabs";
import Admissions from "../pages/Admissions";

export default function ServiceCatBtns() {
  const [servicesCat, setServicesCat] = useState([]);
  const [services, setServices] = useState([]);
  const [value, setValue] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = () => {
    axiosClient
      .get("/services")
      .then(({ data }) => {
        setServices(data.data);
        const uniqueCategories = Array.from(
          new Set(data.data.map((service) => service.category.category))
        );
        setServicesCat(uniqueCategories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const categoryIcons = {
    Consultation: <MedicalServices />,
    "Home Service": <Home />,
    Boarding: <Apartment />,
    Grooming: <ContentCut />,
    Surgery: <Healing />,
    Vaccination: <Vaccines />,
    Deworming: <Vaccines />,
    Tests: <FolderCopy />,
    Medicines: <Medication />,
    "Tick/Flea Treatment": <Medication />,
    Admission: <LocalHospital />,
    Others: <ControlPointDuplicate />,
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setValue("0");
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      {servicesCat.map((category, index) => (
        <Button
          key={index}
          onClick={() => handleCategoryClick(category)}
          variant="contained"
          size="small"
          startIcon={categoryIcons[category]}
          sx={{ margin: 1, height: "35px", width: "230px" }}
        >
          {category}
        </Button>
      ))}
      {selectedCategory && (
        <Box sx={{ width: "100%", borderColor: "divider", marginTop: "10px" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList aria-label="lab API tabs">
                {services
                  .filter(
                    (service) => service.category.category === selectedCategory
                  )
                  .map((service, idx) => (
                    <Tab
                      key={idx}
                      label={service.service}
                      value={idx.toString()}
                      onClick={() => setValue(idx.toString())}
                      icon={
                        service.isAvailable === 0 ? (
                          <Block color="error" fontSize="inherit" />
                        ) : null
                      }
                    />
                  ))}
              </TabList>
            </Box>
            {services
              .filter(
                (service) => service.category.category === selectedCategory
              )
              .map((service, idx) => (
                <TabPanel key={idx} value={idx.toString()}>
                  {service.service == "Consultation" && (
                    <Consultation sid={service.id} />
                  )}
                  {service.service == "Home Service" && (
                    <ServiceAvail title="Home Service" sid={service.id} />
                  )}
                  {service.service == "Boarding" && (
                    <ServiceAvail title="Boarding" sid={service.id} />
                  )}
                  {service.service == "Grooming" && (
                    <ServiceAvail title="Grooming" sid={service.id} />
                  )}
                  {service.service == "Surgery" && (
                    <ServiceAvail title="Surgery" sid={service.id} />
                  )}
                  {service.service == "DHLPPI" && (
                    <Vaccination sid={service.id} />
                  )}
                  {service.service == "BRONCHICINE" && (
                    <Vaccination sid={service.id} />
                  )}
                  {service.service == "HEARTWORM" && (
                    <Vaccination sid={service.id} />
                  )}
                  {service.service == "RABIES" && (
                    <Vaccination sid={service.id} />
                  )}
                  {service.service == "TRICAT" && (
                    <Vaccination sid={service.id} />
                  )}
                  {service.service == "Deworming" && (
                    <Deworming sid={service.id} />
                  )}
                  {service.service == "CBC" && (
                    <TestResults sid={service.id} sname={service.service} />
                  )}
                  {service.service == "BLOOD CHEM" && (
                    <TestResults sid={service.id} sname={service.service} />
                  )}
                  {service.service == "PARVO TEST" && (
                    <TestResults sid={service.id} sname={service.service} />
                  )}
                  {service.service == "DISTEMPER" && (
                    <TestResults sid={service.id} sname={service.service} />
                  )}
                  {service.service == "EHRLICHIA" && (
                    <TestResults sid={service.id} sname={service.service} />
                  )}
                  {service.service == "HEARTWORM" && (
                    <TestResults sid={service.id} sname={service.service} />
                  )}
                  {service.service == "4DX" && (
                    <TestResults sid={service.id} sname={service.service} />
                  )}
                  {service.service == "Medicine" && (
                    <ServiceAvail title="Medicines" sid={service.id} />
                  )}
                  {service.service == "Tick/Flea Treatment" && (
                    <ServiceAvail
                      title="Tick/Flea Treatment"
                      sid={service.id}
                    />
                  )}
                  {service.service == "Admission" && (
                    <Admissions sid={service.id} />
                  )}
                </TabPanel>
              ))}
          </TabContext>
        </Box>
      )}
    </Box>
  );
}
