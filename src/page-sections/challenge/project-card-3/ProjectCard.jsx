import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup"; // CUSTOM COMPONENTS

import Link from "@/components/link";
import FlexBetween from "@/components/flexbox/FlexBetween";
import { H6, H5, Paragraph } from "@/components/typography"; // STYLED COMPONENTS

import { StyledRoot } from "./styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChallengesById } from "../../../store/apps/challenges";
import {  useEffect, useState } from "react";
import MoreButtontwo from "@/components/more-button-two";
import { MoreHoriz } from "@mui/icons-material";

export default function ChallengeCard3({ challenges }) {
  const navigate = useNavigate();
  const [allChallenges, setAllChallenges] = useState([]);

  // console.log("challenges23243", challenges)

  useEffect(() => {
    if (challenges?.id) {
      setAllChallenges(challenges);
    }
  }, []);

  const handleChallengeDetailsClick = (id) => {
    localStorage.setItem("challengeId", id);
    navigate("/challenges/details");
  };

  function getTimeLeftUntil(startDate) {
    const now = new Date();
    const targetDate = new Date(startDate);

    const diffMs = targetDate - now;

    if (diffMs <= 0) {
      return { weeks: 0, days: 0 };
    }

    const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;

    return { weeks, days };
  }

  function formatTimeLeft(startDate) {
    const { weeks, days } = getTimeLeftUntil(startDate);
    let result = [];

    if (weeks > 0) result.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
    if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);

    return result.length ? result.join(" and ") + " left" : "Expired";
  }

  // console.log("allChallenges",allChallenges)
  // console.log("banner",challenges?.[0]?.banner);


  return (
    <StyledRoot style={{ cursor: "pointer" }}>
      <div className="img-wrapper">
        
        <img src={allChallenges?.banner} alt="Challenges Thumbnail" />
      </div>

      <div className="content">
        <Link
          href="/challenges/details"
          onClick={() => handleChallengeDetailsClick(allChallenges?.id)}
        >
          <H6
            fontSize={18}
            mb={1}
            color="text.primary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              maxWidth: "100%", 
            }}
          >
            {/* {allChallenges?.title} */}
            {allChallenges?.title?.length > 30
              ? allChallenges?.title.slice(0, 30) + "..."
              : allChallenges?.title || "no title"}
          </H6>
        </Link>

        <Paragraph
          lineHeight={1.8}
          color="text.secondary"
          sx={{
            height: "50px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2, 
            textOverflow: "ellipsis",
            marginBottom:"10px"
          }}
          dangerouslySetInnerHTML={{ __html: allChallenges?.description }}
          />
            {/* {allChallenges?.description} */}

        {/* </Paragraph> */}
        <Paragraph lineHeight={1.8} color="text.secondary">
          {/* Start Date : {allChallenges?.startDate} */}
          Start Date : {new Date(allChallenges?.startDate).toLocaleDateString()}
        </Paragraph>
        <Paragraph lineHeight={1.8} color="text.secondary">
          {/* End Date : {allChallenges?.endDate} */}
          End Date :{new Date(allChallenges?.endDate).toLocaleDateString()}
        </Paragraph>

        <MoreButtontwo  Icon={MoreHoriz} projectId={allChallenges?.id} />

        <FlexBetween flexWrap="wrap" pt="1rem" gap={1}>
          <AvatarGroup max={4}>
            <Avatar alt="Remy Sharp" src={allChallenges?.badge} />
          </AvatarGroup>
          <Chip
            label={formatTimeLeft(allChallenges?.endDate)}
            color="secondary"
          />
        </FlexBetween>
      </div>
    </StyledRoot>
  );
}
