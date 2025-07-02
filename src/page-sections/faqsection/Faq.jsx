import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import Pagination from "@mui/material/Pagination";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import styled from "@mui/material/styles/styled"; // MUI ICON COMPONENT

import ExpandMore from "@mui/icons-material/ExpandMore"; // CUSTOM COMPONENTS

import MoreChannel from "./MoreChannel";
import Documentation from "./Documentation";
import { H6 } from "@/components/typography";
import MoreButton from "@/components/more-button";
import SearchInput from "@/components/search-input";
import { FlexBetween, FlexBox } from "@/components/flexbox"; // CUSTOM ICON COMPONENT

import Filter from "@/icons/Filter"; // CUSTOM UTILS METHOD

import { isDark } from "@/utils/constants"; // CUSTOM DUMMY DATA

import { FAQS } from "./data"; // STYLED COMPONENT
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getFaq, deleteFaq } from "@/store/apps/faq";
import { useNavigate } from "react-router-dom";
import DeleteModal from "@/components/delete-modal";



export default function Faq() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {faq} = useSelector(state=>state.faq)
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState(null);

  const handleEdit = (id) => {
    navigate(`/faq/edit-faq/${id}`);
  };
  const handleDelete = (id) => {
    setSelectedFaqId(id);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedFaqId(null);
  };
  const handleConfirmDelete = () => {
    if (selectedFaqId) {
      dispatch(deleteFaq(selectedFaqId)).then(() => {
        dispatch(getFaq());
        handleCloseDeleteModal();
      });
    }
  };

  useEffect(()=>{
    dispatch(getFaq())
  },[])

  const filteredFaq = faq.filter(item =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Grid container spacing={3}>
        {/* ALL TICKETS */}
        <Grid
          size={{
            xs: 12,
          }}
        >
          <Card className="p-3">
            <FlexBetween>
              <SearchInput placeholder="Search questions" value={search} onChange={e => setSearch(e.target.value)} />

              <FlexBox alignItems="center" gap={1}></FlexBox>
            </FlexBetween>

            <H6 fontSize={18} mt={4} mb={2}>
              All FAQs
            </H6>

            {filteredFaq.map((item, i) => (
              <Accordion key={item.id} defaultExpanded={i === 0}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {item.question}
                </AccordionSummary>

                <AccordionDetails>
               {item?.answer}
                </AccordionDetails>

                <AccordionDetails sx={{ display: "flex", justifyContent: "start"}}>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleEdit(item.id)}
                  style={{marginRight:"15px"}}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
                </AccordionDetails>
              </Accordion>
            ))}

            <Stack mt={3} direction="row" justifyContent="center">
              {/* <Pagination count={5} shape="rounded" /> */}
            </Stack>
          </Card>
        </Grid>

        {/* <Grid size={{
        xl: 3,
        md: 4,
        xs: 12
      }}>

          <MoreChannel />

          <Documentation />
        </Grid> */}
      </Grid>

      <DeleteModal
        open={deleteModalOpen}
        handleClose={handleCloseDeleteModal}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ?"
        actions={[
          {
            label: "Cancel",
            props: { onClick: handleCloseDeleteModal, variant: "outlined" },
          },
          {
            label: "Delete",
            props: { onClick: handleConfirmDelete, color: "error", variant: "contained" },
          },
        ]}
      />
    </div>
  );
}
