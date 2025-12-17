import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
      {/* Contact Info */}
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Contact Us
        </h1>
        <p className="text-gray-600">
          Have questions, feedback, or ideas? We’d love to hear from you.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" />
            <span>support@digitallifelessons.com</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-blue-600" />
            <span>+880 1234-567890</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-blue-600" />
            <span>Dhaka, Bangladesh</span>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden shadow border">
          <iframe
            title="map"
            src="https://www.google.com/maps?q=Dhaka,Bangladesh&output=embed"
            className="w-full h-64 border-0"
            loading="lazy"
          />
        </div>
      </div>

      {/* Contact Form */}
      <form className="bg-white rounded-xl shadow border p-6 space-y-4">
        <h2 className="text-xl font-semibold">Send a Message</h2>

        <input
          type="text"
          placeholder="Your Name"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full border rounded-lg px-4 py-2"
        />

        <textarea
          rows="4"
          placeholder="Your Message"
          className="w-full border rounded-lg px-4 py-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
