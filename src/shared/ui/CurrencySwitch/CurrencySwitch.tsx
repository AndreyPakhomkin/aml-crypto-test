import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import "./CurrencySwitch.scss";
import { useAppDispatch } from "../../hooks/storeHooks";
import { setDisplyCurrency } from "../../../entities/graphSlice";

interface CurrencySwitchProps {
    displayCurrency: string
}

const CurrencySwitch: React.FC<CurrencySwitchProps> = ({ displayCurrency }) => {
    const dispatch = useAppDispatch()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setDisplyCurrency(event.target.value as 'usdt' | 'tokens'))
    };

    return (
        <div className="currency-switch-container">
            <RadioGroup
                aria-labelledby="radio-buttons-group"
                name="currency-buttons-group"
                value={displayCurrency}
                onChange={handleChange}>
                <FormControlLabel value="usdt" control={<Radio />} label="usdt" />
                <FormControlLabel value="token" control={<Radio />} label="token" />
            </RadioGroup>
        </div>
    )
}

export default CurrencySwitch