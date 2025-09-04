import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import priceList from "./assets/ellieform.png";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase";

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
    characterLinks: [""], // start with one empty link field
  });

  const [referencePreviews, setReferencePreviews] = useState([]);
  const [characterPreviews, setCharacterPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const referencesInputRef = useRef(null);
  const characterInputRef = useRef(null);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "references") {
      const newFiles = Array.from(files);
      const updatedFiles = [...formData.references, ...newFiles];
      setFormData({ ...formData, references: updatedFiles });
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setReferencePreviews([...referencePreviews, ...newPreviews]);
    } else if (name === "characterReferences") {
      const newFiles = Array.from(files);
      const updatedFiles = [...formData.characterReferences, ...newFiles];
      setFormData({ ...formData, characterReferences: updatedFiles });
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setCharacterPreviews([...characterPreviews, ...newPreviews]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleLinkChange(index, value) {
    const newLinks = [...formData.characterLinks];
    newLinks[index] = value;
    setFormData({ ...formData, characterLinks: newLinks });
  }

  function addLinkField() {
    setFormData({ ...formData, characterLinks: [...formData.characterLinks, ""] });
  }

  function removeLinkField(index) {
    const newLinks = [...formData.characterLinks];
    newLinks.splice(index, 1);
    setFormData({ ...formData, characterLinks: newLinks });
  }

  function removeReference(index) {
    const updatedFiles = [...formData.references];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, references: updatedFiles });
    const updatedPreviews = [...referencePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setReferencePreviews(updatedPreviews);
  }

  function removeCharacterReference(index) {
    const updatedFiles = [...formData.characterReferences];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, characterReferences: updatedFiles });
    const updatedPreviews = [...characterPreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setCharacterPreviews(updatedPreviews);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email && !formData.twitter && !formData.discord) {
      alert("Please provide at least one contact method: Email, Twitter, or Discord.");
      return;
    }

    setIsSubmitting(true);

    try {
      const referenceUrls = await Promise.all(
        formData.references.map(async (file) => {
          const storageRef = ref(storage, `references/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      const characterUrls = await Promise.all(
        formData.characterReferences.map(async (file) => {
          const storageRef = ref(storage, `characterReferences/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const characterLinks = formData.characterLinks
        .filter(link => link.trim() !== "")
        .join("\n");

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
        characterLink: characterLinks,
        referenceFiles: referenceUrls.join("\n"),
        characterFiles: characterUrls.join("\n"),
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setFormData({
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
        characterLinks: [""],
      });
      setReferencePreviews([]);
      setCharacterPreviews([]);
      if (referencesInputRef.current) referencesInputRef.current.value = "";
      if (characterInputRef.current) characterInputRef.current.value = "";

      setIsSubmitting(false);
      setStatusMessage("Your commission request has been sent successfully!");
    } catch (error) {
      console.error("Error submitting commission:", error);
      setStatusMessage("There was an error sending your request. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="commission-form">
      <h2>Commission Request</h2>

      <label>
        Describe Your Commission
        <p className="form-help-text">
          The more detail + references you can give me, (add your references below) the more accurate I am able to be with your artwork. Otherwise I will creatively interpret what I feel is best.
        </p>
      </label>
      <textarea name="requestDetails" value={formData.requestDetails} onChange={handleChange} rows="5" required />

      <label>
        Intended Use
        <p className="form-help-text">
          What will this artwork be used for? Please include sizing information if you know it. If unsure, I can help. For computer-related projects, please include screen resolution or other technical details.
        </p>
      </label>
      <textarea name="intendedUse" value={formData.intendedUse} onChange={handleChange} rows="4" />

      <label>
        Number of Subjects/Models
        <p className="form-help-text">
          How many characters, figures, or models would you like included?
        </p>
      </label>
      <input type="number" name="subjectCount" value={formData.subjectCount} onChange={handleChange} min="1" required />

      <label>
        Subject Details
        <p className="form-help-text">
          Describe the subjects: names, roles, personalities, are they mounts, pets, etc. Or traits to capture.
        </p>
      </label>
      <textarea name="subjectDetails" value={formData.subjectDetails} onChange={handleChange} rows="3" />

      <label>
        Pose & Expression
        <p className="form-help-text">
          Provide details on pose(s) and expressions. Leave blank if unsure.
        </p>
      </label>
      <textarea name="poseExpression" value={formData.poseExpression} onChange={handleChange} rows="3" />

      <label>
        Setting & Atmosphere
        <p className="form-help-text">
          Provide details on setting: time of day, location, weather, etc. Screenshots can be uploaded below.
        </p>
      </label>
      <textarea name="settingAtmosphere" value={formData.settingAtmosphere} onChange={handleChange} rows="4" />

      <label>
        References (Upload Images)
        <p className="form-help-text">
          You can upload multiple images. Previewed images can be removed before submitting.
        </p>
      </label>
      <input type="file" name="references" multiple accept="image/*" onChange={handleChange} ref={referencesInputRef} />
      <div className="image-previews">
        {referencePreviews.map((src, index) => (
          <div key={index} className="preview-container">
            <img src={src} alt={`preview-${index}`} className="preview-image" />
            <button type="button" className="remove-button" onClick={() => removeReference(index)}>×</button>
          </div>
        ))}
      </div>

      <label>
        Character References
        <p className="form-help-text">
          Create your character(s) in <a href="https://www.wowhead.com/dressing-room" target="_blank" rel="noopener noreferrer" className="external-link">WoWHead’s Dressing Room</a> and add your links below. Upload in-game screenshots if available.
        </p>
      </label>

      {formData.characterLinks.map((link, index) => (
        <div key={index} className="character-link-field">
          <input
            type="url"
            value={link}
            onChange={(e) => handleLinkChange(index, e.target.value)}
            placeholder="Paste WoWHead dressing room link"
            required
          />
          <button type="button" onClick={() => removeLinkField(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addLinkField}>Add Link</button>

      <input type="file" name="characterReferences" multiple accept="image/*" onChange={handleChange} ref={characterInputRef} />
      <div className="image-previews">
        {characterPreviews.map((src, index) => (
          <div key={index} className="preview-container">
            <img src={src} alt={`character-preview-${index}`} className="preview-image" />
            <button type="button" className="remove-button" onClick={() => removeCharacterReference(index)}>×</button>
          </div>
        ))}
      </div>

      <label>Your Name</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <fieldset className="contact-info">
        <legend>Contact Information (at least one required)</legend>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="youremail@email.com" />
        <label>Twitter</label>
        <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="@yourhandle" />
        <label>Discord</label>
        <input type="text" name="discord" value={formData.discord} onChange={handleChange} placeholder="username" />
      </fieldset>

      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? "Submitting..." : "Submit Commission Request"}
      </button>

      <div className="form-disclaimer">
        <p>
          Please note that I am a 3D artist, not a traditional drawing artist. Each model, pose, and scene is handcrafted, which takes time. I appreciate your patience and understanding. I communicate regularly to keep you updated on your commission.
        </p>
        <p>
          Please reference the price list below. I will confirm the full price with you before starting the project. I will reach out via the selected platform and contact information you provided. For example, if you choose Twitter or Discord, messaging must be turned on and easily accessible for smooth communication. Accounts without easily accessible messaging cannot be contacted, so please keep this in mind. If this may be a problem, you can reach me at <a href="https://x.com/crimson_vial" target="_blank" rel="noopener noreferrer">My Twitter</a>.
        </p>
      </div>

      {statusMessage && <p className="submission-success">{statusMessage}</p>}

      <div className="price-list-container">
        <img src={priceList} alt="Commission Price List" className="price-list-image" />
      </div>
      <div className="watermark">Created by @Sylvariae</div>
    </form>
  );
}

export default CommissionForm;
