import jsondata from "../../../locales/data/initialdata.json";
import {LoginSocialFacebook} from "reactjs-social-login";
import {computeAndSocialAccountJSONForFacebook, getInitialLetterCap, isNullOrEmpty} from "../../../utils/commonUtils";
import {FacebookLoginButton} from "react-social-login-buttons";
import fb_img from "../../../images/fb.svg";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    disconnectSocialAccountAction,
    getAllConnectedSocialAccountAction, getAllInstagramBusinessAccounts,
    socialAccountConnectActions
} from "../../../app/actions/socialAccountActions/socialAccountActions";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";
import {showErrorToast} from "../../common/components/Toast";
import Swal from "sweetalert2";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import FacebookModal from "../../modals/views/facebookModal/FacebookModal";
import {
    disconnectDisabledPages,
    getAllFacebookPages,
    getFacebookConnectedPages
} from "../../../app/actions/facebookActions/facebookActions";
import default_user_icon from "../../../images/default_user_icon.svg"
import {NoInstagramBusinessAccountFound, SocialAccountProvider} from "../../../utils/contantData";
import AccountAlreadyConnectedWarningModal from "./AccountAlreadyConnectedWarningModal";

const SocialAccounts = () => {
    const dispatch = useDispatch();
    const token = getToken();
    // const [checkForDisablePages, setCheckForDisablePages] = useState(true);
    const [currentConnectedFacebookPages, setCurrentConnectedFacebookPages] = useState(null);
    const [currentConnectedInstagramPages, setCurrentConnectedInstagramPages] = useState(null);
    const [showAccountAlreadyConnectedWarningModal, setShowAccountAlreadyConnectedWarningModal] = useState(false);
    const [facebookDropDown, setFacebookDropDown] = useState(false);
    const [instagramDropDown, setInstagramDropDown] = useState(false);
    const [showFacebookModal, setShowFacebookModal] = useState(false);
    const [showInstagramModal, setShowInstagramModal] = useState(false);


    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const getAllFacebookPagesData = useSelector(state => state.facebook.getFacebookPageReducer);
    const instagramBusinessAccountsData = useSelector(state => state.socialAccount.getAllInstagramBusinessAccountsReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const socialAccountConnectData = useSelector(state => state.socialAccount.connectSocialAccountReducer);



    useEffect(() => {
        if (token) {
            const decodeJwt = decodeJwtToken(token);
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt.customerId, token: token}))
        }
    }, [token])


    useEffect(() => {

        if ((!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length > 0) && getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'FACEBOOK') !== undefined) {
            let faceBookSocialAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'FACEBOOK');
            dispatch(getAllFacebookPages({
                providerId: faceBookSocialAccount?.providerId,
                accessToken: faceBookSocialAccount?.accessToken
            })).then((res) => {
                const decodeJwt = decodeJwtToken(token);
                dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            })
        }

    }, [getAllConnectedSocialAccountData]);
    useEffect(() => {
        if (!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'INSTAGRAM').length > 0) {
            let instagramSocialAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'INSTAGRAM');
            dispatch(getAllInstagramBusinessAccounts({
                accessToken: instagramSocialAccount?.accessToken
            })).then((res) => {
                const decodeJwt = decodeJwtToken(token);
                dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            })
        }

    }, [getAllConnectedSocialAccountData]);


    useEffect(() => {
        if (connectedPagesData?.facebookConnectedPages && Array.isArray(connectedPagesData?.facebookConnectedPages)) {
            const connectedInstagramSocialAccount = getAllConnectedSocialAccountData?.data?.filter(socialAccount => socialAccount?.provider === "INSTAGRAM")[0]
            const connectedInstagramPages = connectedPagesData?.facebookConnectedPages?.filter(pageData => pageData?.socialMediaAccountId === connectedInstagramSocialAccount?.id)
            const currentConnectedInstagramPages = instagramBusinessAccountsData?.data?.filter(page =>
                connectedInstagramPages?.some(instaPage => instaPage?.pageId === page?.id)
            );
            setCurrentConnectedInstagramPages(currentConnectedInstagramPages || null);
            // List of pages to remove from the database incase user has deactivated page but it will still be present in our db
            // const pagesToRemove = connectedInstagramPages?.filter(page =>
            //     !instagramBusinessAccountsData?.data?.some(fbPage => fbPage?.id === page?.pageId)
            // );
            // if (!isNullOrEmpty(pagesToRemove)) {
            //     checkForDisablePages && removeDisabledPages(pagesToRemove)
            // } else {
            //     setCheckForDisablePages(false);
            // }

        }
    }, [connectedPagesData?.facebookConnectedPages]);

    useEffect(() => {

        if (connectedPagesData?.facebookConnectedPages && Array.isArray(connectedPagesData?.facebookConnectedPages)) {
            const connectedFacebookSocialAccount = getAllConnectedSocialAccountData?.data?.filter(socialAccount => socialAccount?.provider === "FACEBOOK")[0]
            const connectedFacebookPages = connectedPagesData?.facebookConnectedPages?.filter(pageData => pageData?.socialMediaAccountId === connectedFacebookSocialAccount?.id)
            const currentConnectedFaceBookPages = getAllFacebookPagesData?.facebookPageList?.filter(page =>
                connectedFacebookPages?.some(fbPage => fbPage?.pageId === page?.id)
            )
            setCurrentConnectedFacebookPages(currentConnectedFaceBookPages || null);
            // List of pages to remove from the database incase user has deactivated page but it will still be present in our db

            // const pagesToRemove = connectedFacebookPages?.filter(page =>
            //     !facebookPageList?.some(fbPage => fbPage?.id === page?.pageId)
            // );
            // if (!isNullOrEmpty(pagesToRemove)) {
            //     checkForDisablePages && removeDisabledPages(pagesToRemove)
            // } else {
            //     setCheckForDisablePages(false);
            // }
        }
    }, [connectedPagesData?.facebookConnectedPages]);



    const connectSocialMediaAccountToCustomer = (object) => {
        object.then((res) => {
            dispatch(socialAccountConnectActions(res)).then((response) => {
                if (response.meta.requestStatus === "rejected" && response.payload.status === 409) {
                    setShowAccountAlreadyConnectedWarningModal(true)
                }

                dispatch(getAllConnectedSocialAccountAction(res))
                dispatch(getAllSocialMediaPostsByCriteria({
                    token: token,
                    query: {limit: 5, postStatus: ["SCHEDULED"]}
                }));
            })
        }).catch((error) => {
            showErrorToast(error.response.data.message);
        })
    }
    const connectInstagramAccountToCustomer = (data) => {
        dispatch(socialAccountConnectActions(data)).then((response) => {
            if (response.meta.requestStatus === "rejected" && response.payload.status === 409) {
                setShowAccountAlreadyConnectedWarningModal(true)
            }
            dispatch(getAllConnectedSocialAccountAction(data))
            dispatch(getAllSocialMediaPostsByCriteria({
                token: token,
                query: {limit: 5, postStatus: ["SCHEDULED"]}
            }));
        })

    }
    // const removeDisabledPages = (disabledPages, x) => {
    //     const updatedData = disabledPages?.map(page => {
    //         return {
    //             pageId: page.pageId,
    //             name: page.name,
    //             imageUrl: page.imageUrl,
    //             access_token: page.access_token,
    //             socialMediaAccountId: page.socialMediaAccountId
    //         }
    //     })
    //     const requestBody = {
    //         token: token,
    //         pagesToDisconnect: updatedData
    //     }
    //     // dispatch(disconnectDisabledPages(requestBody)).then(res => {
    //     //     setCheckForDisablePages(false)
    //     // })
    //
    // }


    const disConnectSocialMediaAccountToCustomer = (socialMediaType) => {
        Swal.fire({
            icon: 'warning',
            title: `Disconnect ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} Account`,
            text: `Are you sure you want to disconnect your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} account?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
        }).then((result) => {
            if (result.isConfirmed) {
                if (socialMediaType === "INSTAGRAM") {
                    currentConnectedFacebookPages?.length === 0 ? setFacebookDropDown(true) : setFacebookDropDown(false)
                    setCurrentConnectedInstagramPages([])
                }
                if (socialMediaType === "FACEBOOK") {
                    currentConnectedInstagramPages?.length === 0 ? setInstagramDropDown(true) : setInstagramDropDown(false)
                    setCurrentConnectedFacebookPages([])
                }
                const decodeJwt = decodeJwtToken(token);
                dispatch(disconnectSocialAccountAction({
                    customerId: decodeJwt?.customerId,
                    socialMediaAccountId: getAllConnectedSocialAccountData?.data?.find(c => c.provider === socialMediaType)?.id,
                    token: token
                })).then((response) => {
                    dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt?.customerId, token: token}));
                    dispatch(getAllSocialMediaPostsByCriteria({
                        token: token,
                        query: {limit: 5, postStatus: ["SCHEDULED"]}
                    }));
                    Swal.fire({
                        icon: 'success',
                        title: `${getInitialLetterCap(SocialAccountProvider[socialMediaType])} Account Disconnected`,
                        text: `Your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} account has been disconnected successfully.`,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: '#F07C33',
                    });
                }).catch((error) => {
                    console.error('Error disconnecting Facebook account:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `An error occurred while disconnecting your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])}  account. Please try again later.`,
                    });
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled',
                    text: `Your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} account is still connected.`,
                    icon: 'info',
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonColor: '#E6E9EC'
                });
            }
        });


    }

    const facebook = () => {
        setShowFacebookModal(true)
    }

    const commonButtonStyle = {
        borderRadius: '5px',
        background: "#F07C33",
        boxShadow: "unset",
        fontSize: "12px",
        color: "#fff",
        border: '1px solid #F07C33',
        height: "39px",
        minWidth: "111px",
        margin: "10px",
        width: "11px",
    };

    return (
        <div className="col-lg-5 col-xl-4 col-sm-12">

            {/* socail media */}
            <div className="cmn_background social_media_wrapper">
                <div className="social_media_account">
                    <h3>{jsondata.socialAccount}</h3>
                </div>

                {/*facebook connect starts */}

                {
                    getAllConnectedSocialAccountData?.loading ?
                        <SkeletonEffect count={1}></SkeletonEffect> :
                        getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length === 0 ?

                            <div className="social_media_outer">
                                <div className="social_media_content">
                                    <i className={`fa-brands fa-facebook`}
                                       style={{color: "#0866ff", fontSize: "24px"}}/>
                                    <div>
                                        <h5 className="">Facebook account</h5>
                                        <h6 className="cmn_headings">www.facebook.com</h6>
                                    </div>
                                </div>

                                <LoginSocialFacebook
                                    isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                    appId={`${import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}`}
                                    redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                    onResolve={(response) => {
                                        setFacebookDropDown(true)
                                        setInstagramDropDown(false)
                                        connectSocialMediaAccountToCustomer(computeAndSocialAccountJSONForFacebook(response, SocialAccountProvider.FACEBOOK))
                                    }}
                                    onReject={(error) => {
                                        console.log("error",error)

                                    }}>

                                    <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                         icon={() => null} preventActiveStyles={true}
                                                         style={commonButtonStyle}/>
                                </LoginSocialFacebook>

                            </div>

                            :

                            <div className=" cmn_drop_down dropdown">
                                <div className="dropdown_header">
                                    <div className="social_media_outer">
                                        <div className="social_media_content"
                                             onClick={() => setFacebookDropDown(!facebookDropDown)}
                                        >
                                            <img className="cmn_width" src={fb_img}/>
                                            <div className="text-start flex-grow-1">
                                                <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'FACEBOOK')?.name || "facebook"}</h5>
                                                <h4 className="connect_text cmn_text_style">Connected</h4>
                                            </div>
                                            {
                                                (!getAllFacebookPagesData?.loading || !getAllConnectedSocialAccountData?.loading || !connectedPagesData?.loading) && currentConnectedFacebookPages?.length === 0 &&
                                                <button className="DisConnectBtn cmn_connect_btn w-auto"
                                                        onClick={() => disConnectSocialMediaAccountToCustomer("FACEBOOK")}>
                                                    Disconnect
                                                </button>
                                            }
                                            <div className={ facebookDropDown? "upside-down":""}>
                                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path id="Icon"
                                                          d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                          stroke="#5F6D7E" strokeWidth="1.67"
                                                          strokeLinecap="round"/>
                                                </svg>

                                            </div>


                                        </div>
                                    </div>

                                    {
                                        facebookDropDown === true &&

                                        <ul className="menu_items">
                                            {
                                                getAllFacebookPagesData?.loading ?
                                                    <SkeletonEffect count={3}/> :

                                                    currentConnectedFacebookPages?.length === 0 ?
                                                        <div className={"no-page-connected-outer text-center"}>
                                                            <div>No active connections at the moment.</div>
                                                            <div className={"cursor-pointer connect-page-btn"}
                                                                 onClick={() => facebook()}
                                                            >Connect
                                                                now
                                                            </div>
                                                        </div> :
                                                        <>
                                                            {
                                                                currentConnectedFacebookPages?.map((data, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                            <div
                                                                                className="user_profileInfo_wrapper">
                                                                                <div className="user_Details">
                                                                                    <img
                                                                                        src={data?.picture?.data?.url || default_user_icon}
                                                                                        height="30px"
                                                                                        width="30px"/>
                                                                                    <h4 className="cmn_text_style">{data.name}</h4>
                                                                                </div>
                                                                                <h4 className={"connect_text cmn_text_style"}>Connected</h4>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }

                                                            <li>
                                                                {
                                                                    (getAllFacebookPagesData?.facebookPageList && Array.isArray(getAllFacebookPagesData?.facebookPageList)) &&
                                                                    <div className="connectDisconnect_btn_outer">
                                                                        <button
                                                                            className="DisConnectBtn cmn_connect_btn"
                                                                            onClick={() => disConnectSocialMediaAccountToCustomer("FACEBOOK")}>
                                                                            Disconnect
                                                                        </button>
                                                                        <button className="ConnectBtn cmn_connect_btn"
                                                                                onClick={() => facebook()}
                                                                        >
                                                                            Connect More
                                                                        </button>
                                                                    </div>

                                                                }
                                                            </li>


                                                        </>


                                            }


                                        </ul>}

                                </div>
                            </div>

                }

                {/*facebook connect ends */}

                {/* start instagram connect */}

                {
                    getAllConnectedSocialAccountData?.loading ?
                        <SkeletonEffect count={1}></SkeletonEffect> :
                        getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'INSTAGRAM').length === 0 ?
                            <div className="social_media_outer">
                                <div className="social_media_content">
                                    <i className="fa-brands fa-instagram"
                                       style={{color: "purple", fontSize: "24px"}}/>
                                    <div>
                                        <h5 className=""> Instagram account</h5>
                                        <h6 className="cmn_headings">www.instagram.com</h6>
                                    </div>
                                </div>


                                <LoginSocialFacebook
                                    isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                    appId={`${import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}`}
                                    redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                    onResolve={(response) => {
                                        setInstagramDropDown(true)
                                        setFacebookDropDown(false)
                                        computeAndSocialAccountJSONForFacebook(response, SocialAccountProvider.INSTAGRAM).then((mediaAccount) => {
                                            mediaAccount === null || mediaAccount === undefined ? showErrorToast(NoInstagramBusinessAccountFound) : connectInstagramAccountToCustomer(mediaAccount)
                                        })
                                    }}
                                    onReject={(error) => {
                                    }}>

                                    <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                         icon={() => null} preventActiveStyles={true}
                                                         style={commonButtonStyle}/>
                                </LoginSocialFacebook>
                            </div> :

                            <div className=" cmn_drop_down dropdown">
                                <div className="dropdown_header">
                                    <div className="social_media_outer">
                                        <div className="social_media_content"
                                             onClick={() => setInstagramDropDown(!instagramDropDown)}>
                                            <i className="fa-brands fa-instagram insta-icon"/>
                                            {/*<img className="cmn_width " src={fb_img}/>*/}
                                            <div className="text-start flex-grow-1">
                                                <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'INSTAGRAM')?.name || "instagram"}</h5>
                                                <h4 className="connect_text cmn_text_style">Connected</h4>
                                            </div>
                                            {
                                                (!getAllFacebookPagesData?.loading || !getAllConnectedSocialAccountData?.loading || !connectedPagesData?.loading) && currentConnectedInstagramPages?.length === 0 &&
                                                <button className="DisConnectBtn cmn_connect_btn w-auto"
                                                        onClick={() => disConnectSocialMediaAccountToCustomer("INSTAGRAM")}>
                                                    Disconnect
                                                </button>
                                            }
                                            <div className={ instagramDropDown? "upside-down":""}>
                                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path id="Icon"
                                                          d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                          stroke="#5F6D7E" strokeWidth="1.67"
                                                          strokeLinecap="round"/>
                                                </svg>

                                            </div>

                                        </div>
                                    </div>

                                    {
                                        instagramDropDown === true &&

                                        <ul className="menu_items">

                                            {
                                                instagramBusinessAccountsData?.loading ?
                                                    <SkeletonEffect count={3}/> :

                                                    currentConnectedInstagramPages?.length === 0 ?
                                                        <div className={"no-page-connected-outer text-center"}>
                                                            <div>No active connections at the moment.</div>
                                                            <div className={"cursor-pointer connect-page-btn"}
                                                                 onClick={() => setShowInstagramModal(true)}
                                                            >Connect
                                                                now
                                                            </div>
                                                        </div> :
                                                        <>
                                                            {
                                                                currentConnectedInstagramPages?.map((data, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                            <div
                                                                                className="user_profileInfo_wrapper">
                                                                                <div className="user_Details">
                                                                                    <img
                                                                                        src={data.profile_picture_url || default_user_icon}
                                                                                        height="30px"
                                                                                        width="30px"/>
                                                                                    <h4 className="cmn_text_style">{data.name}</h4>
                                                                                </div>
                                                                                <h4 className={"connect_text cmn_text_style"}>Connected</h4>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                            <li>
                                                                {
                                                                    (instagramBusinessAccountsData?.data && Array.isArray(instagramBusinessAccountsData?.data)) &&
                                                                    <div className="connectDisconnect_btn_outer">
                                                                        <button
                                                                            className="DisConnectBtn cmn_connect_btn"
                                                                            onClick={() =>
                                                                                disConnectSocialMediaAccountToCustomer("INSTAGRAM")}
                                                                        >
                                                                            Disconnect
                                                                        </button>
                                                                        <button className="ConnectBtn cmn_connect_btn"
                                                                                onClick={() => setShowInstagramModal(true)}
                                                                        >
                                                                            Connect More
                                                                        </button>
                                                                    </div>

                                                                }
                                                            </li>


                                                        </>


                                            }
                                        </ul>}

                                </div>
                            </div>


                }

                {/* end instagram connect */}
            </div>
            {showFacebookModal &&
                <FacebookModal showFacebookModal={showFacebookModal} setShowFacebookModal={setShowFacebookModal}
                               facebookPageList={getAllFacebookPagesData?.facebookPageList}
                               connectedPagesList={connectedPagesData?.facebookConnectedPages} noPageFoundMessage={"No Page Found!"}
                               socialMediaType={SocialAccountProvider.FACEBOOK}
                               socialMediaAccountInfo={getAllConnectedSocialAccountData?.data?.filter(account => account.provider === "FACEBOOK")[0]}/>}
            {showInstagramModal &&
                <FacebookModal showFacebookModal={showInstagramModal} setShowFacebookModal={setShowInstagramModal}
                               facebookPageList={instagramBusinessAccountsData?.data}
                               connectedPagesList={connectedPagesData?.facebookConnectedPages} noPageFoundMessage={"No Page Found!"}
                               socialMediaType={SocialAccountProvider.INSTAGRAM}
                               socialMediaAccountInfo={getAllConnectedSocialAccountData?.data?.filter(account => account.provider === "INSTAGRAM")[0]}/>}
            {
                showAccountAlreadyConnectedWarningModal &&
                <AccountAlreadyConnectedWarningModal showModal={showAccountAlreadyConnectedWarningModal}
                                                     setShowModal={setShowAccountAlreadyConnectedWarningModal}></AccountAlreadyConnectedWarningModal>
            }

        </div>

    );
}
export default SocialAccounts;