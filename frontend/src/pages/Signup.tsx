import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import CustomizedInput from '../components/shared/CustomizedInput';
import { IoIosLogIn} from 'react-icons/io';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL="http://localhost:5000/api/v1";
axios.defaults.withCredentials=true;
const Signup = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		try {
			toast.loading("Signing Up", { id: "signup" });
			await auth?.signup(name, email, password);
			toast.success("Signed Up Successfully", { id: "signup" });
		} catch (error) {
			console.log(error);
			toast.error("Signing Up Failed", { id: "signup" });
		}
	};

	useEffect(() => {
		if (auth?.isLoggedIn) {
			return navigate("/drone");
		}
	}, [auth]);
	
	return (
		<Box width={"100%"} height={"100%"}  flex={1} className=' shadow-slate-100'>
			<Box 
			className='px-4'
				display={"flex"} 
				flex={{ xs: 1, md: 0.5 }} 
				justifyContent={'center'}
				alignItems={'center'}
				// padding={2}
				// ml={'auto'}
				mt={'100px'}
				
			>
				<form
					onSubmit={(handleSubmit)}
					style={{
						margin: "auto",
						padding: "30px",
						boxShadow: "10px 10px 20px #000",
						borderRadius: "10px",
						border: "none",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<Typography
							variant='h4'
							textAlign={'center'}
							padding={2}
							fontWeight={600}
						>
							Signup
						</Typography>
						<CustomizedInput type='text' name='name' label='Name'/>
						<CustomizedInput type='email' name='email' label='Email'/>
						<CustomizedInput type='password' name='password' label='Password'/>
						<Button
							type="submit"
							sx={{
								px: 2,
								py: 1,
								mt: 2,
								width: "400px",
								borderRadius: 2,
								bgcolor: "#00fffc",
								":hover": {
									bgcolor: "white",
									color: "black"
								}
							}}
							endIcon={<IoIosLogIn/>}
						>
							Signup
						</Button>
					</Box>
				</form>
			</Box>
		</Box>
	)
};

export default Signup;