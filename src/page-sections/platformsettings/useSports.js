import { useEffect, useState } from 'react'; // CUSTOM DATA

// import { PROJECTS } from '@/__fakeData__/projects';
import { useDispatch, useSelector } from 'react-redux';
import { getSports } from '../../store/apps/sports';
export default function useSports() {
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    searchValue: ''
  });

   const dispatch = useDispatch()
    const {sports} = useSelector(state=>state.sports)
  
     useEffect(() => {
        dispatch(
          getSports()
        )
      }, [dispatch])

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => setOpenModal(false);

  const handleChangeFilter = (key, value) => {
    setFilters(state => ({ ...state,
      [key]: value
    }));
  };

  const FILTERED_PROJECTS = sports.filter(item => filters.status === 'all' || item.status === filters.status).filter(pro => pro.name.toLowerCase().includes(filters.searchValue.toLowerCase()));
  return {
    FILTERED_PROJECTS,
    filters,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleChangeFilter
  };
}