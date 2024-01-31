const CategoryBox = (props) => {
    const { label, select, icon: Icon } = props;
    return (
        <div 
            className={`
            flex 
            flex-col 
            items-center 
            justify-center 
            gap-2 
            p-3 
            border-b-2 
            hover:text-neutral-800 
            transition 
            cursor-pointer
            ${select ? 'border-b-neutral-800' : 'border-transparent'}
            ${select ? 'text-neutral-800' : 'text-neutral-500'}  
        `}>
            <Icon size={30} />
            <p className="text-md font-medium">{label}</p>
        </div>
    )
}

export default CategoryBox;