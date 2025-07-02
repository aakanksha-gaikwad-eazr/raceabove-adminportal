import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { getEventsById } from "../../../store/apps/events";
import { toast } from "react-hot-toast";
import { PROJECT_FILES } from "@/__fakeData__/projects";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext'; // CUSTOM PAGE SECTION COMPONENTS
import Layout from '../Layout';
import Overview from '../overview';
import Projects from '../projects';
import Activity from '../activity';
import Campaigns from '../campaigns';
import Documents from '../documents';
import Connections from '../connections';
import { getAllDataOfUser } from "../../../store/apps/user";

export default function UserDetails() {
  const dispatch = useDispatch();
  const {allDataOfSingleUser} = useSelector((state) => state.user);

  const storedUserId = localStorage.getItem("selectedUserId");

  useEffect(()=>{
    console.log("storedUserId", storedUserId)
    dispatch(getAllDataOfUser(storedUserId))//dev
    // dispatch(getAllDataOfUser("760f9320-b988-427a-b7d6-7c4a150e4d19"))
  },[storedUserId])

  const navigate = useNavigate();
  

const [tabValue, setTabValue] = useState('1');

  const handleTabChange = (_, value) => setTabValue(value);

  return <div className="pt-2 pb-4">
      <TabContext value={tabValue}>
        <Layout handleTabList={handleTabChange} allDataOfSingleUser={allDataOfSingleUser}>
          <TabPanel value="1">  
            <Overview allDataOfSingleUser={allDataOfSingleUser} />
          </TabPanel>
          {/* challengeParticipations */}
          <TabPanel value="2">
            <Projects allDataOfSingleUser={allDataOfSingleUser} />
          </TabPanel>
          {/* events */}
          <TabPanel value="3">
            <Campaigns allDataOfSingleUser={allDataOfSingleUser} />
          </TabPanel>

          {/* <TabPanel value="4">
            <Documents />
          </TabPanel> */}

          {/* <TabPanel value="5">
            <Connections />
          </TabPanel> */}

          <TabPanel value="6">
            <Activity allDataOfSingleUser={allDataOfSingleUser} />
          </TabPanel>
        </Layout>
      </TabContext>
    </div>;
    }