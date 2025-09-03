import { useState } from "react";
import PaymentButton from "./PaymentButton";
import emailjs from "@emailjs/browser";

function CommissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    twitter: "",
    discord: "",
    requestDetails: "",
    intendedUse: "",
    subjectCount: 1,
    subjectDetails: "",
    poseExpression: "",
    settingAtmosphere: "",
    references: [],
    characterReferences: [],
    characterLink: "",
    price: 20, // base commission price
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "references" || name === "characterReferences") {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email && !formData.twitter && !formData.discord) {
      alert("Please provide at least one contact method: Email, Twitter, or Discord.");
      return;
    }

    setIsSubmitting(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const templateParams = {
      name: formData.name,
      email: formData.email,
      twitter: formData.twitter,
      discord: formData.discord,
      requestDetails: formData.requestDetails,
      intendedUse: formData.intendedUse,
      subjectCount: formData.subjectCount,
      subjectDetails: formData.subjectDetails,
      poseExpression: formData.poseExpression,
      settingAtmosphere: formData.settingAtmosphere,
      characterLink: formData.characterLink,
      price: formData.price,
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent!", response.status, response.text);
        setStatusMessage("Your commission request has been sent successfully!");
        setSubmitted(true);
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
        setStatusMessage("There was an error sending your request. Please try again.");
        setIsSubmitting(false);
      });
  }

  return (
    <form onSubmit={handleSubmit} className="commission-form">
      <h2>Commission Request</h2>

      {/* Commission Details */}
      <label>
        Describe Your Commission
        <p className="form-help-text">
          The more detail + references you can give me, (add your references below) the more accurate I am able to be with your artwork. Otherwise I will creatively interpret what I feel is best.
        </p>
      </label>
      <textarea
        name="requestDetails"
        value={formData.requestDetails}
        onChange={handleChange}
        rows="5"
        required
      />

      {/* Intended Use */}
      <label>
        Intended Use
        <p className="form-help-text">
          What will this artwork be used for? Please include sizing information if you know it. If unsure, I can help. For computer-related projects, please include screen resolution or other technical details.
        </p>
      </label>
      <textarea
        name="intendedUse"
        value={formData.intendedUse}
        onChange={handleChange}
        rows="4"
      />

      {/* Number of Subjects */}
      <label>
        Number of Subjects/Models
        <p className="form-help-text">
          How many characters, figures, or models would you like included?
        </p>
      </label>
      <input
        type="number"
        name="subjectCount"
        value={formData.subjectCount}
        onChange={handleChange}
        min="1"
        required
      />

      {/* Subject Details */}
      <label>
        Subject Details
        <p className="form-help-text">
          Describe the subjects: names, roles, personalities, or traits to capture.
        </p>
      </label>
      <textarea
        name="subjectDetails"
        value={formData.subjectDetails}
        onChange={handleChange}
        rows="3"
      />

      {/* Pose & Expression */}
      <label>
        Pose & Expression
        <p className="form-help-text">
          Provide details on pose(s) and expressions. Leave blank if unsure.
        </p>
      </label>
      <textarea
        name="poseExpression"
        value={formData.poseExpression}
        onChange={handleChange}
        rows="3"
      />

      {/* Setting & Atmosphere */}
      <label>
        Setting & Atmosphere
        <p className="form-help-text">
          Provide details on setting: time of day, location, weather, screenshots, etc.
        </p>
      </label>
      <textarea
        name="settingAtmosphere"
        value={formData.settingAtmosphere}
        onChange={handleChange}
        rows="4"
      />

      {/* Character References */}
      <label>
        Character References
        <p className="form-help-text">
          Create your character(s) in{" "}
          <a 
            href="https://www.wowhead.com/dressing-room"
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link"
          >
            WoWHead’s Dressing Room
          </a>{" "}
          and send the link below. Upload in-game screenshots if available.
        </p>
      </label>
      <input
        type="url"
        name="characterLink"
        value={formData.characterLink}
        onChange={handleChange}
        placeholder="Paste WoWHead dressing room link here"
      />
      <input
        type="file"
        name="characterReferences"
        multiple
        accept="image/*"
        onChange={handleChange}
      />

      {/* Name */}
      <label>Your Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* Contact Info */}
      <fieldset className="contact-info">
        <legend>Contact Information (at least one required)</legend>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label>Twitter</label>
        <input
          type="text"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          placeholder="@yourhandle"
        />
        <label>Discord</label>
        <input
          type="text"
          name="discord"
          value={formData.discord}
          onChange={handleChange}
          placeholder="username#1234"
        />
      </fieldset>

      {/* Payment */}
      <PaymentButton amount={formData.price} />

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? "Submitting..." : "Submit Commission Request"}
      </button>

      {/* Disclaimer */}
      <div className="form-disclaimer">
        <p>
          Please note that I am a 3D artist, not a traditional drawing artist. Each model, pose, and scene is handcrafted, which takes time. I appreciate your patience and understanding. I communicate regularly to keep you updated on your commission.
        </p>
      </div>

      {/* Status Message */}
      {statusMessage && <p className="submission-success">{statusMessage}</p>}
    </form>
  );
}

export default CommissionForm;
