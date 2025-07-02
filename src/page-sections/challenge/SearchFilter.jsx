import Add from '@mui/icons-material/Add'; // MUI

import Button from '@mui/material/Button';
import styled from '@mui/material/styles/styled'; // CUSTOM COMPONENTS

import SearchInput from '@/components/search-input'; // STYLED COMPONENTS
import { useNavigate } from 'react-router-dom';

const SearchAction = styled('div')(({
  theme
}) => ({
  gap: 8,
  display: 'flex',
  flexWrap: 'wrap',
  paddingBlock: '2rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    '& > *': {
      width: '100%',
      maxWidth: '100%'
    }
  }
})); // ==============================================================

// ==============================================================
export default function SearchFilter({
  handleChange,
  handleOpenModal
}) {
    const navigate = useNavigate();
  
  return <SearchAction>
      <SearchInput placeholder="Find Projects" onChange={e => handleChange(e.target.value)} />

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/add-challenge")}>
        Create a Challenge
      </Button>
    </SearchAction>;
}