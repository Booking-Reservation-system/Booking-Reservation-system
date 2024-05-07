import {AiOutlineMenu} from 'react-icons/ai';
import Avatar from '../Avatar';
import {useState, useCallback} from 'react';
import MenuItem from './MenuItem';
import {useNavigate} from 'react-router-dom';
import useRegisterModal from '../../hooks/useRegisterModal';
import useLoginModal from '../../hooks/useLoginModal';
import useRentModal from '../../hooks/useRentModal';
import useTokenStore from '../../hooks/storeToken';
import useStoreGoogleToken from '../../hooks/useStoreGoogleToken';
import ROUTES from '../../constants/routes';

const UserMenu = (props) => {
    const navigate = useNavigate()

    const {
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        expiresAt,
        setExpires,
        name,
        setName,
        setAuth,
    } = useTokenStore()

    let currentUser = false
    if (accessToken) {
        currentUser = true
    }

    const logoutHandler = () => {
        setAccessToken(null)
        setRefreshToken(null)
        setExpires(null)
        setName(null)
        setAuth(false)

        navigate(ROUTES.HOME)
    }

    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const rentModal = useRentModal()
    const [isOpen, setIsOpen] = useState(false)
    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        // open rent modal
        rentModal.onOpen()
    }, [currentUser, loginModal, rentModal])

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={onRent}
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                >
                    Add your home
                </div>
                <div
                    onClick={toggleOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                >
                    <AiOutlineMenu/>
                    <div className='hidden md:block'>
                        <Avatar/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
                    <div className='flex flex-col cursor-pointer'>
                        {currentUser ? (
                            <>
                                <MenuItem label="My trips" onClick={() => navigate(ROUTES.TRIPS)}/>
                                <MenuItem label="My favorites" onClick={() => navigate(ROUTES.FAVOURITES)}/>
                                <MenuItem label="My properties" onClick={() => navigate(ROUTES.PROPERTIES)}/>
                                <MenuItem label="Add your home" onClick={rentModal.onOpen}/>
                                <hr/>
                                <MenuItem label="Logout" onClick={logoutHandler}/>
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={loginModal.onOpen} label="Login"/>
                                <MenuItem onClick={registerModal.onOpen} label="Sign up"/>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
