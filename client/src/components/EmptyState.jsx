import Heading from "./Heading";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import ROUTES from "../constants/routes";
const EmptyState = (props) => {
    const navigate = useNavigate();
    const {
        title = 'No exact matches', 
        subtitle = 'Try changing or removing some of your filters', 
        showReset
    } = props

    return (
        <div className="h-[100vh] flex flex-col gap-2 justify-center items-center pt-20">
            <Heading center title={title} subtitle={subtitle}/>
            <div className="w-48 mt-4">
                {showReset && (
                    <Button outline label="Remove all filters" onClick={() => {navigate(ROUTES.HOME)}}></Button>
                )}
            </div>
        </div>
    )
}

export default EmptyState;