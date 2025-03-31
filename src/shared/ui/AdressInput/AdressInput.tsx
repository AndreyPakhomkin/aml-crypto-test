import { Box, Button, TextField } from "@mui/material";
import { useGetDataMutation } from "../../../entities/graphApi";
import { useState } from "react";

const AdressInput: React.FC = () => {
    const [adress, setAdress] = useState<string>('');
    const [getData] = useGetDataMutation();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdress(event.target.value);
    };

    return (
        <Box
            component="section"
            sx={{ width: '720px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <TextField
                id="outlined-basic"
                label="adress"
                value={adress}
                onChange={handleChange}
            />
            <Button variant="outlined" onClick={() => getData({ adress: adress })}>Get data</Button>
        </Box>
    );
};

export default AdressInput;
