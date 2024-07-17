import { TextField } from "@mui/material";

type Props = {
	name: string,
	label: string,
	type: string
};
const CustomizedInput = (props: Props) => {
	return (
	<TextField 
		margin="normal"
		InputLabelProps={{ style: { color: "white" } }}
		name={props.name} 
		variant="standard"
		color="secondary"
		label={props.label} 
		sx={{background:'transparent'}}
		type={props.type}
		InputProps={{ style: { width: '400px', borderRadius: 10, fontSize: 20, color: "white"} }}
	/>
	)
};

export default CustomizedInput;