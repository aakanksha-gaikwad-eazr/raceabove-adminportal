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

export default function UserDetailsPageView() {
  const dispatch = useDispatch();
  const {id}= useParams()
  const {allDataOfSingleUser} = useSelector((state) => state.user);

  console.log(allDataOfSingleUser,"allDataOfSingleUser")

  useEffect(()=>{
    console.log("id of user", id)
    dispatch(getAllDataOfUser(id))
  },[id])

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

          <TabPanel value="5">
            <Connections allDataOfSingleUser={allDataOfSingleUser} />
          </TabPanel>

          <TabPanel value="6">
            <Activity allDataOfSingleUser={allDataOfSingleUser} />
          </TabPanel>
        </Layout>
      </TabContext>
    </div>;
    }