/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Logo = () => {
	return (
		<div 
			style={{
				display: "flex",
				marginRight: "auto",
				alignItems: "center",
				gap: "15px",
				background:'red'
			}}
		>
			<Typography
					sx={{ 
						display: { md:"block", sm:"none", xs:"none"}, 
						mr: "auto", 
						fontWeight: "800",
						textShadow: "2px 2px 20px #000", 
					}}
				>
					<span style={{ fontSize:"20px" }}></span>
				</Typography>
		</div>
	)
};

export default Logo;