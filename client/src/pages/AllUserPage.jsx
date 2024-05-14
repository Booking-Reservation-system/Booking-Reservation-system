import axios from "axios";
import DataTable from "react-data-table-component";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ROUTES from "../constants/routes.js";
import toast from "react-hot-toast";
import storeToken from "../hooks/storeToken.js";
import useLoginModal from "../hooks/useLoginModal.js";
import useAuth from "../hooks/useAuth.js";
// import { useAuth } from "../hooks/useAuth";


const AllUserPage = () => {
    const [records, setRecords] = useState([]);
    const {authToken} = useAuth();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const {role} = storeToken();
    const loginModal = useLoginModal();

    const customStyles = {
        header: {
            style: {
                fontWeight: 'bold',
            },
        },
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            // sort by alphabet
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'role',
            selector: row => row.role,
            sortable: true
        },
        {
            name: 'Provider',
            selector: row => row.provider ? row.provider : "local",
        },
        {
            name: 'View',
            cell: row => <button
                onClick={() => navigate(`/view/${row.id}`)}
                className="font-bold border-2 border-gray-500 px-2 py-1 mr-2"
            >
                View
            </button>
        },
        {
            name: 'Edit',
            cell: row => <button
                onClick={() => navigate(`/edit/${row.id}`)}
                className="font-bold border-2 border-gray-500 px-2 py-1 mr-2 "
            >
                Edit
            </button>
        },
        {
            name: 'Delete',
            cell: row => <button
                onClick={() => navigate(`/delete/${row.id}`)}
                className="font-bold border-2 border-gray-500 px-2 py-1"
            >
                Delete
            </button>
        }
    ]

    const fetchData = async (query) => {
        try {
            let url = "http://localhost:8080/api/admin/users";
            if (query) {
                url += `?name=${query}`
            }
            const response = await axios.get(url, {
                headers: {
                    Authorization: "Bearer " + authToken,
                },
                withCredentials: true,
            });
            console.log(response.data);
            setRecords(response.data.users);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };


    useEffect(() => {
        if (!isAuthenticated && role !== "admin") {
            navigate(ROUTES.HOME);
            toast.error("Please login to view your trips");
            loginModal.onOpen();
            return;
        }
        fetchData();
    }, []);

    function handleFilter(e) {
        const value = e.target.value.toLowerCase();
        fetchData(value);
    }

    return (
        <div className="pt-[120px] px-20 bg-gray-100 min-h-screen">
            <h1 className="text-4xl text-indigo-500 mb-8 text-center bg-indigo-200 p-4 rounded-lg shadow-lg">User
                Information</h1>
            <div className="bg-white shadow-md rounded-lg p-8">
                <input
                    type="text"
                    placeholder="Search by name"
                    onChange={handleFilter}
                    className="border border-gray-300 p-2 rounded-md mb-4 w-full"
                />
                <DataTable
                    columns={columns}
                    data={records}
                    customStyles={customStyles}
                    selectableRows
                    fixedHeader
                    pagination
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default AllUserPage;