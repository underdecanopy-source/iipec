import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">IIPEC Potter's House Command</h3>
            <p className="text-secondary/80 text-sm">
              Equipping chaplains to serve with excellence and compassion.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-secondary/80">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/programs" className="hover:text-white transition">Programs</Link></li>
              <li><Link href="/events" className="hover:text-white transition">Events</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Support Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-secondary/80">
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-secondary/80 hover:text-white transition">Facebook</a>
              <a href="#" className="text-secondary/80 hover:text-white transition">Twitter</a>
              <a href="#" className="text-secondary/80 hover:text-white transition">Instagram</a>
            </div>
            <p className="mt-4 text-sm text-secondary/60">
              © 2026 IIPEC Potter's House Command. All rights reserved.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-secondary/60">
          <Link href="/legal/privacy" className="hover:text-white transition mx-2">Privacy Policy</Link>
          <span>•</span>
          <Link href="/legal/terms" className="hover:text-white transition mx-2">Terms of Use</Link>
          <span>•</span>
          <Link href="/legal/donation-policy" className="hover:text-white transition mx-2">Donation Policy</Link>
        </div>
      </div>
    </footer>
  )
}