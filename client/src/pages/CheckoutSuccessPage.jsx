import ROUTES from "../constants/routes.js";
import {useNavigate} from "react-router-dom";
import Button from "../components/button/Button.jsx";

const CheckoutSuccessPage = () => {
    const navigate = useNavigate();
    const backToHome = () => {
        navigate(ROUTES.HOME);
    }

    return (
        <div className="pt-44 min-h-[80vh] max-w-[800px] w-full m-auto flex flex-col items-center justify-center">
            <h2 className="text-[#029e02] text-6xl font-black">Checkout Successful</h2>
            <div className="my-12 text-center">
                <p>Your order might take some time to process.</p>
                <p>Check your order status at your profile after about 10mins.</p>
                <p>
                    Incase of any inqueries contact the support at{" "}
                    <strong>support@onlineshop.com</strong>
                </p>
            </div>
            <div>
                <Button onClick={() => backToHome()} label="Go to Home"/>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;

