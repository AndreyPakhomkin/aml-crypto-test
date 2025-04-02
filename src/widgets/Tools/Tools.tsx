import { Box } from "@mui/material";
import AdressData from "../../shared/ui/AdressData/AdressData";
import SearchAdress from "../../shared/ui/SearchAdress/SearchAdress";

const Tools: React.FC = () => {

    return (
        <Box
            component="section"
            sx={{ width: '380px', border: '1px solid rgba(25, 118, 210, 0.5)', borderRadius: '5px', padding: '15px' }}
        >
            <SearchAdress />
            <AdressData />
        </Box>
    )
}

export default Tools;