import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Button, Tab, Typography } from '@mui/material';
import axiosClient from '../axios-client';
import PetVaccinationLogs from '../pages/PetVaccinationLogs';
import Consultation from '../pages/Services/Consultation';
import ServiceAvail from '../pages/Services/ServiceAvail';
import PetDewormingLogs from '../pages/Services/PetDewormingLogs';
import TestResults from '../pages/Services/TestResults';

export default function ServiceCatBtns() {

  const [servicesCat, setServicesCat] = useState([]);
  const [services, setServices] = useState([]);
  const [value, setValue] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = () => {
    axiosClient
      .get("/services")
      .then(({ data }) => {
        setServices(data.data);
        const uniqueCategories = Array.from(new Set(data.data.map((service) => service.category.category)));
        setServicesCat(uniqueCategories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };


  const [sid,setSid] = useState(null)

  const handleCategoryClick = (category) => {
setSid(category.id)
    setSelectedCategory(category);
  };

  const handleServiceClick = (service, idx) => {
  setSid(service.id)
  setValue(idx.toString())
    };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {servicesCat.map((category, index) => (
          <Button
            key={index}
            onClick={() => handleCategoryClick(category)}
            variant="contained"
            size="small"
            sx={{ margin: 1 }}
          >
            {category}
          </Button>
        ))}
      </Box>
      {selectedCategory && (
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <TabList aria-label="lab API tabs">
              {services
                .filter((service) => service.category.category === selectedCategory)
                .map((service, idx) => (
                  <Tab
                    key={idx}
                    label={service.service}
                    value={idx.toString()}
                    // onClick={() => handleServiceClick(service, idx)}
                    onClick={() => setValue(idx.toString())}
                  />
                ))}
            </TabList>
            {services
              .filter((service) => service.category.category === selectedCategory)
              .map((service, idx) => (
                <TabPanel key={idx} value={idx.toString()} >
                {service.id == 1 &&  <Consultation sid={service.id} />}
                {service.id == 2 &&  <ServiceAvail title="Home Service" sid={service.id}/>}
                {service.id == 3 &&  <ServiceAvail title="Boarding" sid={service.id}/>}
                {service.id == 4 &&  <ServiceAvail title="Grooming" sid={service.id}/>}
                {service.id == 5 &&  <ServiceAvail title="Surgery" sid={service.id}/>}
                {service.id == 6 &&  <PetVaccinationLogs sid={service.id}/>}
                {service.id == 7 &&  <PetVaccinationLogs sid={service.id}/>}
                {service.id == 8 &&  <PetVaccinationLogs sid={service.id}/>}
                {service.id == 9 &&  <PetVaccinationLogs sid={service.id}/>}
                {service.id == 10 &&  <PetVaccinationLogs sid={service.id}/>}
                {service.id == 11 &&  <PetDewormingLogs sid={service.id}/>}
                {service.id == 12 &&  <TestResults sid={service.id}/>}
                {service.id == 13 &&  <TestResults sid={service.id}/>}
                {service.id == 14 &&  <TestResults sid={service.id}/>}
                {service.id == 15 &&  <TestResults sid={service.id}/>}
                </TabPanel>
              ))}
          </TabContext>
        </Box>
      )}
    </Box>
  );
}
