// components/ContactSection.jsx
"use client";

import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all fields");
      return;
    }
    // Simulate form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    // <div className="max-w-6xl mx-auto px-4">
    //   <div className="border border-slate-800 rounded-3xl bg-slate-900/40 p-6 sm:p-8 relative overflow-hidden">
    //     {/* Gradient accent */}
    //     <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent pointer-events-none" />

    //     <h2 className="text-2xl sm:text-3xl font-semibold mb-2 font-[var(--font-orbitron)] tracking-wide">
    //       Get in Touch
    //     </h2>
    //     <p className="text-slate-400 text-sm sm:text-base mb-8">
    //       Have questions or want to learn more about StonicAI? We'd love to hear from you.
    //     </p>

    //     <div className="grid lg:grid-cols-3 gap-8">
    //       {/* Contact Info */}
    //       <div className="lg:col-span-1 space-y-6">
    //         <ContactInfoItem
    //           icon="📧"
    //           title="Email"
    //           value="stonicai@gmail.com"
    //           subtext="We'll respond within 24 hours"
    //         />
    //         <ContactInfoItem
    //           icon="📍"
    //           title="Location"
    //           value="RVCE, Bangalore"
    //           subtext="Remote-friendly collaboration"
    //         />
    //         <ContactInfoItem
    //           icon="🔗"
    //           title="Connect"
    //           value="GitHub • LinkedIn • Twitter"
    //           subtext="Follow our latest updates"
    //         />
    //       </div>

    //       {/* Contact Form */}
    //       <form
    //         onSubmit={handleSubmit}
    //         className="lg:col-span-2 space-y-4"
    //       >
    //         <div className="grid sm:grid-cols-2 gap-4">
    //           <div>
    //             <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">
    //               Name
    //             </label>
    //             <input
    //               type="text"
    //               name="name"
    //               value={formData.name}
    //               onChange={handleChange}
    //               className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_16px_rgba(34,211,238,0.2)] transition-all placeholder-slate-600"
    //               placeholder="Your name"
    //             />
    //           </div>
    //           <div>
    //             <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">
    //               Email
    //             </label>
    //             <input
    //               type="email"
    //               name="email"
    //               value={formData.email}
    //               onChange={handleChange}
    //               className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_16px_rgba(34,211,238,0.2)] transition-all placeholder-slate-600"
    //             //   placeholder="your@email.com"
    //             />
    //           </div>
    //         </div>

    //         <div>
    //           <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">
    //             Subject
    //           </label>
    //           <input
    //             type="text"
    //             name="subject"
    //             value={formData.subject}
    //             onChange={handleChange}
    //             className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_16px_rgba(34,211,238,0.2)] transition-all placeholder-slate-600"
    //             placeholder="How can we help?"
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">
    //             Message
    //           </label>
    //           <textarea
    //             name="message"
    //             value={formData.message}
    //             onChange={handleChange}
    //             rows="5"
    //             className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_16px_rgba(34,211,238,0.2)] transition-all placeholder-slate-600 resize-none"
    //             placeholder="Your message here..."
    //           />
    //         </div>

    //         {submitted ? (
    //           <div className="bg-emerald-950/40 border border-emerald-800 rounded-xl px-4 py-3 text-emerald-300 text-sm">
    //             ✓ Thank you! We'll get back to you soon.
    //           </div>
    //         ) : (
    //           <button
    //             type="submit"
    //             className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-100 font-semibold rounded-xl uppercase tracking-wide text-sm transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
    //           >
    //             Send Message
    //           </button>
    //         )}
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <></>
  );
}

function ContactInfoItem({ icon, title, value, subtext }) {
  return (
    <div className="border border-slate-800 rounded-2xl bg-slate-950/70 p-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs uppercase tracking-wide text-slate-400">
        {title}
      </div>
      <div className="mt-1 text-sm font-semibold text-cyan-300">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{subtext}</div>
    </div>
  );
}
