import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Support Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Your partnership helps us train, equip, and send chaplains to meet real needs in real communities.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Make a Donation</h2>
            <p className="text-gray-600 mb-6">
              Your generous support enables us to continue training chaplains and serving communities.
            </p>
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <p className="font-medium">Bank Transfer Details</p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Account Name:</strong> IIPEC Potter's House Command<br />
                <strong>Bank:</strong> [Bank Name]<br />
                <strong>Account Number:</strong> [Account Number]
              </p>
            </div>
            <Link href="#" className="btn-accent w-full text-center">
              Donate Now
            </Link>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Partner With Us</h2>
            <p className="text-gray-600 mb-6">
              Become a partner in our mission to equip chaplains and serve communities with compassion.
            </p>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-center gap-3">
                <span className="text-accent">✓</span>
                <span>Monthly partnership program</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent">✓</span>
                <span>Sponsor a chaplain in training</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-accent">✓</span>
                <span>Support specific programs and outreaches</span>
              </li>
            </ul>
            <Link href="/contact" className="btn-primary w-full text-center">
              Contact Us to Partner
            </Link>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-primary mb-2">Every Contribution Makes a Difference</h3>
          <p className="text-gray-600">
            "The best way to find yourself is to lose yourself in the service of others."
          </p>
        </div>
      </div>
    </div>
  )
}