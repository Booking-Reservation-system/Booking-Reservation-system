// import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import NavBar from "./components/navbar/NavBar";
import Modal from "./components/modals/Modal";

// const BrowserRouter = createBrowserRouter({
//
// });

function App() {
    return (
        <>
            <Modal
                title="Hello World"
                isOpen={true}
            />
            <NavBar />
            <div className="text-rose-500 text-2xl">
            </div>
        </>
    );
}

export default App;
