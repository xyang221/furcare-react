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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {servicesCat.map((category, index) => (
          <Button
            key={index}
            onClick={() => handleCategoryClick(category)}
            variant="contained"
            size="small"
            startIcon={categoryIcons[category]}
            sx={{ margin: 1, height: "35px", width: "200px" }}
          >
            {category}
          </Button>
        ))}
      </Box>
      {selectedCategory && (
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
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
            {services
              .filter(
                (service) => service.category.category === selectedCategory
              )
              .map((service, idx) => (
                <TabPanel key={idx} value={idx.toString()}>
                  {service.id == 1 && <Consultation sid={service.id} />}
                  {service.id == 2 && (
                    <ServiceAvail title="Home Service" sid={service.id} />
                  )}
                  {service.id == 3 && (
                    <ServiceAvail title="Boarding" sid={service.id} />
                  )}
                  {service.id == 4 && (
                    <ServiceAvail title="Grooming" sid={service.id} />
                  )}
                  {service.id == 5 && (
                    <ServiceAvail title="Surgery" sid={service.id} />
                  )}
                  {service.id == 6 && <Vaccination sid={service.id} />}
                  {service.id == 7 && <Vaccination sid={service.id} />}
                  {service.id == 8 && <Vaccination sid={service.id} />}
                  {service.id == 9 && <Vaccination sid={service.id} />}
                  {service.id == 10 && <Vaccination sid={service.id} />}
                  {service.id == 11 && <Deworming sid={service.id} />}
                  {service.id == 12 && <TestResults sid={service.id} />}
                  {service.id == 13 && <TestResults sid={service.id} />}
                  {service.id == 14 && <TestResults sid={service.id} />}
                  {service.id == 15 && <TestResults sid={service.id} />}
                  {service.id == 16 && <TestResults sid={service.id} />}
                  {service.id == 17 && <TestResults sid={service.id} />}
                  {service.id == 18 && <TestResults sid={service.id} />}
                  {service.id == 19 && (
                    <ServiceAvail title="Medicines" sid={service.id} />
                  )}
                  {service.id == 22 && <TreatmentForm sid={service.id} />}
                </TabPanel>
              ))}
          </TabContext>
        </Box>
      )}
    </Box>
  );
}
