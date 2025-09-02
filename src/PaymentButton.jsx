import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PaymentButton({ amount }) {
  return (
    <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "pill" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              { amount: { value: amount.toString() } }
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          alert(`Payment successful! Thank you, ${details.payer.name.given_name}.`);
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PaymentButton;
