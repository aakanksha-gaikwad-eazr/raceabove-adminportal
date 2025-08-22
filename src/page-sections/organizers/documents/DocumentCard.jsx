import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { Stack, Divider, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
// CUSTOM COMPONENTS
import { H6, Paragraph } from "@/components/typography";
import { FlexBetween } from "@/components/flexbox";
import { Small } from "@/components/typography";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  width: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

export default function DocumentCard({ item, type }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <StyledCard>
      {/* Title */}
      {type === "faq" ? (
        <H6 fontSize={15} mb={1}>
          {item?.question || "Untitled"}
        </H6>
      ) : (
        <H6 fontSize={15} mb={1}>
          {item?.content || "Untitled"}
        </H6>
      )}

      {/* Description / Preview */}
      {type === "faq" ? (
        <Paragraph
          color="text.secondary"
          fontSize={13}
          sx={{
            maxHeight: 60,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            mb: 2,
          }}
        >
          {item?.answer || "No description provided."}
        </Paragraph>
      ) : (
        <></>
      )}
      <Divider sx={{ my: 1 }} />

      {/* Dates */}
      <Stack spacing={0.5} style={{display:"flex",  alignItems:"center", justifyContent:"space-between"}} >
        <FlexBetween>
          <Paragraph fontSize={12} color="text.secondary">
            Created:
          </Paragraph>
          <Box style={{display:"flex", flexDirection:"column", alignItems:"end"}}>
          <Paragraph fontSize={12} fontWeight={500}>
            {formatDate(item?.createdAt)} 
          </Paragraph>
          <Small>  {item?.createdBy}</Small>

          </Box>
        </FlexBetween>

        <FlexBetween>
       
          <Paragraph fontSize={12} color="text.secondary">
            Updated:
          </Paragraph>
              <Box style={{display:"flex", flexDirection:"column", alignItems:"end"}}>
          <Paragraph fontSize={12} fontWeight={500}>
            {formatDate(item?.updatedAt)} 
          </Paragraph>
          <Small>  {item?.updatedBy}</Small>

          </Box>
        </FlexBetween>
``      </Stack>

      {/* Footer */}
      {/* <FlexBetween mt={2} pt={1} sx={{ borderTop: 1, borderColor: "divider" }}>
        <Paragraph fontSize={11} color="text.secondary">
          ID: {item?.id?.slice(-8) || "N/A"}
        </Paragraph>
        <Button size="small" variant="text">
          Read More
        </Button>
      </FlexBetween> */}
    </StyledCard>
  );
}
