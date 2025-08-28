import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Tabs, Tab, Typography, Stack } from "@mui/material";

import ArticleIcon from "@mui/icons-material/Article";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";

import DocumentCard from "./DocumentCard";
import { H6 } from "@/components/typography";
import { FlexBetween } from "@/components/flexbox";

export default function Documents({ singleOrganizer }) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState(0);

  const allTNCData = singleOrganizer?.termsAndConditions || [];
  const allFAQData = singleOrganizer?.frequentlyAskedQuestions || [];
  const allPrivacyPoliciesData = singleOrganizer?.privacyPolicies || [];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box py={3}>
      {/* Header */}
      <FlexBetween flexWrap="wrap" mb={2}>
        <H6 fontSize={16}>Documents</H6>
      </FlexBetween>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
        variant={downMD ? "scrollable" : "standard"}
      >
        <Tab
          label={`Terms & Conditions (${allTNCData.length})`}
          icon={<ArticleIcon />}
          iconPosition="start"
        />
        <Tab
          label={`Privacy Policy (${allPrivacyPoliciesData.length})`}
          icon={<PrivacyTipIcon />}
          iconPosition="start"
        />
        <Tab
          label={`FAQ (${allFAQData.length})`}
          icon={<LiveHelpIcon />}
          iconPosition="start"
        />
      </Tabs>

      {/* Terms Tab */}
      {activeTab === 0 && (
        <Stack spacing={2}>
          {allTNCData.length === 0 ? (
            <Typography align="center" color="text.secondary" py={4}>
              No Terms & Conditions available
            </Typography>
          ) : (
            allTNCData.map((doc) => (
              <DocumentCard key={doc.id} item={doc} type="terms" />
            ))
          )}
        </Stack>
      )}

      {/* Privacy Tab */}
      {activeTab === 1 && (
        <Stack spacing={2}>
          {allPrivacyPoliciesData.length === 0 ? (
            <Typography align="center" color="text.secondary" py={4}>
              No Privacy Policy available
            </Typography>
          ) : (
            allPrivacyPoliciesData.map((doc) => (
              <DocumentCard key={doc.id} item={doc} type="privacy" />
            ))
          )}
        </Stack>
      )}

      {/* FAQ Tab */}
      {activeTab === 2 && (
        <Stack spacing={2}>
          {allFAQData.length === 0 ? (
            <Typography align="center" color="text.secondary" py={4}>
              No FAQs available
            </Typography>
          ) : (
            allFAQData.map((doc) => (
              <DocumentCard key={doc.id} item={doc} type="faq" />
            ))
          )}
        </Stack>
      )}
    </Box>
  );
}
