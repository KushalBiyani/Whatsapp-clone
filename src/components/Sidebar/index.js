import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar } from "@material-ui/core";
//import {SearchOutlined , DonutLarge , Chat , MoreVert} from "@material-ui/icons";
import SidebarChat from "../SidebarChat";  
import db from "../../firebase";
import { useAuth } from "../../authContext";

function Sidebar(props) {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    const unsubscribe1 = db.collection("users").onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={currentUser?.photoURL} />
        <div className="sidebar_headerRight">
          {currentUser.displayName}
          {/* <IconButton>
                        <DonutLarge/>
                    </IconButton>
                    <IconButton>
                        <Chat/>
                    </IconButton>
                    <IconButton>
                        <MoreVert/>
                    </IconButton> */}
        </div>
      </div>
      <hr />
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        <hr />
        {users.map(
          (user) =>
            currentUser.uid !== user.id && (
              <SidebarChat
                key={user.id}
                userid={user.id}
                name={user.data.name}
                profileImage={user.data.profileUrl}
                currentUser={currentUser.uid}
              />
            )
        )}
        {rooms.map((room) => (
          <SidebarChat key={room.id} roomid={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
