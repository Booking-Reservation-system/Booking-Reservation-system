import { BiSearch } from "react-icons/bi";
const Search = () => {
    return (
        <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-sm transition cursor-pointer">
           <div className="flex flex-row items-center justify-between">
                <div className="text-xl font-semibold px-6">Anywhere</div>
                <div className="hidden sm:block text-xl font-semibold px-6 border-x-[1px] flex-1 text-center">Any Week</div>
                <div className="text-xl text-gray-600 pl-6 pr-2 flex flex-row items-center gap-3">
                    <div className="hidden sm:block">Add Guests</div>
                    <div className="text-white bg-rose-500 rounded-full p-2">
                        <BiSearch size={18}/>
                    </div>
                </div>
           </div>
        </div>
    )
}

export default Search;