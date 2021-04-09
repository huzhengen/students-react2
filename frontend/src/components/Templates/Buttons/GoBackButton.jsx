import { Button } from 'antd'
import {useHistory} from "react-router-dom";
import Arrow from "../ArrowTemplate/Arrow";

function GoBackButton() {
    const history = useHistory();

    return (
        <Button className={"app-button_transparent go_back"}
                onClick={() => history.push('/')}>
            <Arrow/>
            Back to the list of students
        </Button>)
}

export default GoBackButton