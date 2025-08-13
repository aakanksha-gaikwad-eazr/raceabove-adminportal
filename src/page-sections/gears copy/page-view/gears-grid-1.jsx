import { useEffect, useState } from 'react'; // MUI

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination'; // CUSTOM COMPONENTS

import { FlexBetween } from '@/components/flexbox';
import { Paragraph, Small } from '@/components/typography'; // CUSTOM PAGE SECTION COMPONENTS

import SearchArea from '../SearchArea';
import HeadingArea from '../HeadingArea'; // CUSTOM ICON COMPONENTS

import Chat from '@/icons/Chat';
import Email from '@/icons/Email';
import UserBigIcon from '@/icons/UserBigIcon';
import MoreHorizontal from '@/icons/MoreHorizontal'; // CUSTOM UTILS METHOD

import { paginate } from '@/utils/paginate'; // CUSTOM DUMMY DATA
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getGears } from '../../../store/apps/gears';

// import { USER_LIST } from '@/__fakeData__/users';
export default function GearsGrid1PageView() {
  const [userPerPage] = useState(8);
  const [page, setPage] = useState(1);
  // const [users] = useState([...USER_LIST]);
  const [userFilter, setUserFilter] = useState({
    role: '',
    search: ''
  });

  const dispatch = useDispatch()

  const {gears}= useSelector((state)=>state.gears)
  console.log("geards", gears)

  useEffect(()=>{
    dispatch(getGears())
  },[dispatch])

  const handleChangeFilter = (key, value) => {
    setUserFilter(state => ({ ...state,
      [key]: value
    }));
  }; // handle change for tab list


  const changeTab = (_, newValue) => {
    handleChangeFilter('role', newValue);
  };

  const filteredUsers = gears.filter(item => {
    if (userFilter.role) return item.role.toLowerCase() === userFilter.role;else if (userFilter.search) return item.name.toLowerCase().includes(userFilter.search.toLowerCase());else return true;
  });
  const iconStyle = {
    color: 'grey.500',
    fontSize: 18
  };
  return <div className="pt-2 pb-4">
      <Card sx={{
      px: 3,
      py: 2
    }}>
        <HeadingArea value={userFilter.role} changeTab={changeTab} />

        <SearchArea value={userFilter.search} onChange={e => handleChangeFilter('search', e.target.value)} gridRoute="/dashboard/sports-grid" listRoute="/dashboard/user-list" />

        <Grid container spacing={3}>
          {paginate(page, userPerPage, filteredUsers).map((item, index) => <Grid size={{
          lg: 3,
          md: 4,
          sm: 6,
          xs: 12
        }} key={index}>
              <Box sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
                <FlexBetween mx={-1} mt={-1}>
                  <Checkbox size="small" />

                  <IconButton>
                    <MoreHorizontal sx={iconStyle} />
                  </IconButton>
                </FlexBetween>

                <Stack direction="row" alignItems="center" py={2} spacing={2}>
                  <Avatar src={item?.sport?.icon} sx={{
                borderRadius: '20%'
              }} />

                  <div>
                    <Paragraph fontWeight={500}>{item?.sport?.name}</Paragraph>
                    <Small color="grey.500">{item.model}</Small>
                    <br/>
                    <Small color="grey.500">{item.brand}</Small>
                  </div>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  {/* <Email sx={iconStyle} /> */}
                  <Small color="grey.500">Gear type: {item?.type?.name}</Small>
                </Stack>

                <Stack direction="row" alignItems="center" mt={1} spacing={1}>
                    <Small color="grey.500">Icon: {item.icon}</Small>
                  <Stack direction="row" alignItems="center" py={2} spacing={2}>
                  <Avatar src={item?.type?.icon} sx={{
                borderRadius: '20%'
              }} />
              </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" mt={1} spacing={1}>
                  {/* <Chat sx={iconStyle} /> */}
                  <Small color="grey.500">name:{item?.type?.name}</Small>
                </Stack>
              </Box>
            </Grid>)}

          <Grid size={12}>
            <Stack alignItems="center" py={2}>
              <Pagination shape="rounded" count={Math.ceil(filteredUsers.length / userPerPage)} onChange={(_, newPage) => setPage(newPage)} />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </div>;
}