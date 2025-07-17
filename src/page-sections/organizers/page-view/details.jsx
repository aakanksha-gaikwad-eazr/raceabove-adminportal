import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { getEventsById } from "../../../store/apps/events";
import { toast } from "react-hot-toast";
import { PROJECT_FILES } from "@/__fakeData__/projects";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext'; 
import Overview from '../overview';
import Projects from '../projects';
import Activity from '../activity';
import Campaigns from '../campaigns';
import Documents from '../documents'; 
import Connections from '../connections';
import { getAllDataOfUser } from "../../../store/apps/user";
import Layout from "../Layout";
import { getSingleOrganizers } from "@/store/apps/organisers";

export default function OrganizerDetailsPageView() {
  const dispatch = useDispatch();
  const {singleOrganizer} = useSelector((state) => state.organisers);
  console.log("singleOrganizer",singleOrganizer)
  const {id}= useParams()

  useEffect(()=>{
    dispatch(getSingleOrganizers(id))
  },[id])

  const navigate = useNavigate();
  

const [tabValue, setTabValue] = useState('1');

  const handleTabChange = (_, value) => setTabValue(value);

  return <div className="pt-2 pb-4">
      <TabContext value={tabValue}>
        <Layout handleTabList={handleTabChange} singleOrganizer={singleOrganizer}>
          <TabPanel value="1">  
            <Overview singleOrganizer={singleOrganizer} />
          </TabPanel>
          {/* challengeParticipations */}
          <TabPanel value="2">
            <Projects singleOrganizer={singleOrganizer} />
          </TabPanel>
          {/* events */}
          <TabPanel value="3">
            <Campaigns singleOrganizer={singleOrganizer} />
          </TabPanel>
          {/* tickets types and template */}
          <TabPanel value="4">
            <Documents singleOrganizer={singleOrganizer}  />
          </TabPanel>
        {/* terms, pp, faq */}
          <TabPanel value="5">
            <Connections singleOrganizer={singleOrganizer} />
          </TabPanel>

          <TabPanel value="6">
            <Activity singleOrganizer={singleOrganizer} />
          </TabPanel>
        </Layout>
      </TabContext>
    </div>;
    }