import { AppBar, Toolbar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import NavigationLink from './shared/NavigationLink';

const Header = () => {
	const auth = useAuth();
	return (
		<AppBar sx={{ bgcolor: "transparent", boxShadow: "none",}}>
			<Toolbar sx={{ display: "flex",justifyContent:'flex-end' }}>
				{/* <Logo/> */}
				<div>
					{auth?.isLoggedIn ? (
						<>
							{/* <NavigationLink
								bg='#00fffc'
								to='/chat'
								text='Go To Chat'
								textColor='black'
							/> */}
							<NavigationLink
								bg='#51538f'
								textColor='white'
								to='/'
								text='Logout'
								onClick={auth.logout}
							/>
						</>
					) : (
					<>
						<NavigationLink
							bg='#00fffc'
							to='/login'
							text='Login'
							textColor='black'
						/>
						<NavigationLink
							bg='#51538f'
							textColor='white'
							to='/signup'
							text='Signup'
						/>
					</>
					)}
				</div>
			</Toolbar>
		</AppBar>
	)
};

export default Header;