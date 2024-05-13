import axios from "axios";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";


const AllUserPage = () => {
    // const { authToken } = useAuth();
    const navigate = useNavigate();

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
            sortable: true
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
            name: 'Edit',
            cell: row =>   <button 
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

    const data = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@gmail.com',
            role: 'user'
        },
        {
            id: 2,
            name: 'Jane Doe',
            email: 'jane@gmail.com',
            role: 'user'
        },
        {
            id: 3,
            name: 'Admin Doe',
            email: 'admin@gmail.com',
            role: 'admin'
        }
    ]

    const [records, setRecords] = useState(data);

    function handleFilter(e) {
        const value = e.target.value.toLowerCase();
        const filteredData = data.filter(user => {
            return user.name.toLowerCase().includes(value) 
        });
        setRecords(filteredData);
    }

    return (
        <div className="pt-[120px] px-20 bg-gray-100 min-h-screen">
            <h1 className="text-4xl text-indigo-500 mb-8 text-center bg-indigo-200 p-4 rounded-lg shadow-lg">User Information</h1>          
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