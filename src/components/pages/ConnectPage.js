import React, {useContext} from "react";
import {ProgressBar} from "react-mdl";
import {Pages} from "../NavigationComponent";
import {AuthContext} from "../../utils/Auth";

const ConnectPage = ({nav, desktopUrl, timeout, interval}) => {
    const authContext = useContext(AuthContext);
    const checkIsEnvironmentReady = async () => {
        try {
            const status = await fetch(desktopUrl).then(res => res.status);
            if (status === 200) {
                clearInterval(checkInterval);
                return nav.go(Pages.DESKTOP, {desktopUrl})
            }

            if (Date.now() > timeOutAt) {
                clearInterval(checkInterval);
                authContext.dispatchAuthToast('Timeout reached while trying to connect to the Analytical Environment. Please try again later.');
                return nav.go(Pages.MAIN);
            }
        } catch (e) {
            clearInterval(checkInterval);
            authContext.dispatchAuthToast('Error occurred when trying to connect to Analytical Environment. Please try again later.');
            console.error(JSON.stringify(e));
            return nav.go(Pages.MAIN);
        }

    }

    const timeOutAt = timeout ? Date.now() + timeout : Date.now() + 7 * 60 * 1000 // 7 minutes
    const checkInterval = setInterval(checkIsEnvironmentReady, interval ? interval : 10 * 1000) // 10 seconds
    checkIsEnvironmentReady();

    return (
        <div className="progressStatus" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <h3>Waiting for Analytical Environment to be provisioned</h3>
            <ProgressBar indeterminate/>
        </div>
    )
}

export default ConnectPage;
