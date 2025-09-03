import { useState } from "react";
import PaymentButton from "./PaymentButton";

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
    references: [], // general references
    characterReferences: [], // specific character refs
    characterLink: "", // WoWHead Dressing Room link
    price: 20, // base commission price
  });

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

    console.log("Commission request:", formData);
    // Send data to backend/email service
  }

  return (
    <form onSubmit={handleSubmit} className="commission-form">
      <h2>Commission Request</h2>

      {/* Commission Details */}
      <label>
        Describe Your Commission
        <p className="form-help-text">
          The more detail + references you can give me, (add you references below) the more accurate I am able to be with your artwork. 
          Otherwise I will creatively interpret what I feel is best.
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
          What will this artwork be used for? Please include sizing information if you know it. 
          If you’re unsure, don’t worry—I can help! Just share your intended use, and I’ll be in touch. 
          For computer-related projects (wallpapers, Twitch graphics, etc.), please include your screen resolution 
          and any other technical details I should know.
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
          How many characters, figures, or models would you like included in your commission?
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
          Please describe who or what the subjects are. This could include names, roles, personalities,
          or any specific traits you’d like me to capture.
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
          Please provide details on the pose(s) and expressions you’d like. 
          If you’re unsure, you can leave this blank and I’ll use creative judgment.
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
          Please provide details on the setting you’d like. Is this daytime, nighttime, sunset, 
          or something else? Where is this in-game? Are there weather conditions? 
          If you’d like a specific place, please provide screenshots, details, and a map location pin 
          in the upload reference field below.
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
          Please create your character(s) in{" "}
          <a 
            href="https://www.wowhead.com/dressing-room#fs8zz0zJ89c8zU8Tp8zS8TR8zW8TK8zX8T48st8zD28d38MFY8zYe8dLg8Mtd808zY8js8d58MHb8d28MFS8rz8MHg8rs8MJB877hvXY87cvXQ87VvYh808vXU808vXZ808vYa808vYk87q"
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link"
          >
            WoWHead’s Dressing Room
          </a>{" "}
          and send me the link below. Additionally, please upload in-game screenshots of your character(s), 
          pets, or mounts (if applicable). The more references you provide, the more accurate the artwork will be.
        </p>
      </label>
      <input
        type="url"
        name="characterLink"
        value={formData.characterLink}
        onChange={handleChange}
        placeholder="Paste your WoWHead dressing room link here"
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

      {/* Contact info */}
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

      {/* Disclaimer */}
      <div className="form-disclaimer">
       <p>
    Please note that I am a 3D artist, not a traditional drawing artist. Each model, pose, and scene is handcrafted, which takes time. 
    I appreciate your patience and understanding throughout the process. I make it a priority to communicate regularly and keep you updated on your commission.
      </p>
    </div>
    </form>
  );
}

export default CommissionForm;
