import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Support Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mb-4">
          Be Part of Something That Lasts.
        </p>
        <p className="text-gray-600 max-w-3xl mb-12">
          Every chaplain we train, every community we reach, and every life we touch is made possible by the partnership of people who believe in this mission. Your support, in whatever form it takes, makes an eternal difference.
        </p>
        <p className="text-gray-600 max-w-3xl mb-12">Join hands with us to bring hope, compassion, and care to those in need.</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">What Your Support Covers</h2>
            <p className="text-gray-600 mb-4">When you give to IIPEC Potter’s House Command, you are directly funding:</p>
            <ul className="space-y-3 text-gray-600">
              <li>• The training and equipping of chaplains through our Diploma in Chaplaincy programme</li>
              <li>• The production of chaplaincy uniforms, badges, and ranking accessories</li>
              <li>• All our outreach programmes to various locations, including hospitals, orphanages, correctional facilities, and rural communities through village crusades, among others.</li>
              <li>• The operational costs of running the Command Base in Ibadan and the administrative office in Lagos</li>
              <li>• The development and maintenance of our institutional infrastructure, including this website</li>
            </ul>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Ways to Give</h2>
            <h3 className="font-semibold text-primary mb-2">In Person</h3>
            <p className="text-gray-600 mb-6">Visit us at our administrative office:<br />No. 6, Dagunro Close, Behind Total Filling Station, Ojota, Lagos State.</p>
            <h3 className="font-semibold text-primary mb-2">By Phone</h3>
            <p className="text-gray-600">Speak to us directly about your donation:<br />Tel: +2349137060556</p>
          </div>
        </div>

        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Partner With Us</h2>
          <p className="text-gray-600 mb-4">Financial giving is one way to partner, but not the only way.</p>
          <p className="text-gray-600 mb-4">You can also support IIPEC Chaplains by:</p>
          <ul className="space-y-3 text-gray-600 mb-6">
            <li>• Hosting our outreach team at your facility or organisation</li>
            <li>• Sponsoring a chaplain through their training programme</li>
            <li>• Connecting us with hospitals, schools, or institutions that need chaplaincy services</li>
            <li>• Volunteering your professional skills for the advancement of our mission</li>
            <li>• Sharing our work on social media and within your network</li>
          </ul>
          <Link href="/contact" className="btn-primary inline-block text-center">Contact Us to Partner</Link>
        </div>

        <div className="bg-secondary rounded-xl p-8 text-center">
          <p className="text-gray-600">
            Please use “Donation” as your payment description and notify us via the Contact page after your transfer so we can acknowledge your gift. Thank you.
          </p>
        </div>
      </div>
    </div>
  )
}
