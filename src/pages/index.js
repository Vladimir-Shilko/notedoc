import React, {useEffect, useState} from "react";
import theme from "theme";
import { Theme, Link, Text, Box, Button, Image, Section, Input, Span, Icon } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml, Override, StackItem, Stack } from "@quarkly/components";
import { Multiselect } from 'multiselect-react-dropdown';
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/messaging'
import async from "async";
//import avatarImage from './sale_agent.webp'
//import multi from './multiselect.css'
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

	async function registration(email, password, repPassword) {
		try {
			if(email != '' && password != '' && password === repPassword)
			{
				const data = await firebase.auth().createUserWithEmailAndPassword(email, password)
				alert('Вы успешно зарегистрировались');
				userLogin = email.substr(0, email.indexOf('@'));
				firebase.database().ref().child('users').child(email.substr(0, email.indexOf('@'))).child('userInfo').set(
					{
						login: email.substr(0, email.indexOf('@')),
						email: email,
						password: password,
						id: data.user.uid
					}
				)
			}
			else{alert('ошибка, проверьте введённые данные')}
			
		} catch (error) {
			console.log(error.message)
			throw error
		}
	}
	let userLogin;
	const [isAuth, setIsAuth] = useState(false);
	function checkLogin()
	{
		let email;
		let password;
		if(localStorage.id != null)
		{
			let id = localStorage.id;
			let users = firebase.database().ref().child('users').get().then((snap) =>
			{
				if(snap.exists())
				{
					let userss = snap.val();
					console.log(userss)
					for (let key in userss)
					{
						if(userss[key].userInfo != null && userss[key].userInfo.id === id)
						{
							email = userss[key].userInfo.email;
							password = userss[key].userInfo.password;
							setEmail(userss[key].userInfo.email);
							setPassword((userss[key].userInfo.password));
							login(email, password)
						}
					}
				}
			});

		}
		else
		{
			setDisplay({startPage: 'flex', profile: 'none', logPass: 'block', repPass: 'none', signIn: 'block'})
			// email = prompt('введите свою почту');
			// password = prompt('введите пароль');
			// setEmail(email); setPassword(password)
			// login(email, password)
		}
	}
	async function login(email, password) {
		try {
			const data = await firebase.auth().signInWithEmailAndPassword(email, password)
			alert('Добро пожаловать, '+email)
			setIsAuth(true);
			//setDisplay(prevState => {prevState.set(startPage, 'none'), prevState.set(profile, 'inline')})
			setDisplay({startPage: 'none', profile: 'flex', logPass: 'none', repPass: 'none', signIn: 'none'})
			localStorage.setItem('id', data.user.uid)
			console.log(data.user.uid)
			//setAddDisabled(false)
			setNotes([]);
			setAddDisabled(true);
			setEmail(email);
			setId(data.user.uid)
			userLogin = email.substr(0, email.indexOf('@'));
			setLog(userLogin);
			let user;
			let userdocs;
			let users = firebase.database().ref().child('users');
			users.on('value', function(users)
			{
				setUsersName([...Object.keys(users.val())])
			})
			let database = firebase.database().ref().child('users');
			database.child(userLogin).on('value', function(snap)
			{
				user = snap.val();
				if (user.userDocs != null && user.userDocs.inbox != null)
				{
					userdocs = user.userDocs.inbox;
					setlen(userdocs.length)
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
						setNotes([...userdocs])
						let database = firebase.database().ref('users/'+userLogin+'/userDocs/inbox/').set([...userdocs])
					}
				}
			})
		} catch (error) {
			console.log(error.message)
			//throw error
		}
	}
	async function signOut()
	{
		// let signOutCheck = confirm('вы действительно хотите выйти?');
		if(window.confirm('вы действительно хотите выйти?'))
		{
			
			await firebase.auth().signOut();
			setNotes([]);
			setDisplay({startPage: 'flex', profile: 'none', logPass: 'none', repPass: 'none', signIn: 'none'});
			localStorage.removeItem('id');
			setEmail(''); setPassword('');
		}
	}
	const [notes, setNotes] = useState([]);
	const [value, setValue] = useState();
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('');
	const [repPassword, setRepPassword] = useState('')
	const [id, setId] = useState('')
	const[log, setLog] = useState('')
	const [lengthOfDocs, setlen] = useState();
	const [buttonAddDisabled, setAddDisabled] = useState();
	const [file, setFile] = useState([]);
	const [colors, setColors] = useState([])
	const [usersName, setUsersName] = useState([])
	const [display, setDisplay] = useState({startPage: 'flex', profile: 'none', logPass: 'none', repPass: 'none', signIn: 'none'})
	var myFiles = [];
	var metadata = {
		contentType: 'image/jpeg'
	};
	useEffect(() =>
	{
	
	})
	function sendDoc(index)
	{
		try
		{
			let storage = firebase.storage().ref()
			let indexFile = (myFiles[index].length-1)
			let uploadFile = storage.child('images/'+notes[index].idDocument).put(myFiles[index][0])
			let recipients = [...notes[index].recipients]
			alert(log)
			setlen(index+1)
			let database = firebase.database().ref('users/'+log+'/userDocs/outbox/'+index).set(
				{
					dateOfTheEnd:notes[index].dateOfTheEnd,
					dateOfTheCreate:notes[index].dateOfTheCreate,
					description:notes[index].description,
					recipient:notes[index].recipient,
					recipients:[...notes[index].recipients],
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
										recipients:[...notes[index].recipients],
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
												recipients:[...notes[index].recipients],
												idDocument:notes[index].idDocument,
												sender:notes[index].sender

											}
										)
										break;
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
									recipients:[...notes[index].recipients],
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
			//let recipients = notes[index].recipient.split(',');
			let recipients = [...notes[index].recipients]
			let removeId = notes[index].idDocument;
			let data = firebase.database().ref().child('users').child(log).child('userDocs');
			data.on('value', function (docsRef)
			{
				let docs = docsRef.val();
				if(docs != null)
				{
					let outbox = docs.outbox;
					if(outbox != null)
					{
						if(outbox.length != null)
						{
							for(let i = 0; i < outbox.length; i++)
							{

								if( outbox[i] != null && removeId === outbox[i].idDocument)
								{
									firebase.database().ref().child('users').child(log).child('userDocs').child('outbox').child(i).remove();

								}
							}
						}
					}
				}
			})
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
											firebase.database().ref().child('users').child(item).child('userDocs').child('inbox').child(i).remove();
										}
									}
								}

							}
						}
					})
				}
			})
		}
		catch(error)
		{
			console.log(error)
		}
		setColors([...colors.slice(0, index), ...colors.slice(index + 1)])
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
	function  loadInbox()
	{
		setAddDisabled(true)
		setNotes([]);
		setColors([]);
		let userIn; let userdocsIn;
		let database = firebase.database().ref().child('users');
		database.child(log).on('value', function(snap)
		{
			//setColors([])
			userIn = snap.val();
			if(userIn == null || userIn.userDocs == null) return 0;
			userdocsIn = userIn.userDocs.inbox;
			console.log(userdocsIn)
			if(userdocsIn == null)
			{

			}
			else
			{
				for(let i = 0; i < userdocsIn.length;i++)
				{
					console.log(userdocsIn[i]);
					if(userdocsIn[i] == null)
					{
						userdocsIn.splice(i, 1);
					}
					else
					{

					}
				}
				setlen(userdocsIn.length)
				setNotes([...userdocsIn])
				let database = firebase.database().ref('users/'+log+'/userDocs/inbox/').set([...userdocsIn])
			}
		})
	}
	function loadOutBox()
	{
		setColors([])
		setAddDisabled(false)
		// if(isAuth)
		// {
		// 	setAddDisabled(false)
		// }
		setNotes([]);
		let userOut; let userdocsOut;
		let database = firebase.database().ref().child('users');
		database.child(log).on('value', function(snap)
		{
			userOut = snap.val();
			if(userOut == null || userOut.userDocs == null) return 0;
			userdocsOut = userOut.userDocs.outbox;
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
				setNotes([...userdocsOut])
				setlen(userdocsOut.length)
				let database = firebase.database().ref('users/'+log+'/userDocs/outbox/').set([...userdocsOut])
			}
		})
	}
	function loadOverdue()
	{
		setNotes([])
		setAddDisabled(true)
		let dataDocs = firebase.database().ref().child('users/'+log+'/userDocs')
		dataDocs.on('value', function (docs)
		{
			setNotes([])
			let alldocs = docs.val();
			if(alldocs == null) return 0;
			let inbox = [];
			let outbox = [];
			if(alldocs.inbox != null)
			{
				inbox = alldocs.inbox;
				for(let i = 0; i < inbox.length; i++)
				{
					if(inbox[i] == null) continue;
					if(+(Date.now()) < +(new Date(Date.parse(inbox[i].dateOfTheEnd))))
					{
						inbox.splice(i,1);
						i--;
					}
				}
			}
			if(alldocs.outbox != null)
			{
				outbox = alldocs.outbox;
				for(let i = 0; i < outbox.length; i++)
				{
					if(outbox[i] == null)
					{
						outbox.splice(i,1);
					}
					else if(+(Date.now()) < +(new Date(Date.parse(outbox[i].dateOfTheEnd))))
					{
						outbox.splice(i,1);
						i--;
					}
				}
			}
			setNotes([...inbox, ...outbox])
			let database = firebase.database().ref('users/'+log+'/userDocs/overdue/').set([...inbox, ...outbox])
		})
	}
	async function createDoc()
	{
		//await loadOutBox();
		setValue(value+1);
		setFile([...file, null])
		setNotes([...notes, {dateOfTheCreate: '2021-11-11', dateOfTheEnd: '2021-11-11', description: '', recipient: '', recipients: [], idDocument: Math.floor(Math.random()*1000000),sender: log, filePath: ''}]);
	}
	function onSelect(selectedList, selectedItem)
	{
		alert('Ok')
	}
	try
	{
		var result = notes.map((note, index) => {
			return(<div key = {note.documentId}>
				<Box disabled = {!(log === note.sender)} height="100px" width = '100%'>
				<Input disabled = {!(log === note.sender)} value={note.description} onChange={event => {note.description = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}} height="95px" position="relative"  type="text" width = '15%' />
				<Button  onClick={() => downloadFile(index)} height="95px" position="relative" width = '8%'>
					скачать
				</Button>
				<Button
					position="relative"
					//bottom="20px"
					height="95px" width="20%" display="inline"
				>
					<Input  type="file" onChange={event =>{myFiles[index] = event.target.files; console.log(event.target.files)}}  width="50%" position="relative" right="20%" />
					загрузить
				</Button>
				<Input disabled = {!(log === note.sender)} type="date" value={note.dateOfTheCreate} onChange={event => {event.preventDefault(); note.dateOfTheCreate = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}}
				type="date"
				height="95px"
				width="15%"
				//min-width="182px"
				font="normal 300 16px/1.5 -apple-system, system-ui, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
				/>
				<Input disabled = {!(log === note.sender)} type="date" value={note.dateOfTheEnd} onChange={event => {event.preventDefault();note.dateOfTheEnd = event.target.value;setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}}
				type="date"
				height="95px"
				width="15%"
				//min-width="182px"
				font="normal 300 16px/1.5 -apple-system, system-ui, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
				/>
		<Button  onClick={() => {sendDoc(index)}} disabled = {!(log === note.sender)}
					width="8%"
					//overflow-x="visible"
					display="inline-block"
					height="95px"
					position="relative"
					bottom={0}
					color="#000000"
					//right="15%"
						 color="#000000"
				>
					отправить
				</Button>
				<Button onClick = {() => alert('скоро доработаем')}
				width="8%"
				height="95px"
				position="relative"
				bottom={0}
				background="#008000"
				//right="15%"
				>
				подтвердить
				</Button>
				<Button disabled = {!(log === note.sender)} onClick={() => remItem(index)}
						 width="8%"
						 height="95px"
						 position="relative"
						 bottom={0}
						 background="#cc0003"
						 //right="15%"
				>
					удалить
				</Button>
			</Box>
			<Multiselect disabled = {!(log === note.sender)}
				// options={Object.keys(firebase.database().ref().child('users'))}
				options = {usersName}
				selectedValues={[...note.recipients]}
				onSelect={(selectedList, selectedItem) => {note.recipients = [...selectedList];setNotes([...notes.slice(0, index),note, ...notes.slice(index + 1)])}}
				isObject={false}></Multiselect>
			</div>
			)
		});
	}
	catch(error)
	{

	}

	return (<Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"index"} />
		<Helmet>
			<title>
				NoteDoc
			</title>
			<meta name={"description"} content={"Web site created using quarkly.io"} />
			<link rel={"shortcut icon"} href={"https://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
		</Helmet>
		<body>
		<script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js"></script>
		<script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-analytics.js"></script>
		</body>
		<Section display = {display.profile}>
		{/* <Box>
			<Input value={email} onChange={event => setEmail(event.target.value)} />
			<Input type = 'password' value={password} onChange={event => setPassword(event.target.value)} />
			<Button onClick={() => registration(email, password)}>register</Button>
		</Box> */}
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
				{/* <Button  onClick={() => checkLogin()} position="relative" left="150px">
					войти
				</Button> */}
				<Button  onClick={() => signOut()} position="relative" left="150px">
					выйти
				</Button>
				<Image src = 'https://ic.pics.livejournal.com/misscaprizzz/85343571/68516/68516_original.jpg'alt = 'avatarImage' width="100px" height="100px" position="relative" left="0px" />
			</Box>
		</Section>
		<Box>
			<Button onClick={() => loadInbox()} disabled = {!isAuth}>
				входящие
			</Button>
			<Button onClick={() => loadOutBox()} disabled = {!isAuth}>
				исходящие
			</Button>
			<Button display = 'none' disabled = 'true'>
				ожидают подтверждения
			</Button>
			<Button onClick={() => loadOverdue()} disabled = {!isAuth}>
				просроченные
			</Button>
			<Button display = 'none' disabled = 'true'>
				выполненные
			</Button>
		</Box>
		<Box />
		<div >
			{result}
			{/* <input value={value} onChange={event => setValue(event.target.value)} /> */}
			<button disabled = {buttonAddDisabled} onClick={() => createDoc()}>add</button>
		</div>
		</Section>
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
		<Section display = {display.startPage}
			color="--light"
			padding="100px 0"
			sm-padding="40px 0"
			position="relative"
			background="linear-gradient(0deg,rgba(25, 30, 34, 0.8) 0%,rgba(25, 30, 34, 0.8) 100%),--color-darkL2 url(http://s13.ru/ru/files/news/image/1280/0/1540812212_1.jpg)"
		>
			<Stack>
				<StackItem width="50%" md-width="100%">
					<Override slot="StackItemContent" flex-direction="column" />
					<Box
						padding="0 0 0 64px"
						sm-padding="64px 0 0 0"
						margin="32px 0 0 0"
						max-width="360px"
						position="relative"
					>
						<Icon
							position="absolute"
							size="48px"
							top="0"
							left="0"
							category="md"
							icon={MdLocationOn}
						/>
						<Text as="h4" margin="6px 0" font="--base">
							Visit us
						</Text>
						<Text as="p" margin="6px 0" font="--headline3">
							mostovaya 31, Grodno, Belarus
						</Text>
					</Box>
					<Box
						padding="0 0 0 64px"
						sm-padding="64px 0 0 0"
						margin="64px 0 0 0"
						max-width="360px"
						position="relative"
					>
						<Icon
							position="absolute"
							size="48px"
							top="0"
							left="0"
							category="md"
							icon={MdEmail}
						/>
						<Text as="h4" margin="6px 0" font="--base">
							Email us
						</Text>
						<Text as="p" margin="6px 0" font="--headline3">
							Shilko_VI_20@mf.grsu.by
						</Text>
					</Box>
					<Box padding="0 0 0 64px" margin="64px 0 0 0" max-width="360px" position="relative">
						<Icon
							position="absolute"
							size="48px"
							top="0"
							left="0"
							category="md"
							icon={MdPhone}
						/>
						<Text as="h4" margin="6px 0" font="--base">
							Call us
						</Text>
						<Text as="p" margin="6px 0" font="--headline3">
							-
						</Text>
					</Box>
					<Box
						padding="0 0 0 64px"
						sm-padding="0"
						margin="48px 0"
						max-width="360px"
						position="relative"
						display="flex"
					>
						<Icon
							category="fa"
							icon={FaFacebookF}
							width="48px"
							height="48px"
							size="24px"
							margin-right="16px"
							background="--color-primary"
							border-radius="50%"
						/>
						<Icon
							category="fa"
							icon={FaTwitter}
							width="48px"
							height="48px"
							size="24px"
							margin-right="16px"
							background="--color-primary"
							border-radius="50%"
						/>
						<Icon
							category="fa"
							icon={FaLinkedinIn}
							width="48px"
							height="48px"
							size="24px"
							margin-right="16px"
							background="--color-primary"
							border-radius="50%"
						/>
					</Box>
				</StackItem>
				<StackItem width="50%" md-width="100%">
					<Box
						max-width="360px"
						padding="56px 48px"
						margin="0 0 0 auto"
						md-max-width="100%"
						background="--color-primary"
					>
						<Button onClick={() => checkLogin()}>
							Вход
						</Button>
						<Button onClick= {() => {setDisplay({startPage: 'flex', profile: 'none', logPass: 'block', repPass: 'block', signIn: 'none'})}}>
							Регистрация
						</Button>
						<Text display = {display.logPass} width="50px">
							Email:
						</Text>
						<Input value={email} onChange={event => setEmail(event.target.value)} display = {display.logPass} />
						<Text  display = {display.logPass}>
							Пароль:
						</Text>
						<Input type = 'password' value={password} onChange={event => setPassword(event.target.value)} display = {display.logPass}/>
						<Text display = {display.repPass}>
							Повторите пароль:
						</Text>
						<Input type = 'password' value={repPassword} onChange={event => setRepPassword(event.target.value)} display = {display.repPass}/>
						<Button onClick={() => login(email, password)} display = {display.signIn} width="233px">
							войти
						</Button>
						<Button onClick={() => registration(email, password, repPassword)} display = {display.repPass} width="233px">
							зарегистрироваться
						</Button>
					</Box>
				</StackItem>
			</Stack>
		</Section>
		<RawHtml>
			<style place={"endOfHead"} rawKey={"60fe92edfb3a6f00181af8d3"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>)

});