import React, { useEffect, useState } from 'react';
import { Avatar } from "@material-ui/core";
import './SidebarChat.css';
import db from '../../firebase';
import { Link } from 'react-router-dom';

function SidebarChat({ userid, roomid, name, addNewChat, profileImage , currentUser}) {
    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState("");

    useEffect(() => {
        if (roomid) {
            db.collection('rooms').doc(roomid).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            })
        }
        else if (userid) {
            db.collection('users').doc(userid).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            })
        }
    }, [roomid, userid]);


    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const createChat = () => {
        const roomName = prompt("Please Enter Name for Chat");

        if (roomName) {
            db.collection("rooms").add({
                name: roomName
            })
        }
    };

    if (!addNewChat) {
        if (userid) {
            return (
                <Link to={`/users/${currentUser}/${userid}`} key={userid}>
                    <div className="sidebarChat">
                        <Avatar src={profileImage} />
                        <div className="sidebarChat_info">
                            <h2>{name}</h2>
                            <p>{messages[0]?.message}</p>
                        </div>
                    </div>
                </Link>
            )
        }
        else if (roomid) {
            return (
                <Link to={`/rooms/${roomid}`} key={roomid}>
                    <div className="sidebarChat">
                        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                        <div className="sidebarChat_info">
                            <h2>{name}</h2>
                            {/* <p>{messages[0]?.message}</p> */}
                        </div>
                    </div>
                </Link>
            )
        }
    }
    else {
        return (
            <div onClick={createChat} className="sidebarChat">
                <h3 className="add-new-chat-title">Add New Chat</h3>
            </div>
        )
    }
}

export default SidebarChat
