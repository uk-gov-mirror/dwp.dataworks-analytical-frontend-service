import React, {useState} from "react";
import {Button, Spinner} from "react-mdl";
import {Pages} from "../NavigationComponent";
import {AuthContext} from "../../utils/Auth";
import apiCall from "../../utils/api";

const MainPage = ({nav}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMfaSetup, setIsMfaSetup] = useState(false);
    const authContext = React.useContext(AuthContext);

    React.useEffect(() => {
        async function userSetup() {
            try{
                const setup = await apiCall(authContext, "verify-user");
                if (!setup) return nav.go(Pages.USER_NOT_SET_UP);
            } catch (e) {
                authContext.dispatchAuthToast('The Analytical Environment is unavailable. Please try again later.');
                console.error(`Error connecting to OS: ${e}`);
            }  
        }


        async function checkMfaSetup() {
            const user = await authContext.getCurrentUser();
            if (!authContext.isFederated(user) && user.preferredMFA !== 'SOFTWARE_TOKEN_MFA') {
                return nav.go(Pages.SETUP_MFA);
            }

            if (isMfaSetup === false) setIsMfaSetup(true);
        }
        checkMfaSetup();
        userSetup();
    });

    const connect = async () => {
        setIsLoading(true);
        try {
            // in this context, screenHeight and screenWidth refer to the VNC screen being setup, which can be any dimensions and aspect ratio
            const desktopUrl = await apiCall(authContext, "connect", {screenHeight: window.innerHeight, screenWidth: window.innerWidth});
            nav.go(Pages.CONNECT, {desktopUrl});
        } catch (e) {
            authContext.dispatchAuthToast('Error encountered while provisioning environment. Please try again later.');
            console.error(`Error connecting to OS: ${e}`);
            nav.go(Pages.MAIN);
        } finally {
            setIsLoading(false);
        }
    }

    if (isMfaSetup)
        return (
            <div>
                <Button raised colored onClick={connect} disabled={isLoading}
                        style={{display: "inline-flex", alignItems: "center"}}>
                    <Spinner singleColor style={{
                        display: isLoading ? 'inline-block' : 'none',
                        margin: '15px',
                    }}/>
                    Connect to Analytical Environment
                </Button>
            </div>)
    else
        return (<div>Loading...</div>)
};

export default MainPage;
