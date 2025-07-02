import { useDropzone } from "react-dropzone"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "@/components/typography"; // CUSTOM ICON COMPONENT

import UploadOnCloud from "@/icons/UploadOnCloud"; // STYLED COMPONENT

import { RootStyle } from "./styles"; // =======================================================================
import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// =======================================================================
export default function DropZone({ onDrop, preview: externalPreview }) {
  const [preview, setPreview] = useState(null);
  const currentPreview = preview || externalPreview;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file)); // Show preview
        onDrop(acceptedFiles); // Pass file to parent
      }
    },
  });
  return (
    <RootStyle
      {...getRootProps({
        className: "dropzone",
      })}
    >
      {/* {preview ? (
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            textAlign: "center",
          }}
        >
          <img
            src={preview}
            alt="Uploaded"
            style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
          />
          <IconButton
            onClick={() => setPreview(null)}
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <>
          <UploadOnCloud
            sx={{
              fontSize: 38,
              color: "text.secondary",
            }}
          />
          <Paragraph color="text.secondary">Drop your images here or</Paragraph>
          <H6 fontSize={16} color="primary.main">
            Select click to browse
          </H6>

          <input {...getInputProps()} placeholder="Select click to browse" />
        </>
      )} */}

      {currentPreview ? (
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            textAlign: "center",
          }}
        >
          <img
            src={currentPreview}
            alt="Uploaded"
            style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
          />
          <IconButton
            onClick={() => setPreview(null)}
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <>
          <UploadOnCloud sx={{ fontSize: 38, color: "text.secondary" }} />
          <Paragraph color="text.secondary">Drop your images here or</Paragraph>
          <H6 fontSize={16} color="primary.main">
            Select click to browse
          </H6>
          <input {...getInputProps()} placeholder="Select click to browse" />
        </>
      )}
    </RootStyle>
  );
}
