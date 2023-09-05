import { COLORS, ORIENTATION } from '../constants/dropdownData';
import { Row, Typography } from 'antd';
import { alpha, styled } from '@mui/material/styles';
import { debounce, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

import CustomImage from '../components/CustomImage';
import CustomSelect from '../components/CustomSelect';
import { Grid } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Home = () => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [colorFilter, setColorFilter] = useState('');
  const [orientationFilter, setOrientationFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getImages = async () => {
      try {
        let response;

        if (!isEmpty(colorFilter) && !isEmpty(orientationFilter)) {
          response = await axios.get(
            `https://api.unsplash.com/search/photos?page=${page}&color=${colorFilter}&orientation=${orientationFilter}&query=${query}&client_id=5YCEOeHgKjnf3KAN7kfoIS_76IVZP2rarEqGqIkkFQg`,
          );
        } else if (!isEmpty(colorFilter)) {
          response = await axios.get(
            `https://api.unsplash.com/search/photos?page=${page}&color=${colorFilter}&query=${query}&client_id=5YCEOeHgKjnf3KAN7kfoIS_76IVZP2rarEqGqIkkFQg`,
          );
        } else if (!isEmpty(orientationFilter)) {
          response = await axios.get(
            `https://api.unsplash.com/search/photos?page=${page}}&orientation=${orientationFilter}&query=${query}&client_id=5YCEOeHgKjnf3KAN7kfoIS_76IVZP2rarEqGqIkkFQg`,
          );
        } else {
          response = await axios.get(
            `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=5YCEOeHgKjnf3KAN7kfoIS_76IVZP2rarEqGqIkkFQg`,
          );
        }
        const newPhotos = response.data.results.map((image) => ({
          id: image.id,
          url: image.urls.thumb,
          alt: image.alt_description,
          detailImage: image.urls.small,
          likes: image.likes,
          user: image.user.username,
        }));

        const isFilter = !isEmpty(colorFilter) || !isEmpty(orientationFilter);
        if (isFilter) {
          setPhotos(newPhotos);
        }

        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        if (page < 3) {
          setPage(page + 1);
        }

        setHasMore(response.data.results.length > 0);
      } catch (e) {
        console.log(e);
      }
    };

    if (query) {
      getImages();
    }
  }, [query, colorFilter, orientationFilter, page]);

  const search = (newQuery) => {
    setQuery(newQuery);
    setPhotos([]);
    setPage(1);
    setHasMore(true);
  };

  const debouncedSearch = debounce((newQuery) => {
    search(newQuery);
  }, 2000);

  const onChangeColorFilter = (value) => {
    setColorFilter(value);
  };

  const onChangeOrientationFilter = (value) => {
    setOrientationFilter(value);
  };

  const renderContent = () => {
    if (isEmpty(query)) {
      return <Typography>Search some image...</Typography>;
    } else if (!isEmpty(query) && isEmpty(photos)) {
      return <Typography>Sorry but we don't found nothing</Typography>;
    } else {
      return (
        <InfiniteScroll
          dataLength={photos.length}
          next={() => setPage(page + 1)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <Row gutter={24}>
            {photos.map((photo) => (
              <CustomImage>
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={'test'}
                  onClick={() => {
                    navigate('/detail', { state: photo });
                  }}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </CustomImage>
            ))}
          </Row>
        </InfiniteScroll>
      );
    }
  };

  return (
    <Grid container sx={{ background: '#ADC4CE' }}>
      <Grid container p={2} sx={{ background: '#96B6C5' }}>
        <Grid item>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(event) => debouncedSearch(event.target.value)}
            />
          </Search>
        </Grid>
        <Grid item ml={2}>
          <CustomSelect
            label="Color"
            elements={COLORS}
            value={colorFilter}
            onChange={onChangeColorFilter}
          />
        </Grid>
        <Grid item ml={2}>
          <CustomSelect
            label="Orientation"
            elements={ORIENTATION}
            value={orientationFilter}
            onChange={onChangeOrientationFilter}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justifyContent="center">
        {renderContent()}
      </Grid>
    </Grid>
  );
};

export default Home;
