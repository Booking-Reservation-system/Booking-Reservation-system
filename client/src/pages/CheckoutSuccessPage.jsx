
const CheckoutSuccessPage = () => {

    return (
        <Container className="min-h-[80vh] max-w-[800px] w-full m-auto flex flex-col items-center justify-center">
            <h2 className="mb-2 text-[#029e02]">Checkout Successful</h2>
            <p>Your order might take some time to process.</p>
            <p>Check your order status at your profile after about 10mins.</p>
            <p>
                Incase of any inqueries contact the support at{" "}
                <strong>support@onlineshop.com</strong>
            </p>
        </Container>
    );
};

export default CheckoutSuccessPage;

