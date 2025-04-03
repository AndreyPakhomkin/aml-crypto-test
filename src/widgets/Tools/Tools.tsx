import { Box } from "@mui/material";
import AdressData from "../../shared/ui/AdressData/AdressData";
import SearchAdress from "../../shared/ui/SearchAdress/SearchAdress";

interface ToolsProps {
    updateNodes: () => void
}

const Tools: React.FC<ToolsProps> = ({ updateNodes }) => {

    return (
        <Box
            component="section"
            sx={{ width: '380px', border: '1px solid rgba(25, 118, 210, 0.5)', borderRadius: '5px', padding: '15px' }}
        >
            <SearchAdress updateNodes={updateNodes} />
            <AdressData />
        </Box>
    )
}

export default Tools;