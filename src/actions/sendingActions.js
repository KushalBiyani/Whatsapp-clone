import db, { storage } from '../firebase';
import firebase from 'firebase';

export const roomUpload = (file, currentUser, roomId, senderId) => {
    if (roomId) {
        const uploadTask = storage
            .ref(`/files/${currentUser.uid}/${file.name}`)
            .put(file)
        uploadTask.snapshot.ref.getDownloadURL().then(url => {
            db.collection('rooms').doc(roomId).collection('messages').add({
                type: "file",
                message: url,
                name: currentUser.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
        })
    }
    else {
        const uploadTask = storage
        .ref(`/files/${currentUser.uid}/${file.name}`)
        .put(file)
    uploadTask.snapshot.ref.getDownloadURL().then(url => {
        db.collection('messages').add({
            type: "file",
            message: url,
            name: currentUser.displayName,
            uid1: senderId,
            uid2: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    })
    }
}