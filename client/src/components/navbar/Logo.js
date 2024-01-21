const Logo = () => {
    return (
        <div>
            <img
                alt="Logo"
                className="hidden md:block cursor-pointer"
                height="100"
                width="100"
                src={process.env.PUBLIC_URL + "/images/logo.png"}
            />
        </div>
    )
};

export default Logo;