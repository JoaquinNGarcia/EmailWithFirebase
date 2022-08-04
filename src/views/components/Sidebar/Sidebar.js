import { Button, IconButton } from "@material-ui/core";
import React from "react";
import "./Sidebar.css";
import AddIcon from "@material-ui/icons/Add";
import InboxIcon from "@material-ui/icons/Inbox";
import StarIcon from "@material-ui/icons/Star";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import NearMeIcon from "@material-ui/icons/NearMe";
import NoteIcon from "@material-ui/icons/Note";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PersonIcon from "@material-ui/icons/Person";
import DuoIcon from "@material-ui/icons/Duo";
import PhoneIcon from "@material-ui/icons/Phone";
import SidebarOption from "./SidebarOption";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openSendMessage } from "../../features/mailSlice";

function Sidebar({ emails }) {
  const dispatch = useDispatch();

  return (
    <div className="sidebar">
      <Button
        className="sidebar-compose"
        onClick={() => dispatch(openSendMessage())}
        startIcon={<AddIcon fontSize="large" />}
      >
        Redactar
      </Button>
      <Link to="/" className="sidebar-link">
        <SidebarOption
          Icon={InboxIcon}
          title="Recibidos"
          number={emails.length}
          selected={true}
        />
      </Link>

      <SidebarOption Icon={StarIcon} title="Desctacado" number={12} />
      <SidebarOption Icon={AccessTimeIcon} title="Pospuestos" number={9} />
      <SidebarOption Icon={LabelImportantIcon} title="Importantes" number={12} />
      <SidebarOption Icon={NearMeIcon} title="Enviados" number={81} />
      <SidebarOption Icon={NoteIcon} title="Borradores" number={5} />
      <SidebarOption Icon={ExpandMoreIcon} title="Mas" />

      <div className="sidebar-footer">
        <div className="sidebar-footerIcons">
          <IconButton>
            <PersonIcon />
          </IconButton>
          <IconButton>
            <DuoIcon />
          </IconButton>
          <IconButton>
            <PhoneIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
