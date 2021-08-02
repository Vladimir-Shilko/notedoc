import React, {useState} from "react";
import theme from "theme";
import { Theme, Link, Text, Box, Button, Image, Section, Input } from "@quarkly/widgets";
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
	databaseURL: "https://notedoc-44442-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "notedoc-44442",
	storageBucket: "notedoc-44442.appspot.com",
	messagingSenderId: "1091043633676",
	appId: "1:1091043633676:web:1f57ec70e0f011031f1c29",
	measurementId: "G-604B1DBVFL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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
	async function login(email, password) {
		email = prompt('введите свою почту');
		password = prompt('введите пароль');
		try {
			const data = await firebase.auth().signInWithEmailAndPassword(email, password)
			console.log(data.user.uid)
			setNotes([]);
			setEmail(email);
			setId(data.user.uid)
			let login = email.substr(0,email.indexOf('@'))
			alert(login);
			var user;
			var username;
			let database = firebase.database().ref().child('users');
			database.child(login).on('value', function(snap)
			{
				user = snap.val();
				username = user.userDocs.inbox;
				console.log(username)
				setNotes([...notes,...username])
			})
			//setNotes([...notes, ...username])

		} catch (error) {
			console.log(error.message)
			throw error
		}
	}
	let ind = [];
	const [notes, setNotes] = useState([]);
	const [value, setValue] = useState(0);
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('');
	const [id, setId] = useState('')
	//let ind = -1;
	function createDoc()
	{
		setValue(value+1);
		setNotes([...notes, value])
	}
	function removeItem(note)
	{
		let index = notes.indexOf(note)
		//let index = 0
		//setNotes(prevState => prevState.filter(el => el.id !== id))
		//setNotes(prevState => prevState.filter(el => notes.indexOf(el) != index))
		//
		//console.log(index);
		//console.log(ind);

		//setValue(index)
		setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
		var arr = [...notes]
		arr.splice(index,1);
		setNotes(arr);
	//	ind--;
	}
	function remItem(index) {
		setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
	}
	const result = notes.map((note, index) => {
		 // return <p key={index} onClick={() => remItem(index)}>
		 // 	{note}
		 // </p>;
		return<Box key = {note.description} height="100px">
				<Input value={note.description} height="95px" position="relative" bottom="20px" type="text" />
				<Button  height="95px" position="relative" bottom="20px">
					скачать
				</Button>
				<Button
					position="relative"
					bottom="20px"
					height="95px"
					display="inline"
					width="350px"
				>
					<Input  type="file" width="230px" />
					загрузить
				</Button>
				<Button  width="260px" overflow-x="visible" display="inline-block">
					<Input value={note.dateOfTheCreate} type="date" display="block" />
					<Input value={new Date(note.dateOfTheEnd)} type="date" position="relative" right="36px" left="-4px" />
					отправить
				</Button>
				<Input value={note.recipient} height="95px" position="relative" bottom="20px" />
				<Button  onClick={() => remItem(index)}
					width="80px"
					height="95px"
					position="relative"
					bottom="20px"
					background="#cc0003"
				>
					удалить
				</Button>
			</Box>



		//index++;
	});
	return <Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"index"} />
		<Helmet>
			<title>
				Quarkly export
			</title>
			<meta name={"description"} content={"Web site created using quarkly.io"} />
			<link rel={"shortcut icon"} href={"https://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
		</Helmet>
		<body>
		<script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js"></script>
		<script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-analytics.js"></script>
		</body>
		<Box>
			<Input value={email} onChange={event => setEmail(event.target.value)} />
			<Input value={password} onChange={event => setPassword(event.target.value)} />
			<Button onClick={() => registration(email, password)}>register</Button>
		</Box>
		<Section>
			<Box
				display="flex"
				padding="12px 0"
				justify-content="space-between"
				align-items="center"
				flex-direction="row"
				md-flex-direction="column"
			>
				<Text margin="0" md-margin="0px 0 20px 0" text-align="left" font="--lead">
					NoteDoc
				</Text>
				<Box width="300px" height="100px" position="relative" left="300px">
					<Text>
						{email}
					</Text>
					<Text>
						ID: {id}
					</Text>
				</Box>
				<Button  onClick={() => login()} position="relative" left="150px">
					войти
				</Button>
				<Image width="100px" height="100px" position="relative" left="0px" />
			</Box>
		</Section>
		<Box>
			<Button>
				входящие
			</Button>
			<Button>
				исходящие
			</Button>
			<Button>
				ожидают подтверждения
			</Button>
			<Button>
				просроченные
			</Button>
			<Button>
				выполненные
			</Button>
		</Box>
		<Box />
		<Box height="100px">
			<Input height="95px" position="relative" bottom="20px" type="text" />
			<Button height="95px" position="relative" bottom="20px">
				скачать
			</Button>
			<Button
				position="relative"
				bottom="20px"
				height="95px"
				display="inline"
				width="350px"
			>
				<Input type="file" width="230px" />
				загрузить
			</Button>
			<Button width="260px" overflow-x="visible" display="inline-block">
				<Input type="date" display="block" />
				<Input type="date" position="relative" right="36px" left="-4px" />
				отправить
			</Button>
			<Input height="95px" position="relative" bottom="20px" />
			<Button
				width="80px"
				height="95px"
				position="relative"
				bottom="20px"
				background="#cc0003"
			>
				удалить
			</Button>
		</Box>
		<div>
				{result}
			<input value={value} onChange={event => setValue(event.target.value)} />
			<button onClick={() => {setValue(value+1);setNotes([...notes, value])}}>add</button>
		</div>;
		<Link
			font={"--capture"}
			font-size={"10px"}
			position={"fixed"}
			bottom={"12px"}
			right={"12px"}
			z-index={"4"}
			border-radius={"4px"}
			padding={"5px 12px 4px"}
			background-color={"--dark"}
			opacity={"0.6"}
			hover-opacity={"1"}
			color={"--light"}
			cursor={"pointer"}
			transition={"--opacityOut"}
			quarkly-title={"Badge"}
			text-decoration-line={"initial"}
			href={"https://quarkly.io/"}
			target={"_blank"}
		>
			Made on Quarkly
		</Link>
		<RawHtml>
			<style place={"endOfHead"} rawKey={"60fe92edfb3a6f00181af8d3"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>;

});