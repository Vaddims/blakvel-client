import { useParams } from "react-router-dom";
import Page from "../../layouts/Page";
import Panel from "../../layouts/Panel";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import InspectUserLandingProfile from "./landing";
import './inspect-user-profile.scss';
import { useGetUsersQuery } from "../../services/api/coreApi";
import useGravatarAvatar from "../../middleware/hooks/gravatar-avatar-hook";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const InspectUserProfile: React.FC = () => {
  const { id } = useParams();
  // const auth = useAuthentication();
  const { data: users = [] } = useGetUsersQuery();
  const cu = users.find(user => user.id === id);

  const selectionHeaderTools = (
    <>
      <button className="panel-tool edit highlight">
        <FontAwesomeIcon icon={faEdit} />
        Update
      </button>
      <button className="panel-tool delete">
        <FontAwesomeIcon icon={faTrash} />
        Delete User
      </button>
    </>
  );

  const subheader: ReactNode[] = [
    <span>Created at: <span className='highlight'>{new Date().toLocaleString()}</span></span>,
  ]

  return (
    <Page id='inspect-user-profile'>
      <Panel title="Inspect User" displayBackNavigation subheader={subheader} headerTools={selectionHeaderTools}>
        <InspectUserLandingProfile />
      </Panel>
    </Page>
  )
}

export default InspectUserProfile;