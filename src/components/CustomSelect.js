import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CustomSelect = ({ label, value, onChange, elements }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        height={30}
        onChange={(e) => onChange(e.target.value)}
      >
        {elements.map((color) => (
          <MenuItem value={color.value}>{color.text}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
