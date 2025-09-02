import { useState } from "react";
import PaymentButton from "./PaymentButton";

function CommissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    requestDetails: "",
    price: 20, // base commission price
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Commission request:", formData);
    // Later: Send form data to your backend or email service
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Commission Request</h2>

      <label>Your Name</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <label>Email</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />

      <label>Describe Your Commission</label>
      <textarea
        name="requestDetails"
        value={formData.requestDetails}
        onChange={handleChange}
        rows="5"
        required
      />

      <label>Price (USD)</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        min="5"
        required
      />

      {/* PayPal button */}
      <PaymentButton amount={formData.price} />
    </form>
  );
}

export default CommissionForm;
