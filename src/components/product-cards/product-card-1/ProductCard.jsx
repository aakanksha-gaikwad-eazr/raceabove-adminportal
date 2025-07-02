import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent"; // CUSTOM COMPONENTS

import { H6, Paragraph } from "@/components/typography"; // CUSTOM ICON COMPONENTS

import Edit from "@/icons/Edit";
import Delete from "@/icons/Delete"; // STYLED COMPONENTS

import { ImageWrapper, StyledIconButton } from "./styles"; // ==============================================================

// ==============================================================
export default function ProductCard({ product, handleDelete, handleEdit }) {
  const { banner, name, id } = product || {};
  console.log("product", product)
  return (
    <Card
      sx={{
        position: "relative",
      }}
    >
      <ImageWrapper>
        <CardMedia
          style={{ objectFit: "cover" }}
          width="100%"
          height="100%"
          component="img"
          alt="Product Image"
          image={banner}
        />

        <div className="hover-actions">
          <StyledIconButton onClick={() => handleEdit(id)}>
            <Edit className="icon" />
          </StyledIconButton>

          <StyledIconButton onClick={() => handleDelete(id)}>
            <Delete className="icon" />
          </StyledIconButton>
        </div>
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
          }}
        >
          {/* {name} */}
          {name ? name.charAt(0).toUpperCase() + name.slice(1) : "Target Name"}

        </H6>
      </CardContent>
    </Card>
  );
}
