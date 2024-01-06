import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';
import PetOwnerPets from '../pages/PetOwnerPets';
import PetOwnerAppointments from '../pages/PetOwnerAppointments';
import PetOwnerPayments from '../pages/PetOwnerPayments';
import ServiceCatBtns from './ServiceCatTabs';
import GenerateBilling from '../pages/Billing/GenerateBilling';
import ServicesAvailed from '../pages/ServicesAvailed';

export default function PetOWnerTabs({petowner}) {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Pets" value="1" />
            <Tab label="Appointments" value="2" />
            <Tab label="Availed Services" value="3" />
            <Tab label="Payments" value="4" />
            <Tab label="Services" value="5" />
            <Tab label="Billing" value="6" />
          </TabList>
        </Box>
        <TabPanel value="1"><PetOwnerPets/></TabPanel>
        <TabPanel value="2"><PetOwnerAppointments petowner={petowner}/></TabPanel>
        <TabPanel value="3"><ServicesAvailed/></TabPanel>
        <TabPanel value="4"><PetOwnerPayments/></TabPanel>
        <TabPanel value="5"><ServiceCatBtns/> </TabPanel>
        <TabPanel value="6"><GenerateBilling/></TabPanel>
      </TabContext>
    </Box>
  );
}
