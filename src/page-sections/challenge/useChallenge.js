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

  useEffect(() => {
    dispatch(getChallenges());
  }, [dispatch]);

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => setOpenModal(false);

  const handleChangeFilter = (key, value) => {
    setFilters((state) => ({ ...state, [key]: value }));
  };

  const statusFilter = (challenges = []) => {
    const approved = [];
    const pending = [];
    const rejected = [];

    challenges.forEach((challenge) => {
      const status = challenge.approvalStatus?.toLowerCase();
      
      if (status === "approved") {
        approved.push(challenge);
      } else if (status === "pending") {
        pending.push(challenge);
      } else if (status === "rejected") {
        rejected.push(challenge);
      }
    });

    const all = [...approved, ...pending, ...rejected];

    return { approved, pending, rejected, all };
  };
  
  return {
    statusFilter,
    challenges,
    filters,
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleChangeFilter,
  };
}
