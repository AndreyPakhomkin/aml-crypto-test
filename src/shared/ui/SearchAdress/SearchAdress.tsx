import { Box, Button, TextField, Typography } from "@mui/material";
import { useGetDataMutation } from "../../../entities/graphApi";
import { useState } from "react";

const SearchAdress: React.FC = () => {
    const [adress, setAdress] = useState<string>('');
    const [getData] = useGetDataMutation();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdress(event.target.value);
    };

    return (
        <Box sx={{ paddingBottom: '15px' }}>
            <Typography variant="h6">Search adress:</Typography>
            <Box
                component="section"
                sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                <TextField
                    id="outlined-basic"
                    label="adress"
                    value={adress}
                    onChange={handleChange}
                />
                <Button variant="outlined" onClick={() => getData({ adress: adress })}>Get data</Button>
            </Box>
        </Box>
    );
};

export default SearchAdress;
