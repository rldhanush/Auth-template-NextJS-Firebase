// components/TimeZoneSelect.tsx
'use client';

import React from 'react';
import moment from 'moment-timezone';
import Select from 'react-select';

const timezoneOptions = moment.tz.names().map((tz) => ({
  label: `${tz} (UTC${moment.tz(tz).format('Z')})`,
  value: tz,
}));

interface TimeZoneSelectProps {
  onChange: (value: string) => void;
  value: string | null;
}

const TimeZoneSelect: React.FC<TimeZoneSelectProps> = ({ onChange, value }) => {
  return (
    <Select
      options={timezoneOptions}
      value={timezoneOptions.find((opt) => opt.value === value)}
      onChange={(selected) => onChange(selected?.value || '')}
      isClearable
      placeholder="Select your time zone"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#E2E8F0', // Chakra gray.200
          boxShadow: 'none',
          '&:hover': { borderColor: '#CBD5E0' }, // Chakra gray.300
        }),
        menu: (base) => ({
          ...base,
          zIndex: 20, // ensure it shows above other components
        }),
      }}
    />
  );
};

export default TimeZoneSelect;
