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

function Chat() {
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const { currentUser , logout} = useAuth()

    useEffect(() => {
        if (roomId) {
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                setRoomName(snapshot.data().name);
            });

            db.collection('rooms').doc(roomId).collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });

        }
    }, [roomId])
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: currentUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setInput("");
    }

    return (
        <div className="app_body">
        <Sidebar />
            <div className='chat'>
                <div className='chat_header'>
                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                    <div className='chat_headerInfo'>
                        <h3 className='chat-room-name'>{roomName}</h3>
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

export default Chat
