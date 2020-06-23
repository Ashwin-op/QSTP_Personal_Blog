import React, {useState} from "react";
import {Alert as AlterBootstrap} from "reactstrap";
import {connect} from "react-redux";

function Alert(props) {
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    return props.message !== "" ? (
        <div>
            <AlterBootstrap color={props.type} isOpen={visible} toggle={onDismiss}>
                {props.message}
            </AlterBootstrap>
        </div>
    ) : null;
}

const mapStateToProps = state => ({
    type: state.alert.type,
    message: state.alert.message
});

export default connect(mapStateToProps)(Alert);
