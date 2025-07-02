import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast'; // MUI

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel'; // MUI ICON COMPONENTS

import Edit from '@mui/icons-material/Edit';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';
import DeleteOutline from '@mui/icons-material/DeleteOutline'; // CUSTOM COMPONENTS

import FlexBox from '@/components/flexbox/FlexBox';
import { Paragraph } from '@/components/typography';
import { TableMoreMenuItem, TableMoreMenu } from '@/components/table';
import DeleteModal from '@/components/delete-modal';
import { deleteAddOns, getAddOns, updateAddOns } from '@/store/apps/addons';
import { getAddOnsCategory } from '@/store/apps/addonscategory';
import EditModal from '@/components/edit-modal/EditModal';
import AddOnsDeleteForm from './page-view/addonUpdateForm';
import AddOnsUpdateForm from './page-view/addonUpdateForm';

// ==============================================================
export default function ProductTableRow({
  product,
  isSelected,
  handleSelectRow,
  handleDeleteProduct,
  handleEditProduct
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const {addOnsCategory} = useSelector((state) => state.addonscategory);

  useEffect(() => {
    dispatch(getAddOnsCategory());
  }, [dispatch]);

  const handleOpenMenu = event => {
    setOpenMenuEl(event.currentTarget);
  };

  const handleCloseOpenMenu = () => setOpenMenuEl(null);

  const handleEditClick = () => {
    console.log("Product data being passed to form:", product);
    setOpenEditModal(true);
    handleCloseOpenMenu();
  };

  const handleDeleteClick = () => {
    setOpenDeleteModal(true);
    handleCloseOpenMenu();
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await dispatch(deleteAddOns(product.id)).unwrap();
      
      if (response?.status === 200) {
        await dispatch(getAddOns());
        toast.success('Add-on deleted successfully');
        handleDeleteProduct(product.id);
      } else {
        toast.error('Failed to delete add-on');
      }
    } catch (error) {
      console.error('Error deleting add-on:', error);
      toast.error(error?.message || 'Failed to delete add-on');
    } finally {
      setOpenDeleteModal(false);
    }
  };

  // const renderCategoryField = (field) => {
  //   return (
  //     <FormControl fullWidth disabled={!addOnsCategory?.length}>
  //       <InputLabel id="category-select-label">Category</InputLabel>
  //       <Select
  //         labelId="category-select-label"
  //         id="category-select"
  //         name={field.name}
  //         value={field.value || ''}
  //         label="Category"
  //         onChange={(e) => field.onChange(e)} 
  //       >
  //         {addOnsCategory?.map((category) => (
  //           <MenuItem key={category.id} value={category.id}>
  //             {category.name}
  //           </MenuItem>
  //         ))}
  //       </Select>
  //     </FormControl>
  //   );
  // };

  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primsary" checked={isSelected} onClick={event => handleSelectRow(event, product.id)} />
      </TableCell>

      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Avatar variant="rounded" alt={product.name} src={product.image} sx={{
          width: 50,
          height: 50
        }} />

          <div>
            <Paragraph fontWeight={500} color="text.primary" sx={{
            ':hover': {
              textDecoration: 'underline',
              cursor: 'pointer'
            }
          }}>
              {product.name}
            </Paragraph>
            <Paragraph fontSize={13}>{product?.description}</Paragraph>
          </div>
        </FlexBox>
      </TableCell>

      {/* <TableCell padding="normal">{format(new Date(product.createdAt), 'dd MMM yyyy')}</TableCell> */}

      <TableCell padding="normal" sx={{ ...(product.stock === 0 && {
        color: 'error.main'
      })
    }}>
        {product?.category?.name}
      </TableCell>

      <TableCell padding="normal">₹{product.price}</TableCell>

      <TableCell padding="normal">
        {/* {product.published ? <Chip label="Published" /> : <Chip label="Draft" color="secondary" />} */}
      </TableCell>

      <TableCell padding="normal" align="right">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
          <TableMoreMenuItem Icon={RemoveRedEye} title="View" handleClick={() => {
          handleCloseOpenMenu();
          navigate('/dashboard/product-details');
        }} />
          <TableMoreMenuItem Icon={Edit} title="Edit" handleClick={handleEditClick} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={handleDeleteClick} />
        </TableMoreMenu>
      </TableCell>

      <DeleteModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        title="Delete Confirmation"
        message={`Are you sure you want to delete ${product.name}?`}
        actions={[
          {
            label: "Cancel",
            props: { onClick: () => setOpenDeleteModal(false), variant: "outlined" },
          },
          {
            label: "Delete",
            props: { onClick: handleDeleteConfirm, color: "error" },
          },
        ]}
      />

      <AddOnsUpdateForm
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        product={product}
      />
    </TableRow>;
}