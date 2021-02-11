import React, { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined, InsertEmoticon } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import './Chat.css';
import Sidebar from './Sidebar';
import { useParams } from 'react-router-dom';
import db from '../firebase';
import firebase from 'firebase';
import { useAuth } from "../authContext"

function UserChat() {
    const [input, setInput] = useState("");
    const { userId, senderId } = useParams();
    const [users, setUsers] = useState("");
    const [messages, setMessages] = useState([]);
    const { currentUser, logout } = useAuth()
    useEffect(() => {
        if (userId) {
            db.collection('users').doc(userId).onSnapshot(snapshot => {
                setUsers(snapshot.data());
            });
            db.collection('messages')
                .where('uid1', 'in', [userId, senderId])
                .orderBy("timestamp", "asc").onSnapshot(snapshot => {
                    const conversations = [];
                    snapshot.forEach(doc => {
                        if (
                            (doc.data().uid1 === userId && doc.data().uid2 === senderId)
                            ||
                            (doc.data().uid1 === senderId && doc.data().uid2 === userId)
                        ) {
                            conversations.push(doc.data())
                        }
                    });
                    setMessages(conversations)
                });
        }
    }, [userId , senderId])

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('messages').add({
            message: input,
            name: currentUser.displayName,
            uid1: senderId,
            uid2: userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("");
    }

    return (
        <div className="app_body">
            <Sidebar />
            <div className='chat'>
                <div className='chat_header'>
                    <Avatar src={users.profileUrl} />
                    <div className='chat_headerInfo'>
                        <h3 className='chat-room-name'>{users.name}</h3>
                        <p className='chat-room-last-seen'>
                            Last seen {" "}
                            {new Date(
                                messages[messages.length - 1]?.timestamp?.toDate()
                            ).toUTCString()}
                        </p>
                    </div>
                    <div className="chat_headerRight">
                        <IconButton>
                            <SearchOutlined />
                        </IconButton>
                        <IconButton>
                            <AttachFile />
                        </IconButton>
                        {/* <IconButton>
                            <MoreVert />
                        </IconButton> */}
                        <button onClick={logout}>Logout</button>

                    </div>
                </div>
                <div className='chat_body'>
                    {messages.map(message => (
                        <p className={`chat_message ${message.name === currentUser.displayName && 'chat_receiver'}`} key={message.timestamp}>
                            <span className="chat_name">{message.name}</span>
                            {message.message}
                            <span className="chat_timestemp">{new Date(message.timestamp?.toDate()).toUTCString()}</span>
                        </p>
                    ))}
                </div>
                <div className='chat_footer'>
                    <InsertEmoticon />
                    <form>
                        <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" />
                        <button type="submit" onClick={sendMessage}> Send a Message</button>
                    </form>
                    <MicIcon />
                </div>
            </div>
        </div>
    )
}

export default UserChat
