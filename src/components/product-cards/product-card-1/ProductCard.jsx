import { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Box, Divider, Typography, IconButton, Collapse, Chip } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// CUSTOM COMPONENTS
import { H6, Paragraph } from "@/components/typography";

// CUSTOM ICON COMPONENTS
import Edit from "@/icons/Edit";
import Delete from "@/icons/Delete";

// STYLED COMPONENTS
import { ImageWrapper, StyledIconButton } from "./styles";

export default function ProductCard({ product, handleDelete, handleEdit }) {
  const { 
    banner, 
    name, 
    id, 
    createdBy, 
    createdByRole, 
    updatedBy, 
    updatedByRole, 
    deletedBy, 
    deletedByRole 
  } = product || {};

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Check if the item is deleted
  const isDeleted = deletedBy !== null && deletedBy !== undefined;

  // Check if we have any additional data to show
  const hasAdditionalData = createdBy || createdByRole || updatedBy || updatedByRole || deletedBy || deletedByRole;

  // console.log("product", product);

  return (
    <Card
      sx={{
        position: "relative",
        transition: "all 0.3s ease-in-out",
        opacity: isDeleted ? 0.6 : 1,
        filter: isDeleted ? "grayscale(50%)" : "none",
        pointerEvents: isDeleted ? "none" : "auto",
        "&:hover": {
          boxShadow: isDeleted ? "none" : 3,
        },
        "&::after": isDeleted ? {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: 1,
          pointerEvents: "none",
        } : {},
      }}
    >
      {/* Deleted status badge */}
      {isDeleted && (
        <Chip
          label="DELETED"
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            fontWeight: 600,
            fontSize: "0.7rem",
          }}
        />
      )}

      <ImageWrapper>
        <CardMedia
          style={{ 
            objectFit: "cover",
            filter: isDeleted ? "grayscale(70%) brightness(0.8)" : "none"
          }}
          width="100%"
          height="100%"
          component="img"
          alt="Product Image"
          image={banner}
        />

        {!isDeleted && (
          <div className="hover-actions">
            <StyledIconButton onClick={() => handleEdit(id)}>
              <Edit className="icon" />
            </StyledIconButton>

            <StyledIconButton onClick={() => handleDelete(id)}>
              <Delete className="icon" />
            </StyledIconButton>
          </div>
        )}
      </ImageWrapper>

      <CardContent
        sx={{
          textAlign: "center",
          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <H6
          fontSize={14}
          mb={0.5}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: isDeleted ? "text.disabled" : "text.primary",
            textDecoration: isDeleted ? "line-through" : "none",
          }}
        >
          {name ? name.charAt(0).toUpperCase() + name.slice(1) : "Target Name"}
        </H6>

        {/* Show expand/collapse button only if there's additional data */}
        {hasAdditionalData && (
          <>
            <Divider sx={{ my: 1 }} />
            
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isDeleted ? "default" : "pointer",
                py: 0.5,
                borderRadius: 1,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: isDeleted ? "transparent" : "action.hover",
                },
                pointerEvents: isDeleted ? "none" : "auto",
              }}
              onClick={isDeleted ? undefined : handleExpandClick}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isDeleted ? "text.disabled" : "text.secondary",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  mr: 0.5
                }}
              >
                {expanded ? "Hide Details" : "Show Details"}
              </Typography>
              <IconButton
                size="small"
                disabled={isDeleted}
                sx={{
                  padding: "2px",
                  transition: "transform 0.2s",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </IconButton>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box 
                sx={{ 
                  mt: 2,
                  p: 2,
                  backgroundColor: isDeleted ? "grey.100" : "grey.50",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: isDeleted ? "grey.300" : "grey.200",
                }}
              >
                <Typography 
                  variant="overline" 
                  sx={{ 
                    display: "block",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: isDeleted ? "text.disabled" : "text.secondary",
                    mb: 1.5,
                    letterSpacing: "0.5px"
                  }}
                >
                  Additional Information
                </Typography>
                
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {createdBy && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ 
                        fontWeight: 500, 
                        color: isDeleted ? "text.disabled" : "text.secondary" 
                      }}>
                        Created By:
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: isDeleted ? "text.disabled" : "text.primary" 
                      }}>
                        {createdBy}
                      </Typography>
                    </Box>
                  )}
                  
                  {createdByRole && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ 
                        fontWeight: 500, 
                        color: isDeleted ? "text.disabled" : "text.secondary" 
                      }}>
                        Role:
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: isDeleted ? "text.disabled" : "text.primary" 
                      }}>
                        {createdByRole}
                      </Typography>
                    </Box>
                  )}

                  {(updatedBy || updatedByRole) && <Divider sx={{ my: 0.5 }} />}
                  
                  {updatedBy && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ 
                        fontWeight: 500, 
                        color: isDeleted ? "text.disabled" : "text.secondary" 
                      }}>
                        Updated By:
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: isDeleted ? "text.disabled" : "text.primary" 
                      }}>
                        {updatedBy}
                      </Typography>
                    </Box>
                  )}
                  
                  {updatedByRole && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ 
                        fontWeight: 500, 
                        color: isDeleted ? "text.disabled" : "text.secondary" 
                      }}>
                        Role:
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: isDeleted ? "text.disabled" : "text.primary" 
                      }}>
                        {updatedByRole}
                      </Typography>
                    </Box>
                  )}

                  {(deletedBy || deletedByRole) && <Divider sx={{ my: 0.5 }} />}
                  
                  {deletedBy && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ 
                        fontWeight: 500, 
                        color: "error.main"
                      }}>
                        Deleted By:
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: "error.main",
                        fontWeight: 500
                      }}>
                        {deletedBy}
                      </Typography>
                    </Box>
                  )}
                  
                  {deletedByRole && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ 
                        fontWeight: 500, 
                        color: "error.main"
                      }}>
                        Role:
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: "error.main",
                        fontWeight: 500
                      }}>
                        {deletedByRole}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
}