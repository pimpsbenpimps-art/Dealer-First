import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;
const asset = (name: string) => `${base}/images/${name}`;

type Route = '/' | '/about-us' | '/services' | '/process' | '/testimonials' | '/contact';
const routes: { label: string; path: Route }[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Services', path: '/services' },
  { label: 'Process', path: '/process' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Contact', path: '/contact' },
];

function pathFromLocation() {
  const raw = window.location.pathname.replace(/\/+$/, '') || '/';
  const withoutBase = base && base !== '/' && raw.startsWith(base) ? raw.slice(base.length) || '/' : raw;
  return (routes.some((route) => route.path === withoutBase) ? withoutBase : '/') as Route;
}

function SiteLink({ href, children, className = '', onNavigate, ariaCurrent }: { href: Route; children: ReactNode; className?: string; onNavigate: (path: Route) => void; ariaCurrent?: 'page' }) {
  return <a className={className} href={`${base}${href === '/' ? '/' : href}`} aria-current={ariaCurrent} onClick={(event) => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onNavigate(href); } }}>{children}</a>;
}

function Logo({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <SiteLink href="/" onNavigate={onNavigate} className="logo-lockup" aria-label="Dealer 1st home">
    <span className="logo-mark">1</span>
    <span className="logo-word">dealer 1st<small>dealership performance</small></span>
  </SiteLink>;
}

function Header({ active, onNavigate }: { active: Route; onNavigate: (path: Route) => void }) {
  const [mobile, setMobile] = useState(false);
  const [notice, setNotice] = useState(true);
  const navigate = (path: Route) => { onNavigate(path); setMobile(false); };
  return <>
    {notice && <div className="announcement"><strong>Dealer 1st / built for the independent dealer</strong><span>Practical support for the work behind every sale.</span><SiteLink href="/about-us" onNavigate={navigate}>Meet the team</SiteLink><button type="button" aria-label="Dismiss announcement" onClick={() => setNotice(false)}>×</button></div>}
    <div className="utility"><span>BDC · finance processing · dealership tools</span><span><a href="mailto:hello@dealer1st.com">hello@dealer1st.com</a>&nbsp;&nbsp; / &nbsp;&nbsp;<a href="tel:18003353271">1.800.335.3271</a></span></div>
    <header className="header">
      <nav className={`nav container ${mobile ? 'mobile-open' : ''}`} aria-label="Primary navigation">
        <Logo onNavigate={navigate} />
        <div className="nav-links">{routes.map((item) => <SiteLink key={item.path} href={item.path} onNavigate={navigate} className={active === item.path ? 'active' : ''} ariaCurrent={active === item.path ? 'page' : undefined}>{item.label}</SiteLink>)}</div>
        <SiteLink className="button header-cta" href="/contact" onNavigate={navigate}>Start a conversation</SiteLink>
        <button className="mobile-toggle" type="button" aria-expanded={mobile} onClick={() => setMobile(!mobile)}>{mobile ? 'Close menu' : 'Menu'}</button>
      </nav>
    </header>
  </>;
}

function PageHero({ eyebrow, title, intro, image, children, tone = 'dark' }: { eyebrow: string; title: ReactNode; intro: string; image: string; children?: ReactNode; tone?: 'dark' | 'light' }) {
  return <section className={`page-hero ${tone}`} style={{ backgroundImage: `linear-gradient(90deg, ${tone === 'dark' ? 'rgba(22,74,74,.97)' : 'rgba(245,243,238,.95)' } 12%, ${tone === 'dark' ? 'rgba(22,74,74,.74)' : 'rgba(245,243,238,.73)'} 61%, transparent 100%), url("${asset(image)}")` }}>
    <div className="container page-hero-inner"><div className="hero-kicker">{eyebrow}</div><h1>{title}</h1><p>{intro}</p>{children}</div>
    <div className="page-hero-index">Dealer 1st / {eyebrow}</div>
  </section>;
}

function SectionIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: ReactNode; copy?: string; action?: ReactNode }) {
  return <div className="section-intro"><div><div className="eyebrow">{eyebrow}</div><h2 className="section-title">{title}</h2></div>{copy && <div className="intro-side"><p className="section-copy">{copy}</p>{action}</div>}</div>;
}

function ImageBand({ image, label, title, copy, flip = false }: { image: string; label: string; title: string; copy: string; flip?: boolean }) {
  return <section className={`image-band ${flip ? 'flip' : ''}`}><div className="image-band-image"><img src={asset(image)} alt="" /></div><div className="image-band-copy"><div className="eyebrow">{label}</div><h2>{title}</h2><p>{copy}</p></div></section>;
}

function Home({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <>
    <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(17,54,55,.98) 0%, rgba(17,54,55,.84) 39%, rgba(17,54,55,.2) 76%, rgba(17,54,55,.45) 100%), url("${asset('hero-section.png')}")` }}>
      <div className="hero-inner"><div className="hero-kicker">The operator&apos;s advantage</div><h1>Run the store.<br /><em>We&apos;ll work the details.</em></h1><p className="hero-intro">Dealer 1st gives independent dealerships the BDC support, finance processing, and software tools to make every part of the operation more deliberate.</p><div className="hero-actions"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Talk with Dealer 1st</SiteLink><SiteLink className="button outline" href="/services" onNavigate={onNavigate}>See how we help</SiteLink></div></div>
      <div className="hero-stat"><strong>One clear lane.</strong><span>Support that connects the people, process, and tools behind your dealership.</span></div><div className="hero-aside">Independent by design / automotive by experience</div>
    </section>
    <section className="trust-row"><div className="container trust-inner"><span className="trust-label">The work behind a better dealership day</span><div className="trust-items"><span>Lead response</span><span>Appointment flow</span><span>Credit workflow</span><span>Store visibility</span></div></div></section>
    <section className="video-section"><div className="container"><SectionIntro eyebrow="See the difference in the day-to-day" title={<>A better system<br />starts with context.</>} copy="Dealer 1st is built around the reality of an independent store: moving fast, doing more with less, and needing every handoff to count." action={<SiteLink className="text-link" href="/about-us" onNavigate={onNavigate}>Why Dealer 1st</SiteLink>} /><div className="video-layout"><div className="video-frame"><video controls preload="metadata" poster={asset('hero-section.png')} data-future-source="/videos/dealer-1st-introduction.mp4" aria-label="Dealer 1st company introduction video"><p>This Dealer 1st introduction will be available here soon.</p></video><div className="video-caption"><strong>Support for the work customers never see.</strong><span>INTRODUCTION / 01:00</span></div></div><aside className="video-notes"><div><div className="eyebrow">What changes</div><h3>Fewer loose ends.</h3><p>From the first inquiry to the final finance handoff, we help make the next step easier to see and easier to take.</p></div><ul className="note-list"><li>Clear ownership for every active opportunity</li><li>Process support that respects your store&apos;s pace</li><li>Tools that help operators act, not just report</li></ul></aside></div></div></section>
    <ImageBand image="CA-EVBS-20-web.jpg" label="Made for the floor" title="The details are where the day is won." copy="Your team already knows how to sell cars. We help the work around the sale feel just as considered, with practical support that slots into the way independent operators actually move." />
    <section className="home-route-grid"><div className="container"><SectionIntro eyebrow="A focused operating partner" title={<>Bring the pressure<br />point. We&apos;ll bring<br /><em>a clearer next step.</em></>} copy="Start with one service, or connect the pieces when the operation is ready." action={<SiteLink className="button outline" href="/contact" onNavigate={onNavigate}>Find your fit</SiteLink>} /><div className="route-cards"><SiteLink href="/services" onNavigate={onNavigate} className="route-card"><span>01 / Services</span><strong>Put the right support at the right handoff.</strong><b>↗</b></SiteLink><SiteLink href="/process" onNavigate={onNavigate} className="route-card dark-card"><span>02 / Process</span><strong>A straightforward engagement, with no mystery.</strong><b>↗</b></SiteLink><SiteLink href="/testimonials" onNavigate={onNavigate} className="route-card image-card"><span>03 / Proof</span><strong>See what better daily details sound like.</strong><b>↗</b></SiteLink></div></div></section>
    <CtaBand onNavigate={onNavigate} />
  </>;
}

function About({ onNavigate }: { onNavigate: (path: Route) => void }) {
  const values = [['Operator-minded', 'We build around real dealership rhythms, not theory.'], ['Clear by default', 'Simple handoffs and useful visibility keep work moving.'], ['Built to fit', 'Start with the pressure point that matters most to you.'], ['In it for the long haul', 'Improve the system as your operation grows and changes.']];
  return <><PageHero eyebrow="About us" title={<>The first call for dealers who do a lot with a little.</>} intro="Dealer 1st works alongside independent dealerships and automotive operators who want a more dependable way to manage the work between an opportunity and a delivered vehicle." image="dfw-20160914-3382-web.jpg"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Start a conversation</SiteLink></PageHero><section className="about-story"><div className="container about-grid"><div className="about-lead"><div className="eyebrow">Who we serve</div><h2>Independent by design.</h2></div><div className="about-body"><p>Big enough to need structure. Close enough to know every customer by name. That is the space we understand.</p><p>We bring together experienced BDC support, disciplined finance processing, and focused software tools so your team can spend less time chasing the process and more time running the store.</p><div className="about-points">{values.map(([title, text]) => <div className="about-point" key={title}><strong>{title}</strong><span>{text}</span></div>)}</div></div></div></section><ImageBand image="SAP-_Automaster_Mich_Chris-2405-web.jpg" label="A different kind of partner" title="Experience that stays close to the work." copy="The best operating support does not arrive with a thick playbook. It listens, finds the friction, and earns its place in the rhythm of the store." flip /><section className="leadership"><div className="container"><SectionIntro eyebrow="The way we show up" title={<>Useful beats<br /><em>impressive.</em></>} copy="We keep our point of view close to the people doing the work. That means fewer layers, clearer answers, and a shared definition of progress." /><div className="leadership-grid"><div className="lead-card"><span>01</span><h3>Listen before prescribing.</h3><p>Your operation has a shape of its own. We start by understanding it.</p></div><div className="lead-card featured"><span>02</span><h3>Make the next action obvious.</h3><p>Good systems reduce hesitation. Everyone should know what happens next.</p></div><div className="lead-card"><span>03</span><h3>Stay accountable to the day.</h3><p>Progress should be visible in the calls, deals, and handoffs that matter.</p></div></div></div></section><CtaBand onNavigate={onNavigate} /></>;
}

const services = [
  ['01 / BDC SUPPORT', 'More conversations. Better follow-through.', 'A focused BDC layer that helps your team respond, nurture, and set more qualified appointments without losing the human touch.', 'IMG_1434-1.png'],
  ['02 / FINANCE PROCESSING', 'Cleaner deals, fewer bottlenecks.', 'Keep credit and finance work moving with organized processing support designed around your store and your lenders.', 'instant-cash-step-4-web.jpg'],
  ['03 / DEALERSHIP SOFTWARE', 'Tools that fit the way you operate.', 'Practical software tools for independent dealerships that turn scattered tasks into a clearer daily workflow.', 'auto-market-weekly-summary-1.png'],
];
function Services({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <><PageHero eyebrow="Services" title={<>The right help<br />at the right handoff.</>} intro="Choose one focused service or bring the pieces together. The work starts with where your store feels the most friction." image="CA-EVBS-20-web.jpg" tone="light"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Find your fit</SiteLink></PageHero><section className="services-page"><div className="container"><div className="service-stack">{services.map(([number, title, text, image], index) => <article className={`service-row ${index === 0 ? 'service-row-first' : ''}`} key={number}><div className="service-row-image"><img src={asset(image)} alt="" /></div><div className="service-row-copy"><div className="service-number">{number}</div><h2>{title}</h2><p>{text}</p><SiteLink className="text-link" href="/contact" onNavigate={onNavigate}>Talk through this service</SiteLink></div></article>)}</div><div className="service-detail"><div className="detail-row"><strong>BDC support</strong><span>Lead response, nurture, appointment setting, and follow-through that feels like part of your team.</span></div><div className="detail-row"><strong>Finance processing</strong><span>Organized deal support and lender-ready workflows that help keep the desk moving.</span></div><div className="detail-row"><strong>Software tools</strong><span>Focused systems that give independent operators a clearer view of today&apos;s work.</span></div><div className="detail-row"><strong>Flexible engagement</strong><span>Start with a defined need, then add support when the operation is ready.</span></div></div></div></section><section className="service-note"><div className="container"><div className="eyebrow">One useful question</div><h2>Where does the day<br /><em>lose its rhythm?</em></h2><SiteLink className="button outline" href="/contact" onNavigate={onNavigate}>Let&apos;s find it</SiteLink></div></section></>;
}

const processSteps = [['01', 'Listen first', 'We map your current lead flow, deal process, team rhythm, and the opportunities hiding between them.'], ['02', 'Build the plan', 'You get a focused engagement plan with clear priorities, owners, and a practical path to launch.'], ['03', 'Work the system', 'Our specialists and tools join your operation with steady communication and useful visibility.'], ['04', 'Tune the details', 'We look at what is working, what is stuck, and where the next useful improvement lives.']];
function Process({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <><PageHero eyebrow="Process" title={<>No mystery.<br /><em>Just momentum.</em></>} intro="You should always know what we are solving, what happens next, and how the work connects back to your store." image="Spotelson-IMG_8288-web.jpg"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Plan the first step</SiteLink></PageHero><section className="process-page"><div className="container"><SectionIntro eyebrow="A straightforward engagement" title={<>Four steps from<br />friction to flow.</>} copy="We keep the work visible and the plan practical. No black box, no handoff that disappears into the distance." /><div className="process-steps process-steps-light">{processSteps.map(([number, title, text]) => <article className="process-step" key={number}><div className="step-no">{number}</div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section><ImageBand image="featured-benefits-bg.png" label="Work that compounds" title="A system that gets more useful over time." copy="The first win may be a returned call or an unstuck deal. The bigger win is a team that knows how to repeat it tomorrow." flip /><section className="process-checklist"><div className="container"><div className="eyebrow">What you can expect</div><div className="checklist-grid"><div><strong>A clear owner</strong><span>Every workstream has a person responsible for its next move.</span></div><div><strong>Useful visibility</strong><span>See what is active, what needs attention, and what changed.</span></div><div><strong>Room to adjust</strong><span>Keep what works. Tune what does not. Grow at the speed of the store.</span></div></div><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Start with the pressure point</SiteLink></div></section></>;
}

const testimonials = [
  ['“We stopped treating every lead like a fresh start. Dealer 1st helped us bring consistency to the follow-up our store needed.”', 'General Manager', 'Independent dealership'],
  ['“The finance process feels calmer, more organized, and easier for the whole team to own.”', 'Finance Director', 'Pre-owned automotive group'],
  ['“The best part is that the tools make sense on a busy dealership day. No extra complexity for the sake of it.”', 'Operations Lead', 'Independent dealership'],
  ['“We finally have a shared view of what needs a hand today, instead of five different versions of the truth.”', 'Sales Manager', 'Family-owned dealer group'],
];
function Testimonials({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <><PageHero eyebrow="Testimonials" title={<>Proof in the<br /><em>daily details.</em></>} intro="Good support is felt in the small moments: the call returned, the deal unstuck, the team aligned before the next customer arrives." image="CA-EVBS-20-web.jpg" tone="light"><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Bring us your day</SiteLink></PageHero><section className="proof-page"><div className="container"><div className="proof-intro"><div className="eyebrow">From the driver&apos;s seat</div><h2>Better support<br />sounds like this.</h2><p>Independent operators do not need another promise. They need the daily details to feel a little more under control.</p></div><div className="testimonial-grid substantial">{testimonials.map(([quote, role, company], index) => <figure className={`testimonial ${index === 0 ? 'featured' : ''}`} key={quote}><div><div className="quote-mark" aria-hidden="true">&ldquo;</div><blockquote>{quote}</blockquote></div><cite><strong>{role}</strong>{company}</cite></figure>)}</div></div></section><section className="testimonial-gallery"><div className="container"><img src={asset('dfw-20160914-3382-web.jpg')} alt="Dealership team working together" /><div><div className="eyebrow">A shared standard</div><h2>The win is not just the number.</h2><p>It is the calmer desk, the cleaner handoff, and the confidence to take the next customer as they arrive.</p><SiteLink className="text-link" href="/services" onNavigate={onNavigate}>Explore the support</SiteLink></div></div></section><CtaBand onNavigate={onNavigate} /></>;
}

type FormState = { name: string; dealership: string; email: string; phone: string; service: string; message: string };
const emptyForm: FormState = { name: '', dealership: '', email: '', phone: '', service: '', message: '' };
function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (field: keyof FormState, value: string) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const next: Partial<Record<keyof FormState, string>> = {}; if (!form.name.trim()) next.name = 'Please add your name.'; if (!form.dealership.trim()) next.dealership = 'Please add your dealership or company.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'; if (!form.phone.trim()) next.phone = 'Please add a phone number.'; if (!form.service) next.service = 'Choose a service interest.'; if (!form.message.trim()) next.message = 'Tell us a little about the operation.'; setErrors(next); if (!Object.keys(next).length) setSubmitted(true); };
  if (submitted) return <div className="success-state"><div className="eyebrow">Message received</div><h3>We&apos;ll take it from here.</h3><p>Thanks for reaching out to Dealer 1st. A member of our team will review your note and follow up with the next useful question.</p><button className="button outline" type="button" onClick={() => { setSubmitted(false); setForm(emptyForm); }}>Send another message</button></div>;
  return <form className="contact-form" onSubmit={submit} noValidate>{([['name', 'Your name'], ['dealership', 'Dealership / company'], ['email', 'Work email'], ['phone', 'Phone']] as [keyof FormState, string][]).map(([field, label]) => <div className="field" key={field}><label htmlFor={field}>{label}</label><input id={field} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} value={form[field]} onChange={(event) => update(field, event.target.value)} aria-invalid={Boolean(errors[field])} />{errors[field] && <span className="field-error">{errors[field]}</span>}</div>)}<div className="field full"><label htmlFor="service">I&apos;m interested in</label><select id="service" value={form.service} onChange={(event) => update('service', event.target.value)} aria-invalid={Boolean(errors.service)}><option value="">Choose a service</option><option>BDC support</option><option>Finance processing</option><option>Dealership software tools</option><option>A combination</option></select>{errors.service && <span className="field-error">{errors.service}</span>}</div><div className="field full"><label htmlFor="message">What are you working through?</label><textarea id="message" value={form.message} onChange={(event) => update('message', event.target.value)} aria-invalid={Boolean(errors.message)} />{errors.message && <span className="field-error">{errors.message}</span>}</div><div className="form-actions"><span className="form-note">This form is for starting a conversation. We&apos;ll keep the first step focused and useful.</span><button className="button" type="submit">Send inquiry</button></div></form>;
}

function Contact({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <><PageHero eyebrow="Contact" title={<>Bring us the<br /><em>messy part.</em></>} intro="Tell us where the operation feels stuck. We&apos;ll bring a clear point of view and start with the work that matters most." image="my27-chrysler-pacifica-gallery-exterior-expanded-02-desktop.jpg"><a className="text-link light-link" href="tel:18003353271">Call 1.800.335.3271</a></PageHero><section className="contact contact-page"><div className="container contact-grid"><div className="contact-intro"><div className="eyebrow">Let&apos;s talk shop</div><h2 className="section-title">A focused conversation can change the way the whole day runs.</h2><p className="section-copy">Share a little context and we&apos;ll get back to you with the next useful question — not a sales script.</p><div className="contact-details"><span>Prefer a direct line?</span><a href="mailto:hello@dealer1st.com">hello@dealer1st.com</a><a href="tel:18003353271">1.800.335.3271</a><span className="office-note">Serving independent dealerships across the country.</span></div></div><ContactForm /></div></section><section className="contact-aside"><div className="container"><div><div className="eyebrow">Good to know</div><h2>Start with one useful conversation.</h2></div><div className="contact-aside-points"><span>01 / No obligation</span><span>02 / Practical first step</span><span>03 / Built around your store</span></div></div></section></>;
}

function CtaBand({ onNavigate }: { onNavigate: (path: Route) => void }) { return <section className="cta-band"><div className="container cta-inner"><h2>Better dealership days start with one honest conversation.</h2><SiteLink className="button" href="/contact" onNavigate={onNavigate}>Start with Dealer 1st</SiteLink></div></section>; }

function Footer({ onNavigate }: { onNavigate: (path: Route) => void }) {
  return <footer className="footer"><div className="container"><div className="footer-main"><div><Logo onNavigate={onNavigate} /><p className="footer-note">The BDC, finance processing, and software partner for independent dealerships.</p></div><div><h3>Explore</h3>{routes.slice(0, 3).map((route) => <SiteLink href={route.path} onNavigate={onNavigate} key={route.path}>{route.label}</SiteLink>)}</div><div><h3>Company</h3>{routes.slice(3).map((route) => <SiteLink href={route.path} onNavigate={onNavigate} key={route.path}>{route.label}</SiteLink>)}</div><div><h3>Start here</h3><p className="footer-note">A focused conversation can change the way the whole day runs.</p><SiteLink href="/contact" onNavigate={onNavigate}>Contact Dealer 1st ↗</SiteLink></div></div><div className="footer-bottom"><span>© 2026 Dealer 1st. All rights reserved.</span><div className="socials"><SiteLink href="/contact" onNavigate={onNavigate}>LinkedIn</SiteLink><SiteLink href="/contact" onNavigate={onNavigate}>Contact</SiteLink></div></div></div></footer>;
}

function App() {
  const [route, setRoute] = useState<Route>(pathFromLocation);
  useEffect(() => { const onPop = () => { setRoute(pathFromLocation()); window.scrollTo(0, 0); }; window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const navigate = (next: Route) => { const url = `${base}${next === '/' ? '/' : next}`; window.history.pushState({}, '', url); setRoute(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const page = route === '/' ? <Home onNavigate={navigate} /> : route === '/about-us' ? <About onNavigate={navigate} /> : route === '/services' ? <Services onNavigate={navigate} /> : route === '/process' ? <Process onNavigate={navigate} /> : route === '/testimonials' ? <Testimonials onNavigate={navigate} /> : <Contact onNavigate={navigate} />;
  useEffect(() => { const titles: Record<Route, string> = { '/': 'Dealer 1st | Built for the independent dealer', '/about-us': 'About Dealer 1st | Independent by design', '/services': 'Services | Dealer 1st', '/process': 'Process | Dealer 1st', '/testimonials': 'Testimonials | Dealer 1st', '/contact': 'Contact Dealer 1st' }; document.title = titles[route]; }, [route]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary><div className="site"><Header active={route} onNavigate={navigate} /><main key={route}>{page}</main><Footer onNavigate={navigate} /></div></ErrorBoundary><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;