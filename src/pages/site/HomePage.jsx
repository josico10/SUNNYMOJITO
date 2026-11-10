import Icon from '../../components/Icon';
import { useApp } from '../../context/AppContext';
import { formatPrice, instagramLink, whatsappLink } from '../../lib/format';

const INGREDIENTS = [
  { name: 'Fresh lime', text: 'A bright, citrusy kick.', image: '/images/lime.jpg' },
  { name: 'Mint leaves', text: 'Cool, fragrant freshness.', image: '/images/mint.jpg' },
  { name: 'Sparkling soda', text: 'The happiest little bubbles.', image: '/images/soda.jpg' },
  { name: 'Fresh fruits', text: 'Colorful, juicy character.', image: '/images/fruits.jpg' },
  { name: 'Ice cubes', text: 'That perfectly chilled sip.', image: '/images/ice.jpg' },
];

const REASONS = [
  { icon: 'leaf', title: 'Fresh & Refreshing', text: 'Crisp citrus, cool mint and a sparkle that lifts the moment.' },
  { icon: 'sparkle', title: 'Fruity Flavors', text: 'From berry-bright to mango-sweet, find your feel-good flavor.' },
  { icon: 'growth', title: 'Quality Ingredients', text: 'Thoughtfully chosen fruit and herbs. Simple things, done well.' },
  { icon: 'smile', title: 'Good Vibes', text: 'A cheerful flavor, whether you’re solo or sharing a round.' },
];

export default function HomePage() {
  const { products, gallery, contacts, settings } = useApp();
  const menu = products.filter((p) => p.status === 'active');
  const photos = gallery.slice(0, 4);
  const orderUrl = (name) => whatsappLink(contacts.whatsapp, name ? `Hi! I’d like to order a ${name}.` : `Hi ${settings.brandName}!`);

  return (
    <>
      {/* Hero */}
      <section id="home" className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">A little tropical, a lot of happy</p>
            <h1>{settings.tagline}.</h1>
            <p className="hero__lead">{settings.description}</p>
            <a href="#products" className="btn btn--dark btn--lg">
              Explore Our Menu <Icon name="arrowRight" size={16} />
            </a>
            <p className="hero__note">
              <Icon name="leaf" size={16} /> Freshly mixed. Made for the moment.
            </p>
          </div>
          <figure className="hero__photo">
            <img src="/images/hero.jpg" alt="A tall glass of mojito with lime, mint and crushed ice" />
            <figcaption>
              <Icon name="sun" size={14} /> Your daily sip of fresh
            </figcaption>
          </figure>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section about">
        <div className="container about__inner">
          <figure className="about__photo">
            <img src="/images/about.jpg" alt="Fresh mint being muddled in a glass" loading="lazy" />
            <figcaption>Simple ingredients. A brighter everyday.</figcaption>
          </figure>
          <div className="about__copy">
            <p className="eyebrow">About us</p>
            <h2>Good days start with a fresh sip.</h2>
            <p>
              {settings.brandName} began with a simple idea: a great drink can turn an ordinary pause into a little escape. So we bring a tropical taste of mint to every glass we mix.
            </p>
            <p>
              Our philosophy? Keep it fresh, keep it joyful. We pair vibrant citrus and fragrant mint with sparkling soda and real fruit, letting the ingredients do the talking.
            </p>
            <p className="about__sign">A little sunshine, made to share.</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section section--sage">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow">Our products</p>
              <h2>Find your sunny side.</h2>
            </div>
            <p className="section__aside">Fresh-made flavors. One bright mood. Which one is your kind of sunshine?</p>
          </div>

          {menu.length === 0 ? (
            <p className="site-empty">Our menu is being refreshed. Check back soon for new flavors.</p>
          ) : (
            <ul className="menu">
              {menu.map((p) => (
                <li key={p.id} className="menu__item">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.tag && <p className="menu__tag">{p.tag}</p>}
                  <h3>{p.name}</h3>
                  <p className="menu__desc">{p.description}</p>
                  <div className="menu__foot">
                    <strong>{formatPrice(p.price)}</strong>
                    <a href={orderUrl(p.name)} target="_blank" rel="noreferrer" className="btn btn--outline-dark btn--sm">
                      Order Now <Icon name="arrowUpRight" size={14} />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Ingredients */}
      <section id="ingredients" className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow">Our ingredients</p>
              <h2>
                Nothing extra.
                <br />
                Just the good stuff.
              </h2>
            </div>
            <p className="section__aside">The best kind of refreshment starts with the simplest things. Five fresh essentials, mixed with care for a bright, balanced sip.</p>
          </div>
          <ul className="ingredients">
            {INGREDIENTS.map((item) => (
              <li key={item.name}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section section--dark">
        <div className="container">
          <p className="eyebrow eyebrow--light">Why choose us</p>
          <h2>A brighter kind of refreshment.</h2>
          <ul className="reasons">
            {REASONS.map((r) => (
              <li key={r.title}>
                <Icon name={r.icon} size={26} />
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2>Life on the sunny side.</h2>
            </div>
            <p className="section__aside">Fresh pours, slow afternoons and moments worth sharing.</p>
          </div>

          {photos.length === 0 ? (
            <p className="site-empty">Photos are on their way. Check back soon.</p>
          ) : (
            <div className={`mosaic mosaic--${photos.length}`}>
              {photos.map((photo, i) => (
                <img key={photo.id} className={`mosaic__img mosaic__img--${i + 1}`} src={photo.src} alt={photo.name.replace(/\.[a-z]+$/i, '').replace(/[-_]/g, ' ')} loading="lazy" />
              ))}
            </div>
          )}

          <div className="mosaic__foot">
            <span>A little collection of everyday escapes.</span>
            <a href={instagramLink(contacts.instagram)} target="_blank" rel="noreferrer">
              Sunny moments <Icon name="arrowUpRight" size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section section--sage">
        <div className="container contact">
          <div className="contact__copy">
            <p className="eyebrow">Contact</p>
            <h2>Let’s make your day a little sunnier.</h2>
            <p>A favorite flavor, a friendly hello, or a round for your crew — we’d love to hear from you.</p>
            <a href={orderUrl()} target="_blank" rel="noreferrer" className="btn btn--dark btn--lg">
              Contact Us <Icon name="arrowUpRight" size={16} />
            </a>
          </div>

          <ul className="contact__list">
            <li>
              <a href={instagramLink(contacts.instagram)} target="_blank" rel="noreferrer">
                <Icon name="instagram" size={20} />
                <span>
                  <small>Instagram</small>
                  <strong>{contacts.instagram}</strong>
                </span>
                <Icon name="arrowUpRight" size={16} />
              </a>
            </li>
            <li>
              <a href={whatsappLink(contacts.whatsapp)} target="_blank" rel="noreferrer">
                <Icon name="chat" size={20} />
                <span>
                  <small>WhatsApp</small>
                  <strong>{contacts.whatsapp}</strong>
                </span>
                <Icon name="arrowUpRight" size={16} />
              </a>
            </li>
            <li>
              <a href={`mailto:${contacts.email}`}>
                <Icon name="mail" size={20} />
                <span>
                  <small>Email</small>
                  <strong>{contacts.email}</strong>
                </span>
                <Icon name="arrowUpRight" size={16} />
              </a>
            </li>
            <li>
              <div className="contact__row">
                <Icon name="pin" size={20} />
                <span>
                  <small>Visit</small>
                  <strong>{contacts.address}</strong>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
