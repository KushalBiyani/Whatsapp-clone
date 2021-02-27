import React, { useRef, useState, useEffect } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, ExitToApp, InsertEmoticon, Send} from '@material-ui/icons';
import './Chat.css';
import Sidebar from './Sidebar';
import { useParams } from 'react-router-dom';
import db from '../firebase';
import firebase from 'firebase';
import { useAuth } from "../authContext"
import { roomUpload } from "../actions/sendingActions"
import { Picker } from 'emoji-mart'

function UserChat() {
    const fileUpload = useRef(null)
    const [input, setInput] = useState("");
    const { userId, senderId } = useParams();
    const [users, setUsers] = useState("");
    const [messages, setMessages] = useState([]);
    const { currentUser, logout } = useAuth()
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
    const handleUpload = (e) => {
        e.preventDefault();
        const file = e.target.files[0]
        roomUpload(file , currentUser , senderId)
    }
    const addEmoji = e => {
        let emoji = e.native;
        setInput(input + emoji)
    };
    const emojiPicker = e => {
        setShowEmojiPicker(prevCheck => !prevCheck);
    }

    return (
        <div className="app_body">
            <Sidebar />
            <div className='chat'>
                <div className='chat_header'>
                    <Avatar src={users.profileUrl} />
                    <div className='chat_headerInfo'>
                        <h3 className='chat-room-name'>{users.name}</h3>
                    </div>
                    <div className="chat_headerRight">
                        <input type="file" ref={fileUpload}
                            style={{ visibility: 'hidden' }} onChange={handleUpload} />
                        <IconButton >
                            <AttachFile onClick={() => fileUpload.current.click()} />
                        </IconButton>

                        <IconButton onClick={logout}>
                            <ExitToApp />
                        </IconButton>
                    </div>
                </div>
                <div className='chat_body'>
                    {messages.map(message => (
                        <p className={`chat_message ${message.name === currentUser.displayName && 'chat_receiver'}`} key={message.timestamp}>
                            <span className="chat_name">{message.name}</span>
                            {message.type === "message" ? message.message : <img src={message.message} alt='failed to load'></img>}
                            {message.type === "message" && <span className="chat_timestemp">
                            {message.timestamp && new Date(message.timestamp.seconds * 1000).toString().substring(16, 21)}&nbsp;&nbsp;
                             {message.timestamp && new Date(message.timestamp.seconds * 1000).toString().substring(4, 10)}</span>}
                        </p>
                    ))}
                </div>
                <div className='chat_footer'>
                <IconButton onClick={emojiPicker} ><InsertEmoticon/></IconButton>{showEmojiPicker ? (
                        <Picker onSelect={addEmoji} emoji='wink' skin="2" set="google" color="#25D366" title="Select the Emoji" 
                        style={{ position: 'absolute', bottom: '85px', width: "60%" }}/>
                    ) : null}
                    <form>
                        <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" />
                        <IconButton type="submit" onClick={sendMessage}><Send  className="send"/></IconButton>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserChat
