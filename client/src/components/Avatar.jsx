const Avatar = () => {

    const avatar = localStorage.getItem('authImage')
    
    return (
        <img className="rounded-full" height={30} width={30} alt="Avatar" src={avatar ? avatar : "/placeholder.jpg"} ></img>
    )
}

export default Avatar