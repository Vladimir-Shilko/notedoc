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
	let userLogin;
	async function login(email, password) {
		email = prompt('введите свою почту');
		password = prompt('введите пароль');
		try {
			const data = await firebase.auth().signInWithEmailAndPassword(email, password)
			console.log(data.user.uid)
			setAddDisabled(false)
			setNotes([]);
			setEmail(email);
			setId(data.user.uid)
			userLogin = email.substr(0, email.indexOf('@'));
			setLog(userLogin);
			alert(userLogin);
			let user;
			let userdocs;
			//	createDoc();
			//	let startBase = firebase.database().ref('users/'+userLogin+'/userDocs/inbox/').set([{dateOfTheCreate: '2021-11-11', dateOfTheEnd: '2021-11-11', description: '', recipient: '', idDocument: Math.floor(Math.random()*1000000)}])
			let database = firebase.database().ref().child('users');
			database.child(userLogin).on('value', function(snap)
			{
				user = snap.val();
				userdocs = user.userDocs.inbox;
				console.log(userdocs)
				if(userdocs == null)
				{

				}
				else
				{
					for(let i = 0; i < userdocs.length;i++)
					{
						console.log(userdocs[i]);
						if(userdocs[i] == null)
						{
							userdocs.splice(i, 1);
						}
						else
						{


						}
					}
					//setNotes([...notes,...userdocs])
					setNotes([...userdocs])
					//login = 'test';
					let database = firebase.database().ref('users/'+userLogin+'/userDocs/inbox/').set([...userdocs])
				}
			})
			//setNotes([...notes, ...username])

		} catch (error) {
			console.log(error.message)
			//throw error
		}
	}
	let ind = [];
	const [notes, setNotes] = useState([]);
	const [value, setValue] = useState();
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('');
	const [id, setId] = useState('')
	const[log, setLog] = useState('')
	const [lengthOfDocs, setlen] = useState();
	const [buttonAddDisabled, setAddDisabled] = useState(true);
	const [file, setFile] = useState([]);
	var myFiles = [];
	var metadata = {
		contentType: 'image/jpeg'
	};

	function createDoc()
	{
		setValue(value+1);
		setFile([...file, null])
		setNotes([...notes, {dateOfTheCreate: '2021-11-11', dateOfTheEnd: '2021-11-11', description: '', recipient: '', idDocument: Math.floor(Math.random()*1000000),sender: log, filePath: ''}]);
	}
	function sendDoc(index)
	{
		try
		{
			let storage = firebase.storage().ref()
			//let indexFile = (file[index].length-1)
			let indexFile = (myFiles[index].length-1)
			let uploadFile = storage.child('images/'+notes[index].idDocument).put(myFiles[index][0])
			//storage.put(file[0])
			let recipients = notes[index].recipient.split(',')
			//recipients.push(log)
			alert(log)
			let database = firebase.database().ref('users/'+log+'/userDocs/inbox/'+index).set(
				{
					dateOfTheEnd:notes[index].dateOfTheEnd,
					dateOfTheCreate:notes[index].dateOfTheCreate,
					description:notes[index].description,
					recipient:notes[index].recipient,
					idDocument:notes[index].idDocument,
					sender:notes[index].sender
				}
			)
			recipients.forEach(function(item, i, arr)
			{
				//console.log(item);
				if(item != null)
				{
					const dbRef = firebase.database().ref();
					dbRef.child("users").child(item).child('userDocs').child('inbox').get().then((snapshot) => {
						if (snapshot.exists()) {
							//let userl = snapshot.val();
							let userdocsin = snapshot.val();
							if(userdocsin == null || userdocsin.length == null)
							{
								let database = firebase.database().ref('users/'+item+'/userDocs/inbox/0').set(
									{
										dateOfTheEnd:notes[index].dateOfTheEnd,
										dateOfTheCreate:notes[index].dateOfTheCreate,
										description:notes[index].description,
										recipient:notes[index].recipient,
										idDocument:notes[index].idDocument,
										sender:notes[index].sender
									}
								)
							}
							else
							{
								console.log(userdocsin)
								setlen(userdocsin.length)
								console.log(lengthOfDocs);
								//let e = prompt('dd')
								for(let i = 0; i <= userdocsin.length;i++)
								{
									console.log(userdocsin[i]);
									if(userdocsin[i] == null)
									{
										alert(i)
										let database = firebase.database().ref('users/'+item+'/userDocs/inbox/'+i).set(
											{
												dateOfTheEnd:notes[index].dateOfTheEnd,
												dateOfTheCreate:notes[index].dateOfTheCreate,
												description:notes[index].description,
												recipient:notes[index].recipient,
												idDocument:notes[index].idDocument,
												sender:notes[index].sender
											}
										)
									}
									console.log(lengthOfDocs)
								}
								//setNotes([...notes,...userdocsin])
							}

						} else {
							let database = firebase.database().ref('users/'+item+'/userDocs/inbox/0').set(
								{
									dateOfTheEnd:notes[index].dateOfTheEnd,
									dateOfTheCreate:notes[index].dateOfTheCreate,
									description:notes[index].description,
									recipient:notes[index].recipient,
									idDocument:notes[index].idDocument,
									sender:notes[index].sender
								}
							)
						}
					})
				}
			})

		}
		catch (error)
		{
			console.log(error.message)
			//throw error
		}

	}
	function remItem(index) {
		try
		{
			let recipients = notes[index].recipient.split(',');
			let removeId = notes[index].idDocument;
			recipients.push(log);
			recipients.forEach(function(item, i, arr)
			{
				if(item != null)
				{
					let database = firebase.database().ref().child('users').child(item).child('userDocs');
					database.on('value', function (docsRef)
					{
						let docs = docsRef.val();
						if(docs != null)
						{
							let inbox = docs.inbox;
							if(inbox != null)
							{
								if(inbox.length != null)
								{
									for(let i = 0; i < inbox.length; i++)
									{

										if( inbox[i] != null && removeId === inbox[i].idDocument)
										{
											//let removingElem = firebase.database().ref().child('users').child(item).child('userDocs').child('inbox').
											//inbox.i = null;
											//inbox[i].removeValue();
											firebase.database().ref().child('users').child(item).child('userDocs').child('inbox').child(i).remove();
										}
									}
								}

							}
						}

						// if(inbox.length != null)
						// {
						// 	for(let i = 0; i < inbox.length; i++)
						// 	{
						// 		if(removeId === inbox[i].idDocument)
						// 		{
						// 			//let removingElem = firebase.database().ref().child('users').child(item).child('userDocs').child('inbox').
						// 			//inbox.i = null;
						// 			//inbox[i].removeValue();
						// 			firebase.database().ref().child('users').child(item).child('userDocs').child('inbox').child(i).remove();
						// 		}
						// 	}
						// }

					})
				}
			})
		}
		catch(error)
		{
			console.log(error)
		}

		// let database = firebase.database().ref().child('users').child('');
		setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
	}
	function downloadFile(index)
	{
			if(notes[index].idDocument != null)
			{
				let fileName = notes[index].idDocument;
				let storageRef = firebase.storage().ref();
				storageRef.child('images/'+fileName).getDownloadURL().then((url) => {
					window.open(url);
					// let xhr = new XMLHttpRequest();
					// xhr.responseType = 'blob';
					// xhr.onload = (event) => {let blob = xhr.response};
					// xhr.open('GET',url);
					// xhr.send();
				}).catch((error) => {alert('файл не существует')});
			}
	}
	function loadOutBox()
	{
		setAddDisabled(false)
		setNotes([]);
		let user; let userdocsOut;
		let database = firebase.database().ref().child('users');
		database.child(log).on('value', function(snap)
		{
			user = snap.val();
			userdocsOut = user.userDocs.outbox;
			console.log(userdocsOut)
			if(userdocsOut == null)
			{

			}
			else
			{
				for(let i = 0; i < userdocsOut.length;i++)
				{
					console.log(userdocsOut[i]);
					if(userdocsOut[i] == null)
					{
						userdocsOut.splice(i, 1);
					}
					else
					{


					}
				}
				//setNotes([...notes,...userdocs])
				setNotes([...userdocsOut])
				//login = 'test';
				let database = firebase.database().ref('users/'+userLogin+'/userDocs/outbox/').set([...userdocsOut])
			}
		})
		//setNotes([...notes, ...username])

	}
	try
	{
		var result = notes.map((note, index) => {
			// return <p key={index} onClick={() => remItem(index)}>
			// 	{note}
			// </p>;
			return<Box key = {note.description} height="100px">
				<Input value={note.description} onChange={event => {note.description = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}} height="95px" position="relative" bottom="20px" type="text" />
				<Button  onClick={() => downloadFile(index)} height="95px" position="relative" bottom="20px">
					скачать
				</Button>
				<Button
					position="relative"
					bottom="20px"
					height="95px"
					display="inline"
					width="350px"
				>
					<Input  type="file" onChange={event =>{myFiles[index] = event.target.files; console.log(event.target.files)}} width="230px" />
					загрузить
				</Button>
				<Button>
					<Input type="date" value={note.dateOfTheCreate} onChange={event => {event.preventDefault(); note.dateOfTheCreate = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}}/>
					<Input type="date" value={note.dateOfTheEnd} onChange={event => {event.preventDefault();note.dateOfTheEnd = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}} display="block" />
				</Button>
				<Button onClick={() => {sendDoc(index)}}
					width="110px"
					overflow-x="visible"
					display="inline-block"
					height="95px"
					position="relative"
					bottom="20px"
				>
					отправить
				</Button>
				{/*<Button onClick={() => {sendDoc(index)}} width="260px" overflow-x="visible" display="inline-block">*!/*/}
				{/*/!*	<Input type="date" value={note.dateOfTheCreate} onChange={event => {event.preventDefault(); note.dateOfTheCreate = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}} display="block" />*!/*/}
				{/*/!*	<Input type="date" value={note.dateOfTheEnd} onChange={event => {event.preventDefault();note.dateOfTheEnd = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}}  position="relative" right="36px" left="-4px" />*!/*/}
				{/*отправить*/}
				{/*</Button>*/}
				<Input value={note.recipient} onChange={event => {note.recipient = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}}height="95px" position="relative" bottom="20px" width="180px" />
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
	}
	catch(error)
	{

	}

	return (<Theme theme={theme}>
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
			<Button onClick={() => loadOutBox()}>
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
			<Input
				type="date"
				position="absolute"
				bottom="160px"
				height="45px"
				top="250px"
				max-width="140px"
			/>
			<Input
				position="relative"
				type="date"
				height="45px"
				top="5px"
				bottom={0}
				max-width="140px"
			/>
			<Button
				width="110px"
				overflow-x="visible"
				display="inline-block"
				height="95px"
				position="relative"
				bottom="20px"
			>
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
			<button disabled = {buttonAddDisabled} onClick={() => createDoc()}>add</button>
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
	</Theme>)

});