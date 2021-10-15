import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardHeader,
	CircularProgress,
	Link,
	ListItem,
	ListItemText,
	Paper
} from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import searchHearingByID from '../../axios/hearing/searchByID';
import QueryString from 'querystring';
import { useHistory } from 'react-router-dom';
import ImageShow from '../basic/ImageShow';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		flexDirection: 'column',
		paddingLeft: '10vh',
		paddingTop: '8vh'
	},

	header: {
		fontSize: 50
	},

	subHeader: {
		fontSize: 35
	},

	description: {
		padding: theme.spacing(2),
		fontSize: 18,
		color: theme.palette.text.secondary
	},

	main: {
		justifyContent: 'space-between',
		flex: 1,
		flexDirection: 'column'
	},

	margin: {
		margin: theme.spacing(1)
	},

	extendedIcon: {
		marginRight: theme.spacing(1)
	},

	title: {
		textAlign: 'center',
		fontSize: '30px',
		fontWeight: 'bold',
		color: 'black'
	},

	scrollable: {
		maxHeight: '90%',
		overflow: 'auto'
	},

	listItem_primary: {
		backgroundColor: '#e9ebf2'
	},

	listItem_secondary: {
		backgroundColor: '#f5f6fa'
	},

	text: {
		fontSize: 16
	},

	table: {
		fontSize: 16
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.primary
		// width: '100%'
	},
	card: {
		background: '#FFDDEE'
	},
	text_regular: {
		fontSize: '20px'
	},
	text_card_header: {
		fontSize: '35px',
		fontWeight: 'bold',
		align: 'center'
	}
}));

const ViewHearing = props => {
	const classes = useStyles();
	const [loading, setLoading] = useState(true);
	const [hearing, setHearing] = useState({});
	const history = useHistory();

	useEffect(async () => {
		await searchHearingByID(
			QueryString.parse(props.location.search.substring(1)),
			{
				Authorization: 'Officer ' + localStorage.getItem('token'),
				'Content-type': 'application/json'
			},
			(res, err) => {
				if (res) {
					setHearing(res);
					setLoading(false);
				} else {
					history.push({
						pathname: '/error',
						authenticated: true,
						message: err.message,
						status: err.errorCode
					});
				}
			}
		);
	}, []);

	const linkToFileName = link => {
		const tokens = link.split('/');
		return tokens[tokens.length - 1];
	};

	if (loading) {
		return (
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<CircularProgress color="secondary" />
			</div>
		);
	}

	return (
		<div className={classes.root}>
			<Card>
				<CardHeader
					align="center"
					classes={{
						title: classes.text_card_header,
						subheader: classes.text_card_header
					}}
					title="🗣 শুনানী"
					subheader={`মামলা নংঃ ${hearing.case}`}
				/>
			</Card>
			<br />
			<br />

			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card}>
						<CardContent classes={classes.main}>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '40vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									বিস্তারিত
								</Typography>
								<List>
									<ListItem key={0}>
										<ListItemText>
											<Typography className={classes.text_regular}>
												<b>শুনানীর তারিখ: </b>
												{new Date(
													hearing.date
												).toLocaleDateString()}
											</Typography>
										</ListItemText>
									</ListItem>

									<ListItem key={2}>
										<Typography className={classes.text_regular}>
											<b>বিস্তারিত: </b>
											{hearing.description}
										</Typography>
									</ListItem>
								</List>
							</Paper>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} sm={6}>
					<Card className={classes.card}>
						<CardContent>
							<Paper
								elevation={3}
								className={classes.paper}
								style={{
									minHeight: '40vh'
								}}
							>
								<Typography variant="h6" className={classes.title}>
									প্রয়োজনীয় সংযুক্তি
								</Typography>
								<br />
								<ImageShow images={hearing.primary_documents} />
								<Typography
									align="left"
									style={{ paddingLeft: '1.8rem' }}
									variant="h6"
								>
									শুনানীর স্ক্যান কপি
								</Typography>
							</Paper>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
};

export default ViewHearing;
