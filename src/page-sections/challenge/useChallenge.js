import { useEffect, useState } from "react"; // CUSTOM DATA

import { PROJECTS } from "@/__fakeData__/projects";
import { useDispatch, useSelector } from "react-redux";
import { getChallenges } from "../../store/apps/challenges";
export default function useChallenge() {
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "all",
    searchValue: "",
  });

  const dispatch = useDispatch();
  const { challenges } = useSelector((state) => state.challenges);
  // console.log("challenge", challenges);

  useEffect(() => {
    dispatch(getChallenges());
  }, [dispatch]);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => setOpenModal(false);

  const handleChangeFilter = (key, value) => {
    setFilters((state) => ({ ...state, [key]: value }));
  };

  // Utility function to filter events
  const datewisefilter = (challenges = []) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastChallenges = [];
    const upcomingChallenges = [];

    challenges.forEach((challenge) => {
      const challengeDate = new Date(challenge.startDate);
      challengeDate.setHours(0, 0, 0, 0);

      if (challengeDate < today) {
        pastChallenges.push(challenge);
      } else {
        upcomingChallenges.push(challenge);
      }
    });

    const all = [...pastChallenges, ...upcomingChallenges];

    return { pastChallenges, upcomingChallenges, all };
  };

  // const FILTERED_PROJECTS = challenges.filter(
  //   (item) => filters.status === "all" || item.status === filters.status
  // ).filter((pro) =>
  //   pro?.name.toLowerCase().includes(filters?.searchValue.toLowerCase())
  // );

  
  return {
    datewisefilter,
    challenges,
    // FILTERED_PROJECTS,
    filters,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleChangeFilter,
  };
}
