import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';
import PetOwnerPets from '../pages/PetOwnerPets';
import Receipt from '../pages/Receipt';
import PetOwnerAppointments from '../pages/PetOwnerAppointments';
import PetOwnerPayments from '../pages/PetOwnerPayments';
import ServiceCatBtns from './ServiceCatTabs';
import GenerateBilling from '../pages/Billing/GenerateBilling';

export default function PetOWnerTabs() {
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
            <Tab label="Payments" value="3" />
            <Tab label="Services" value="4" />
            <Tab label="Billing" value="5" />
          </TabList>
        </Box>
        <TabPanel value="1"><PetOwnerPets/></TabPanel>
        <TabPanel value="2"><PetOwnerAppointments/></TabPanel>
        <TabPanel value="3"><PetOwnerPayments/></TabPanel>
        <TabPanel value="4"><ServiceCatBtns/> </TabPanel>
        <TabPanel value="5"><GenerateBilling/></TabPanel>
      </TabContext>
    </Box>
  );
}
