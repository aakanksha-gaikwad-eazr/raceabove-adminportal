import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import DropZone from '@/components/dropzone';

export default function EditModal({ 
  open, 
  handleClose, 
  handleConfirm, 
  editId,
  initialData,
  fields = [],
  title,
}) {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.companyLogo) {
        setPreview(initialData.companyLogo);
      }
    }
  }, [initialData]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      setFormData({
        ...formData,
        companyLogo: file
      });
    }
  };

  // const handleSubmit = () => {
  //   handleConfirm(formData);
  // };
  const handleSubmit = () => {
  const newErrors = {};

  // Validate email
  if (formData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
    newErrors.email = "Invalid email address";
  }

// Validate phone number with optional +91 and 10 digits
if (
  formData.phoneNumber &&
  !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(formData.phoneNumber.trim())
) {
  newErrors.phoneNumber = "Enter a valid 10-digit Indian phone number (with or without +91)";
}


  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // Don't proceed if there are validation errors
  }

  setErrors({});
  handleConfirm(formData);
};


  const renderField = (field) => {
    if (field.props?.type === 'image') {
      return (
        <Stack direction="row" spacing={2} alignItems="center">
          {preview && (
            <Avatar
              src={preview}
              sx={{ width: 64, height: 64 }}
            />
          )}
          <DropZone onDrop={handleDrop} />
        </Stack>
      );
    }

    return (
      <TextField
        key={field.name}
        label={field.label}
        value={formData[field.name] || ''}
        onChange={handleChange(field.name)}
        fullWidth
        variant="outlined"
        {...field.props}
        error={!!errors[field.name]}
          helperText={errors[field.name] || ''}

      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* {fields.map((field) => renderField(field))} */}
          {fields.map((field) => (
  <div key={field.id || field.name}>
    {renderField(field)}
  </div>
))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
} 