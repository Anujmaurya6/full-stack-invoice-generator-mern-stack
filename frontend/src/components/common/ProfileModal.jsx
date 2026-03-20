import { useState, useEffect } from "react"

export default function ProfileModal({ user = {}, onClose, onSave }) {

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  })

  const [avatar, setAvatar] = useState(user?.avatar || null)
  const [logo, setLogo] = useState(user?.logo || null)
  const [signature, setSignature] = useState(user?.signature || null)

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ type: "", text: "" })
  const [isDirty, setIsDirty] = useState(false)

  const plan = user?.plan || "FREE"

  // Track if form has changes
  useEffect(() => {
    const hasChanges = 
      form.name !== (user?.name || "") ||
      form.email !== (user?.email || "") ||
      form.phone !== (user?.phone || "") ||
      form.address !== (user?.address || "") ||
      avatar !== (user?.avatar || null) ||
      logo !== (user?.logo || null) ||
      signature !== (user?.signature || null)
    
    setIsDirty(hasChanges)
  }, [form, avatar, logo, signature, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleImage = (e, type) => {
    const file = e.target.files[0]

    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ 
        type: "error", 
        text: "File size should be less than 5MB" 
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ 
        type: "error", 
        text: "Please upload only image files" 
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      return
    }

    const url = URL.createObjectURL(file)

    if (type === "avatar") setAvatar(url)
    if (type === "logo") setLogo(url)
    if (type === "signature") setSignature(url)

    setMessage({ 
      type: "success", 
      text: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully` 
    })
    setTimeout(() => setMessage({ type: "", text: "" }), 2000)
  }

  const removeImage = (type) => {
    if (type === "avatar") setAvatar(null)
    if (type === "logo") setLogo(null)
    if (type === "signature") setSignature(null)

    setMessage({ 
      type: "success", 
      text: `${type.charAt(0).toUpperCase() + type.slice(1)} removed` 
    })
    setTimeout(() => setMessage({ type: "", text: "" }), 2000)
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email"
    }

    // Phone validation (optional but if provided, should be valid)
    if (form.phone && !/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    // Validate form
    if (!validateForm()) {
      setMessage({ 
        type: "error", 
        text: "Please fix the errors before saving" 
      })
      return
    }

    const updatedUser = {
      ...user,
      ...form,
      avatar,
      logo,
      signature,
      lastUpdated: new Date().toISOString()
    }

    // Call parent's onSave function
    if (onSave) {
      onSave(updatedUser)
    }

    setMessage({ 
      type: "success", 
      text: "Profile saved successfully! ✅" 
    })

    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all changes?")) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || ""
      })
      setAvatar(user?.avatar || null)
      setLogo(user?.logo || null)
      setSignature(user?.signature || null)
      setErrors({})
      setMessage({ 
        type: "success", 
        text: "Form reset to original values" 
      })
      setTimeout(() => setMessage({ type: "", text: "" }), 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Edit Profile
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your personal information
              </p>
            </div>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
              {plan} PLAN
            </span>
          </div>

          {/* Status Message */}
          {message.text && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">

          {/* PROFILE PHOTO */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Profile Photo
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-indigo-500 overflow-hidden shadow-lg">
                  {avatar ? (
                    <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-100 to-purple-100">
                      <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2">
                  <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-all shadow-md hover:shadow-lg">
                    📸 Upload Photo
                    <input hidden type="file" accept="image/*" onChange={(e) => handleImage(e, "avatar")} />
                  </label>

                  {avatar && (
                    <button
                      onClick={() => removeImage("avatar")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Max 5MB • JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>

          {/* BUSINESS LOGO & SIGNATURE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Business Logo */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Business Logo
              </label>

              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-center">
                  {logo ? (
                    <img src={logo} className="w-24 h-24 rounded-lg border-2 border-gray-200 object-contain shadow-md" alt="Logo" />
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <label className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg cursor-pointer transition-all">
                    Upload
                    <input hidden type="file" accept="image/*" onChange={(e) => handleImage(e, "logo")} />
                  </label>

                  {logo && (
                    <button
                      onClick={() => removeImage("logo")}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Signature
              </label>

              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-center">
                  {signature ? (
                    <img src={signature} className="h-16 max-w-full border-2 border-gray-200 rounded-lg object-contain shadow-md" alt="Signature" />
                  ) : (
                    <div className="h-16 px-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                      <span className="text-gray-400 text-sm">✍️ Sign</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <label className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-2 rounded-lg cursor-pointer transition-all">
                    Upload
                    <input hidden type="file" accept="image/*" onChange={(e) => handleImage(e, "signature")} />
                  </label>

                  {signature && (
                    <button
                      onClick={() => removeImage("signature")}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* FORM FIELDS */}
          <div className="space-y-4">

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border-2 p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? "border-red-300 focus:ring-red-200" 
                    : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border-2 p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? "border-red-300 focus:ring-red-200" 
                    : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Phone
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className={`w-full border-2 p-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.phone 
                    ? "border-red-300 focus:ring-red-200" 
                    : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                }`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-none"
                placeholder="Enter your complete address"
              />
            </div>

          </div>

        </div>

        {/* Sticky Footer with Actions */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white to-gray-50 border-t p-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            
            <button
              onClick={handleReset}
              disabled={!isDirty}
              className={`px-5 py-2.5 border-2 rounded-lg font-medium transition-all ${
                isDirty
                  ? "border-orange-300 text-orange-600 hover:bg-orange-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              🔄 Reset Changes
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={!isDirty}
                className={`px-8 py-2.5 rounded-lg font-medium transition-all shadow-lg ${
                  isDirty
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >

              
                💾 Save Profile
              </button>
            </div>

          </div>

          {isDirty && (
            <p className="text-xs text-center text-gray-500 mt-3">
              ⚡ You have unsaved changes
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
