import CustomImage from '../components/CustomImage';
import { Grid } from '@mui/material';
import { Typography } from 'antd';
import { useLocation } from 'react-router-dom';

const Detail = () => {
  const { state } = useLocation();

  return (
    <Grid container>
      <Grid
        container
        p={2}
        justifyContent="center"
        sx={{ background: '#96B6C5' }}
      >
        <Typography>Image information</Typography>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <CustomImage
       
        >
          <img key={state.id} src={state.detailImage} alt={'test'} />
        </CustomImage>
        <Grid item>
          <Typography sx={{ marginTop: 1 }}>
            Description: {state.alt}
          </Typography>
          <Typography sx={{ marginTop: 1 }}>User: {state.user}</Typography>
          <Typography sx={{ marginTop: 1 }}>Likes: {state.likes}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Detail;
