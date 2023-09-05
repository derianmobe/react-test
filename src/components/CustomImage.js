import { Card } from '@mui/material';

const CustomImage = ({ children }) => {
  return (
    <Card
      sx={{
        margin: 2,
        padding: 2,
        cursor: 'pointer',
      }}
    >
      {children}
    </Card>
  );
};

export default CustomImage;
