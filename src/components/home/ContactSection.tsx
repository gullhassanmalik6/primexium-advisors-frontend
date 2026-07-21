import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BRAND, ROUTES } from '@/constants'

export function ContactSection() {
  return (
    <section className="section-padding bg-primary text-white">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-secondary">
              Contact Us
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
              Get in touch with our expert counsellors for a free consultation.
            </p>

            <div className="space-y-6">
              {[
                { icon: FaPhone, label: 'Phone', value: BRAND.phone },
                { icon: FaEnvelope, label: 'Email', value: BRAND.email },
                { icon: FaMapMarkerAlt, label: 'Address', value: BRAND.address },
                { icon: FaWhatsapp, label: 'WhatsApp', value: BRAND.whatsapp },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <item.icon className="text-secondary" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 text-foreground shadow-2xl"
          >
            <h3 className="text-xl font-semibold text-primary">Send us a Message</h3>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="Your Name" aria-label="Your Name" />
                <Input type="email" placeholder="Email Address" aria-label="Email Address" />
              </div>
              <Input placeholder="Phone Number" aria-label="Phone Number" />
              <Input placeholder="Subject" aria-label="Subject" />
              <textarea
                className="flex min-h-[120px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Your Message"
                aria-label="Your Message"
              />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Or{' '}
              <Link to={ROUTES.bookConsultation} className="font-medium text-secondary hover:underline">
                book a free consultation
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
