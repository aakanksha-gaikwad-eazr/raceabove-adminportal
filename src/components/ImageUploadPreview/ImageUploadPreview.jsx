import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function SimpleImageUpload({ onChange }) {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(file); // Pass file to parent (e.g. Formik)
    }
  };

  return (
    <Box
      p={2}
      sx={{
        border: "1px dashed grey",
        textAlign: "center",
        borderRadius: 2,
      }}
    >
      <label htmlFor="upload-btn">
        <input
          accept="image/*"
          id="upload-btn"
          type="file"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <IconButton component="span">
          <PhotoCamera sx={{ fontSize: 28, color: "grey.500" }} />
        </IconButton>
      </label>

      {preview ? (
        <Box
          mt={2}
          width={200}
          height={150}
          borderRadius={1}
          overflow="hidden"
          mx="auto"
        >
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      ) : (
        <Typography mt={2} color="text.secondary">
          No image uploaded
        </Typography>
      )}

      <Typography mt={2} variant="body2" color="text.secondary">
        Allowed *.jpeg, *.jpg, *.png, *.gif - max size 3.1 MB
      </Typography>
    </Box>
  );
}
