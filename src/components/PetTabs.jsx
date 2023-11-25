import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tab } from '@mui/material';
import PetVaccinationLogs from '../pages/PetVaccinationLogs';
import PetDewormingLogs from '../pages/Services/PetDewormingLogs';
import Diagnosis from '../pages/Diagnosis';
import Services from '../pages/Services';

export default function PetTabs() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs">
            <Tab label="Avail Service" value="1" />
            <Tab label="Vaccination Logs" value="2" />
            <Tab label="Deworming Logs" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1"><Services/></TabPanel>
        <TabPanel value="2"><PetVaccinationLogs/> </TabPanel>
        <TabPanel value="3"><PetDewormingLogs/></TabPanel>
      </TabContext>
    </Box>
  );
}
