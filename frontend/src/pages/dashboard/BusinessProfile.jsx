import { useState, useEffect } from "react";
import API from "../../services/api";

export default function BusinessProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    gst: "",
    tax: 18,
  });

  const [logo, setLogo] = useState(null);
  const [stamp, setStamp] = useState(null);
  const [sign, setSign] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [stampFile, setStampFile] = useState(null);
  const [signFile, setSignFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load existing data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/business/profile");
      if (res.data) {
        setForm(res.data);
        if (res.data.logo) setLogo(res.data.logo);
        if (res.data.stamp) setStamp(res.data.stamp);
        if (res.data.sign) setSign(res.data.sign);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please upload only image files");
      return;
    }

    const url = URL.createObjectURL(file);

    if (type === "logo") {
      setLogo(url);
      setLogoFile(file);
    } else if (type === "stamp") {
      setStamp(url);
      setStampFile(file);
    } else if (type === "sign") {
      setSign(url);
      setSignFile(file);
    }
  };

  const removeImage = (type) => {
    if (type === "logo") {
      setLogo(null);
      setLogoFile(null);
    } else if (type === "stamp") {
      setStamp(null);
      setStampFile(null);
    } else if (type === "sign") {
      setSign(null);
      setSignFile(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Business name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (form.tax < 0 || form.tax > 100) {
      newErrors.tax = "Tax should be between 0-100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert("Please fix the errors before saving");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (logoFile) formData.append("logo", logoFile);
      if (stampFile) formData.append("stamp", stampFile);
      if (signFile) formData.append("sign", signFile);

      await API.post("/business/profile", formData);

      alert("Profile saved successfully! ✅");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to save profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            🏢 Business Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure your company details, branding assets and invoice defaults
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium shadow-lg transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105"
          }`}
        >
          {loading ? "💾 Saving..." : "💾 Save Changes"}
        </button>
      </div>

      {/* BUSINESS INFO */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md space-y-4">
        <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          📘 Business Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              placeholder="Your Business Name"
              onChange={handleChange}
              className={`border-2 p-3 rounded-lg w-full focus:outline-none transition-all ${
                errors.name ? "border-red-300" : "border-gray-200 focus:border-blue-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="business@example.com"
              onChange={handleChange}
              className={`border-2 p-3 rounded-lg w-full focus:outline-none transition-all ${
                errors.email ? "border-red-300" : "border-gray-200 focus:border-blue-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Address
          </label>
          <textarea
            name="address"
            value={form.address}
            placeholder="Complete Business Address"
            onChange={handleChange}
            rows="3"
            className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-blue-400 focus:outline-none resize-none transition-all"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              placeholder="+91 98765 43210"
              onChange={handleChange}
              className={`border-2 p-3 rounded-lg w-full focus:outline-none transition-all ${
                errors.phone ? "border-red-300" : "border-gray-200 focus:border-blue-400"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.phone}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              GST Number
            </label>
            <input
              name="gst"
              value={form.gst}
              placeholder="GST Number (Optional)"
              onChange={handleChange}
              className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-blue-400 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* BRANDING & TAX */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* LOGO */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md space-y-4">
          <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            🎨 Company Logo
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
            {logo ? (
              <div className="space-y-3">
                <img src={logo} alt="Logo" className="h-24 mx-auto object-contain" />
                <button
                  onClick={() => removeImage("logo")}
                  className="text-red-500 text-sm font-medium hover:text-red-700"
                >
                  🗑️ Remove Logo
                </button>
              </div>
            ) : (
              <div>
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm mb-3">Upload Company Logo</p>
              </div>
            )}

            <label className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer transition-all">
              📤 {logo ? "Change" : "Upload"} Logo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e, "logo")}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">Max 2MB • JPG, PNG, GIF</p>
          </div>
        </div>

        {/* TAX */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 shadow-md space-y-4">
          <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            💰 Default Tax Settings
          </h2>

          <div className="bg-white p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Tax Percentage (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                name="tax"
                type="number"
                value={form.tax}
                onChange={handleChange}
                min="0"
                max="100"
                className={`border-2 p-3 rounded-lg w-24 text-center font-bold text-lg focus:outline-none ${
                  errors.tax ? "border-red-300" : "border-gray-200 focus:border-blue-400"
                }`}
              />
              <span className="text-2xl font-bold text-gray-600">%</span>
            </div>
            {errors.tax && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.tax}</p>
            )}
          </div>

          <div className="bg-blue-100 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Note:</strong> This tax rate will be automatically applied to all new invoices
            </p>
          </div>
        </div>

      </div>

      {/* DIGITAL ASSETS */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md space-y-4">
        <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          🧾 Digital Assets
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* STAMP */}
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Digital Stamp</p>

            {stamp ? (
              <div className="space-y-3">
                <img src={stamp} alt="Stamp" className="h-20 mx-auto object-contain" />
                <button
                  onClick={() => removeImage("stamp")}
                  className="text-red-500 text-sm font-medium hover:text-red-700"
                >
                  🗑️ Remove Stamp
                </button>
              </div>
            ) : (
              <div className="py-4">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🖊️</span>
                </div>
                <p className="text-gray-400 text-sm">No stamp uploaded</p>
              </div>
            )}

            <label className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-all mt-3 text-sm">
              📤 {stamp ? "Change" : "Upload"} Stamp
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e, "stamp")}
                className="hidden"
              />
            </label>
          </div>

          {/* SIGNATURE */}
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Digital Signature</p>

            {sign ? (
              <div className="space-y-3">
                <img src={sign} alt="Signature" className="h-16 mx-auto object-contain" />
                <button
                  onClick={() => removeImage("sign")}
                  className="text-red-500 text-sm font-medium hover:text-red-700"
                >
                  🗑️ Remove Signature
                </button>
              </div>
            ) : (
              <div className="py-4">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">✍️</span>
                </div>
                <p className="text-gray-400 text-sm">No signature uploaded</p>
              </div>
            )}

            <label className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-all mt-3 text-sm">
              📤 {sign ? "Change" : "Upload"} Signature
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e, "sign")}
                className="hidden"
              />
            </label>
          </div>

        </div>
      </div>

    </div>
  );
}
