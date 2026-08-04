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
            <div className="flex flex-wrap gap-3">
              <a href="https://web.facebook.com/profile.php?id=61580019583250" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary/80 hover:text-white transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M13.5 21v-8.25h2.75l.41-3.18H13.5V4.77c0-.92.26-1.55 1.58-1.55h1.69V.14c-.29-.04-1.29-.13-2.45-.13-2.42 0-4.08 1.48-4.08 4.2v2.34H6.5v3.18h2.75V21h4.25Z" /></svg>
                Facebook
              </a>
              <a href="https://x.com/iipec_phcommand" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary/80 hover:text-white transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.9 2H22l-6.7 7.7L23.4 22h-5.9l-4.7-6.2L6.8 22H3.7l7.2-8.2L.6 2h6l4.3 5.7L18.9 2Zm-1 18h1.1L6.2 4H4.9l13 16Z" /></svg>
                Twitter
              </a>
              <a href="https://www.instagram.com/iipecpottershousecommand?igsh=MWp2MDdscjJwdHcxaQ%3D%3D" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary/80 hover:text-white transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" /></svg>
                Instagram
              </a>
              <a href="https://www.youtube.com/@iipec-pottershousecommand" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary/80 hover:text-white transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M23 7.5a3.6 3.6 0 0 0-.8-1.6A2.8 2.8 0 0 0 20.6 5c-1.4-.2-7.1-.2-7.1-.2s-5.7 0-7.1.2A2.8 2.8 0 0 0 1.8 5.9a3.6 3.6 0 0 0-.8 1.6A37.3 37.3 0 0 0 1 12a37.3 37.3 0 0 0 .1 4.5 3.6 3.6 0 0 0 .8 1.6c.4.4.9.8 1.5.9 1.4.2 7.1.2 7.1.2s5.7 0 7.1-.2a2.8 2.8 0 0 0 1.6-.9 3.6 3.6 0 0 0 .8-1.6 37.3 37.3 0 0 0 .1-4.5A37.3 37.3 0 0 0 23 7.5Zm-13.2 8.1V8.4l6.3 3.6-6.3 3.6Z" /></svg>
                YouTube
              </a>
            </div>
            <p className="mt-4 text-sm text-secondary/60">
              &copy; 2026 IIPEC Potter&apos;s House Command. All rights reserved.
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