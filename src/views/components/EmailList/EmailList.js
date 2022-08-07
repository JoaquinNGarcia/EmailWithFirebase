import { Checkbox, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./EmailList.css";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RedoIcon from "@material-ui/icons/Redo";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardHideIcon from "@material-ui/icons/KeyboardHide";
import SettingsIcon from "@material-ui/icons/Settings";
import InboxIcon from "@material-ui/icons/Inbox";
import PeopleIcon from "@material-ui/icons/People";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Section from "../Section/Section";
import EmailRow from "../EmailRow/EmailRow";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { auth, db } from "../../../config/firebaseApp";
import {
	// Link,
	useHistory
} from "react-router-dom";

const EmailList = () => {

  const [ user, setUser ] = useState(null);
  const [ profile, setProfile ] = useState([]);
  const [emails, setEmails] = useState([]);
  const history = useHistory();

  useEffect(() => {
        auth.currentUser
            ? setUser(auth.currentUser)
            : history.push('/login');
        const obtenerDatos = async () => {
            try {
                const dataProfile = await db.collection('user').get();
                const arrayDataProfile = dataProfile.docs.map(doc => ({ id: doc.id, ...doc.data() })) //...doc.data() <- Opererador de propagacion
                setProfile( arrayDataProfile );
            } catch (error) {
                console.log('EmailList (obtenerDatos) - error: ', error);
            }
        }
        obtenerDatos();
        const obtenerMails = async () => {
          try {
            await db.collection("emails").orderBy("timestamp", "desc").onSnapshot((snapshot) =>
            setEmails(
              snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
              }))
            ));
          } catch (error){
            console.log('EmailList (obtenerMails) - error: ', error);
          }
        }        
        obtenerMails();
    }, [history]);

  return (
    <>      
      <Header />
      <div className="emailList">
        <div className="emailList-settings">
          <Sidebar emails={emails} />
          <div className="emailList-settingsLeft">
            <div className="emailList-sections">
              <Section Icon={InboxIcon} title="Primary" color="red" selected />
              <Section Icon={PeopleIcon} title="Social" color="#1A73E8" />
              <Section Icon={LocalOfferIcon} title="Promotions" color="green" />
            </div>
            <Checkbox />
            <IconButton>
              <ArrowDropDownIcon />
            </IconButton>
            <IconButton>
              <RedoIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>

            <IconButton>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton>
              <ChevronRightIcon />
            </IconButton>
            <IconButton>
              <KeyboardHideIcon />
            </IconButton>
            <IconButton>
              <SettingsIcon />
            </IconButton>
            <div className="emailList-list">
              {emails.map(({ id, data: { to, subject, message, timestamp } }) => (
                <EmailRow
                  id={id}
                  key={id}
                  title={to}
                  subject={subject}
                  description={message}
                  time={new Date(timestamp?.seconds * 1000).toUTCString()}
                />
                ))}
              {/* <EmailRow
                title="MailTest"
                subject="testing"
                description="Hellow mail"
                time="10pm"
                /> */}
            </div>
          </div>
          {/* <div className="emailList-settingsRight">
          </div> */}
        </div>
      </div>
  </>
  );
}

export default EmailList;
