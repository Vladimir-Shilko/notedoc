import React, {useState} from "react";
import theme from "theme";
import {Theme, Link, Input, Button, Box} from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml } from "@quarkly/components";
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/messaging'
import async from "async";

const firebaseConfig = {
    apiKey: "AIzaSyD8qxHIjM1Q-z-Z4FwjyZZ1ntCRbQ2WKoI",
    authDomain: "notedoc-44442.firebaseapp.com",
    projectId: "notedoc-44442",
    storageBucket: "notedoc-44442.appspot.com",
    messagingSenderId: "1091043633676",
    appId: "1:1091043633676:web:1f57ec70e0f011031f1c29",
    measurementId: "G-604B1DBVFL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();
export default (() => {
    async function registration(email, password) {
        try {
            const data = await firebase.auth().createUserWithEmailAndPassword(email, password)
            console.log(data.user.uid)
        } catch (error) {
            console.log(error.message)
            throw error
        }
    }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    return <Theme theme={theme}>
        <Box>
            <Input value={email} onChange={event => setEmail(event.target.value)} />
            <Input value={password} onChange={event => setPassword(event.target.value)} />
            <Button onClick={() => registration(email, password)}>register</Button>
        </Box>

    </Theme>;
});