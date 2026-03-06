import { useState } from 'react'

const Register = ({ message, setMessage, API_BASE_URL }) => {
    const [regData, setRegData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        try {
            const resp = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(regData),
            })
            const data = await resp.json()
            setMessage({ type: data.success ? 'success' : 'danger', text: data.message })
            if (data.success) {
                setRegData({ firstName: '', lastName: '', email: '', phoneNumber: '' })
                setSubmitted(true)
            }
        } catch (err) {
            setMessage({ type: 'danger', text: 'Failed to connect to server.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

                :root {
                    --deep:   #0b0d1a;
                    --gold:   #c9a84c;
                    --gold2:  #e8c97a;
                    --cream:  #f8f5ef;
                    --muted:  #8a8fa8;
                    --border: rgba(201,168,76,0.18);
                }

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .rccg-page {
                    font-family: 'Jost', sans-serif;
                    background: var(--deep);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    // padding: 24px;
                }

                /* Ambient glows */
                .rccg-page::before {
                    content: '';
                    position: fixed;
                    width: 700px; height: 700px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
                    top: -200px; left: -200px;
                    pointer-events: none;
                }
                .rccg-page::after {
                    content: '';
                    position: fixed;
                    width: 500px; height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(100,120,220,0.08) 0%, transparent 70%);
                    bottom: -150px; right: -100px;
                    pointer-events: none;
                }

                /* Card */
                .rccg-card {
                    position: relative; z-index: 1;
                    display: flex;
                    width: min(960px, 100%);
                    min-height: 600px;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px var(--border);
                }

                /* ── LEFT PANEL ── */
                .rccg-left {
                    width: 44%;
                    background: linear-gradient(160deg, #12172e 0%, #0b0d1a 60%, #0e1020 100%);
                    padding: 52px 44px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }

                /* Grid overlay */
                .rccg-left::before {
                    content: ''; position: absolute; inset: 0;
                    background-image:
                        linear-gradient(var(--border) 1px, transparent 1px),
                        linear-gradient(90deg, var(--border) 1px, transparent 1px);
                    background-size: 40px 40px; pointer-events: none;
                }

                /* Watermark cross */
                .rccg-cross-bg {
                    position: absolute; bottom: -60px; right: -40px;
                    width: 260px; height: 260px; opacity: 0.04; pointer-events: none;
                }
                .rccg-cross-bg::before, .rccg-cross-bg::after {
                    content: ''; position: absolute;
                    background: var(--gold); border-radius: 3px;
                }
                .rccg-cross-bg::before { width: 40px; height: 100%; left: 50%; transform: translateX(-50%); }
                .rccg-cross-bg::after  { height: 40px; width: 100%; top: 30%; }

                .rccg-l-top { position: relative; z-index: 1; }

                /* Logo + badge */
                .rccg-badge {
                    display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
                }
                .rccg-badge-logo {
                    width: 44px; height: 44px; border-radius: 50%;
                    border: 1.5px solid var(--gold);
                    overflow: hidden; flex-shrink: 0;
                    background: rgba(201,168,76,0.08);
                    display: flex; align-items: center; justify-content: center;
                }
                .rccg-badge-logo img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
                .rccg-badge-text {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--gold); line-height: 1.5;
                }

                .rccg-headline {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(34px, 3.8vw, 48px);
                    font-weight: 600; line-height: 1.1;
                    color: var(--cream); margin-bottom: 16px;
                }
                .rccg-headline em { font-style: italic; color: var(--gold); }

                .rccg-sub {
                    font-size: 13px; font-weight: 300; line-height: 1.85;
                    color: var(--muted); max-width: 290px;
                }

                .rccg-divider {
                    width: 40px; height: 1px;
                    background: var(--gold); margin: 28px 0; opacity: 0.5;
                }

                .rccg-what { position: relative; z-index: 1; }
                .rccg-what-label {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 14px;
                }
                .rccg-what-item {
                    display: flex; align-items: flex-start;
                    gap: 12px; margin-bottom: 11px;
                }
                .rccg-dot {
                    width: 5px; height: 5px; border-radius: 50%;
                    background: var(--gold); margin-top: 6px;
                    flex-shrink: 0; opacity: 0.7;
                }
                .rccg-what-text {
                    font-size: 13px; font-weight: 300;
                    color: rgba(248,245,239,0.55); line-height: 1.6;
                }

                .rccg-verse-wrap {
                    position: relative; z-index: 1;
                    padding-top: 24px;
                    border-top: 1px solid var(--border);
                }
                .rccg-verse {
                    font-family: 'Cormorant Garamond', serif;
                    font-style: italic; font-size: 13.5px;
                    color: rgba(248,245,239,0.32); line-height: 1.7;
                }
                .rccg-verse cite {
                    display: block; font-style: normal;
                    font-family: 'Jost', sans-serif;
                    font-size: 10px; font-weight: 500;
                    letter-spacing: 0.15em; color: var(--gold);
                    margin-top: 5px; opacity: 0.7;
                }

                /* ── RIGHT PANEL ── */
                .rccg-right {
                    width: 56%;
                    background: var(--cream);
                    padding: 52px 52px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                }
                .rccg-right::before {
                    content: ''; position: absolute; inset: 0;
                    background-image: radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px);
                    background-size: 22px 22px; pointer-events: none;
                }

                /* Alert */
                .rccg-alert {
                    position: relative; z-index: 1;
                    padding: 12px 16px;
                    border-radius: 3px;
                    font-size: 13px; font-weight: 400;
                    margin-bottom: 20px; line-height: 1.5;
                }
                .rccg-alert.success {
                    background: rgba(46,160,67,0.1);
                    border: 1px solid rgba(46,160,67,0.3);
                    color: #1a7f37;
                }
                .rccg-alert.danger {
                    background: rgba(200,50,50,0.08);
                    border: 1px solid rgba(200,50,50,0.25);
                    color: #c04040;
                }

                /* Success screen */
                .rccg-success {
                    position: absolute; inset: 0;
                    background: var(--cream); z-index: 20;
                    display: flex; align-items: center; justify-content: center;
                    flex-direction: column; text-align: center; padding: 60px 48px;
                    animation: rccgFadeUp 0.5s ease;
                }
                @keyframes rccgFadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .rccg-success-icon {
                    width: 56px; height: 56px;
                    border: 1.5px solid var(--gold); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 22px; color: var(--gold); margin-bottom: 22px;
                }
                .rccg-success-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 30px; font-weight: 700; color: var(--deep); margin-bottom: 10px;
                }
                .rccg-success-sub {
                    font-size: 13px; font-weight: 300; color: #6b6e80;
                    line-height: 1.8; max-width: 320px;
                }
                .rccg-success-verse {
                    margin-top: 24px;
                    font-family: 'Cormorant Garamond', serif;
                    font-style: italic; font-size: 14px;
                    color: rgba(11,13,26,0.35);
                }

                /* Form header */
                .rccg-form-header { position: relative; z-index: 1; margin-bottom: 28px; }
                .rccg-eyebrow {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.25em; text-transform: uppercase;
                    color: #9a7b2e; margin-bottom: 8px;
                }
                .rccg-form-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 28px; font-weight: 700;
                    color: var(--deep); line-height: 1.2; margin-bottom: 7px;
                }
                .rccg-form-desc {
                    font-size: 13px; font-weight: 300;
                    color: #6b6e80; line-height: 1.7;
                }

                /* Form */
                .rccg-form { position: relative; z-index: 1; }
                .rccg-field { margin-bottom: 16px; }
                .rccg-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 0; }

                .rccg-label {
                    display: block; font-size: 10px; font-weight: 600;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: #8a8fa8; margin-bottom: 6px;
                }

                .rccg-input {
                    width: 100%; padding: 13px 16px;
                    border: 1px solid rgba(11,13,26,0.14);
                    background: rgba(255,255,255,0.8);
                    border-radius: 3px;
                    font-family: 'Jost', sans-serif;
                    font-size: 14px; font-weight: 400;
                    color: var(--deep); outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .rccg-input::placeholder { color: rgba(11,13,26,0.22); }
                .rccg-input:focus {
                    border-color: var(--gold);
                    box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
                    background: #fff;
                }

                /* Submit */
                .rccg-submit {
                    width: 100%; padding: 15px;
                    background: var(--deep); color: var(--cream);
                    border: none; border-radius: 3px;
                    font-family: 'Jost', sans-serif;
                    font-size: 12px; font-weight: 600;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    cursor: pointer; position: relative; overflow: hidden;
                    transition: color 0.3s; margin-top: 6px;
                }
                .rccg-submit::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, #9a7b2e, var(--gold2));
                    transform: translateX(-101%);
                    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
                }
                .rccg-submit:hover::after { transform: translateX(0); }
                .rccg-submit:hover:not(:disabled) { color: var(--deep); }
                .rccg-submit:disabled { opacity: 0.65; cursor: not-allowed; }
                .rccg-submit span { position: relative; z-index: 1; }

                .rccg-fine {
                    margin-top: 12px; font-size: 11px; font-weight: 300;
                    color: rgba(11,13,26,0.3); text-align: center; line-height: 1.6;
                    position: relative; z-index: 1;
                }

                /* Footer */
                .rccg-footer {
                    position: relative; z-index: 1;
                    text-align: center; margin-top: 28px;
                    color: rgba(255,255,255,0.5); font-size: 12px; line-height: 1.7;
                }
                .rccg-footer small { display: block; font-size: 11px; opacity: 0.6; margin-top: 2px; }

                /* Animations */
                .rccg-badge, .rccg-headline, .rccg-sub, .rccg-divider,
                .rccg-what, .rccg-verse-wrap {
                    opacity: 0; transform: translateY(16px);
                    animation: rccgRise 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
                }
                .rccg-badge      { animation-delay: 0.10s; }
                .rccg-headline   { animation-delay: 0.20s; }
                .rccg-sub        { animation-delay: 0.28s; }
                .rccg-divider    { animation-delay: 0.34s; }
                .rccg-what       { animation-delay: 0.40s; }
                .rccg-verse-wrap { animation-delay: 0.48s; }

                .rccg-form-header, .rccg-row, .rccg-field,
                .rccg-submit, .rccg-fine {
                    opacity: 0; transform: translateY(12px);
                    animation: rccgRise 0.6s cubic-bezier(0.4,0,0.2,1) forwards;
                }
                .rccg-form-header { animation-delay: 0.32s; }
                .rccg-row         { animation-delay: 0.40s; }
                .rccg-field       { animation-delay: 0.46s; }
                .rccg-submit      { animation-delay: 0.54s; }
                .rccg-fine        { animation-delay: 0.58s; }

                @keyframes rccgRise { to { opacity: 1; transform: translateY(0); } }

                /* Responsive */
                @media (max-width: 720px) {
                    .rccg-page { align-items: flex-start; overflow-y: auto; padding: 16px; }
                    .rccg-card { flex-direction: column; min-height: unset; }
                    .rccg-left, .rccg-right { width: 100%; }
                    .rccg-left  { padding: 40px 28px; }
                    .rccg-right { padding: 40px 28px; }
                    .rccg-row   { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="rccg-page">
                <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <div className="rccg-card">

                        {/* ── LEFT PANEL ── */}
                        <div className="rccg-left">
                            <div className="rccg-cross-bg" />

                            <div className="rccg-l-top">
                                <div className="rccg-badge">
                                    <div className="rccg-badge-logo">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Rccg_logo.png/1280px-Rccg_logo.png"
                                            alt="RCCG Logo"
                                        />
                                    </div>
                                    <div className="rccg-badge-text">RCCG<br />Breakthrough Cathedral</div>
                                </div>

                                <h1 className="rccg-headline">
                                    Stay<br /><em>connected</em><br />to the Word.
                                </h1>
                                <p className="rccg-sub">
                                    Receive sermons, devotionals, and church updates — right in your inbox, every week.
                                </p>
                            </div>

                            <div className="rccg-divider" />

                            <div className="rccg-what">
                                <div className="rccg-what-label">What you'll receive</div>
                                {[
                                    'Weekly sermon highlights & message notes',
                                    'Upcoming events, programmes & prayer schedules',
                                    'Daily devotional & scripture reflections',
                                    'Breakthrough testimonies & praise reports',
                                ].map((item, i) => (
                                    <div className="rccg-what-item" key={i}>
                                        <div className="rccg-dot" />
                                        <div className="rccg-what-text">{item}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="rccg-verse-wrap">
                                <p className="rccg-verse">
                                    "I will give you the treasures of darkness, riches stored in secret places."
                                    <cite>— Isaiah 45:3</cite>
                                </p>
                            </div>
                        </div>

                        {/* ── RIGHT PANEL ── */}
                        <div className="rccg-right">

                            {/* Success overlay */}
                            {submitted && (
                                <div className="rccg-success">
                                    <div className="rccg-success-icon">✦</div>
                                    <div className="rccg-success-title">Welcome, Beloved.</div>
                                    <p className="rccg-success-sub">
                                        You're now part of our mailing family. Check your inbox — your first newsletter will arrive shortly.
                                    </p>
                                    <p className="rccg-success-verse">"The Lord bless you and keep you." — Numbers 6:24</p>
                                </div>
                            )}

                            <div className="rccg-form-header">
                                <div className="rccg-eyebrow">Join Our Newsletter</div>
                                <h2 className="rccg-form-title">Sign up &<br />be blessed.</h2>
                                <p className="rccg-form-desc">Free. No spam. Unsubscribe anytime. Just faith-filled content, delivered with love.</p>
                            </div>

                            {/* Alert message */}
                            {message && (
                                <div className={`rccg-alert ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <form className="rccg-form" onSubmit={handleRegister}>

                                {/* First & Last Name */}
                                <div className="rccg-row">
                                    <div className="rccg-field">
                                        <label className="rccg-label" htmlFor="firstName">First Name</label>
                                        <input
                                            className="rccg-input"
                                            id="firstName"
                                            type="text"
                                            placeholder="Grace"
                                            value={regData.firstName}
                                            onChange={e => setRegData({ ...regData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="rccg-field">
                                        <label className="rccg-label" htmlFor="lastName">Last Name</label>
                                        <input
                                            className="rccg-input"
                                            id="lastName"
                                            type="text"
                                            placeholder="Adeyemi"
                                            value={regData.lastName}
                                            onChange={e => setRegData({ ...regData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="rccg-field">
                                    <label className="rccg-label" htmlFor="email">Email Address</label>
                                    <input
                                        className="rccg-input"
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={regData.email}
                                        onChange={e => setRegData({ ...regData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="rccg-field">
                                    <label className="rccg-label" htmlFor="phoneNumber">Phone Number</label>
                                    <input
                                        className="rccg-input"
                                        id="phoneNumber"
                                        type="tel"
                                        placeholder="+234..."
                                        value={regData.phoneNumber}
                                        onChange={e => setRegData({ ...regData, phoneNumber: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="rccg-submit"
                                    disabled={loading}
                                >
                                    <span>{loading ? 'Processing...' : 'Subscribe to Newsletter →'}</span>
                                </button>
                            </form>

                            <p className="rccg-fine">
                                Your data is safe with us. We do not share your information with third parties.
                            </p>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="rccg-footer">
                        © {new Date().getFullYear()} Breakthrough Cathedral.
                        <small>We respect your privacy. You can unsubscribe at any time.</small>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Register