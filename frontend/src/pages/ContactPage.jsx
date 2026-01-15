import React from 'react';
import { Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import FormField from '../components/FormField';

// Left Sidebar Info Block
const InfoBlock = ({ icon: Icon, title, description, details }) => (
  <div className="flex flex-col gap-4 border-b border-black/20 pb-8 last:border-0 last:pb-0">
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DB4444] text-white">
        <Icon size={20} />
      </div>
      <h3 className="text-base font-medium text-black">{title}</h3>
    </div>
    <div className="flex flex-col gap-4 text-sm font-normal text-black">
      <p>{description}</p>
      {details.map((detail, index) => (
        <p key={index}>{detail}</p>
      ))}
    </div>
  </div>
)



const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Breadcrumb Navigation */}
      <div className="mb-20 text-sm text-gray-500">
        <span>Home</span> <span className="mx-2">/</span> <span className="text-black font-medium">Contact</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Contact Information Card */}
        <aside className="w-full lg:w-[340px] bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.05)] rounded p-10 border border-gray-50">
          <div className="flex flex-col gap-8">
            <InfoBlock 
              icon={Phone}
              title="Call To Us"
              description="We are available 24/7, 7 days a week."
              details={['Phone: +8801611112222']}
            />
            <InfoBlock 
              icon={Mail}
              title="Write To Us"
              description="Fill out our form and we will contact you within 24 hours."
              details={[
                'Emails: customer@exclusive.com',
                'Emails: support@exclusive.com'
              ]}
            />
          </div>
        </aside>

        {/* Right Side: Contact Form */}
        <main className="flex-1 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.05)] rounded p-8 border border-gray-50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Top row inputs */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField placeholder="Your Name" required />
              <FormField placeholder="Your Email" required type="email" />
              <FormField placeholder="Your Phone" required type="tel" />
            </div>

            {/* Message Area */}
            <textarea 
              placeholder="Your Message"
              rows={8}
              className="w-full bg-[#F5F5F5] rounded py-3 px-4 focus:outline-none placeholder:text-gray-400 text-sm resize-none"
            />

            {/* Action Button */}
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-[#DB4444] text-white px-12 py-4 rounded hover:bg-red-600 transition-colors font-medium text-base"
              >
                Send Message
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ContactPage;