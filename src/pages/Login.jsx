import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ message, setMessage, setUser, API_BASE_URL }) => {
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        try {
            const resp = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            })
            const data = await resp.json()
            if (data.success) {
                if (data.token) {
                    localStorage.setItem('adminToken', data.token)
                }
                if (data.user) {
                    localStorage.setItem('adminUser', JSON.stringify(data.user))
                }
                setUser(data.user)
                navigate('/admin')
            } else {
                setMessage({ type: 'danger', text: data.message })
            }
        } catch (err) {
            setMessage({ type: 'danger', text: 'Login failed. Please try again.' })
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

                .adm-page {
                    font-family: 'Jost', sans-serif;
                    background: var(--deep);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding: 24px;
                }

                /* Ambient glows */
                .adm-page::before {
                    content: '';
                    position: fixed;
                    width: 700px; height: 700px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%);
                    top: -220px; right: -180px;
                    pointer-events: none;
                }
                .adm-page::after {
                    content: '';
                    position: fixed;
                    width: 500px; height: 500px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(60,80,180,0.08) 0%, transparent 70%);
                    bottom: -160px; left: -120px;
                    pointer-events: none;
                }

                /* ── CARD ── */
                .adm-card {
                    position: relative; z-index: 1;
                    display: flex;
                    width: min(860px, 100%);
                    min-height: 540px;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px var(--border);
                }

                /* ── LEFT PANEL ── */
                .adm-left {
                    width: 45%;
                    background: linear-gradient(160deg, #12172e 0%, #0b0d1a 60%, #0e1020 100%);
                    padding: 52px 44px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }

                /* Grid lines */
                .adm-left::before {
                    content: ''; position: absolute; inset: 0;
                    background-image:
                        linear-gradient(var(--border) 1px, transparent 1px),
                        linear-gradient(90deg, var(--border) 1px, transparent 1px);
                    background-size: 40px 40px; pointer-events: none;
                }

                /* Watermark cross */
                .adm-cross {
                    position: absolute; bottom: -60px; right: -40px;
                    width: 260px; height: 260px; opacity: 0.04; pointer-events: none;
                }
                .adm-cross::before, .adm-cross::after {
                    content: ''; position: absolute;
                    background: var(--gold); border-radius: 3px;
                }
                .adm-cross::before { width: 40px; height: 100%; left: 50%; transform: translateX(-50%); }
                .adm-cross::after  { height: 40px; width: 100%; top: 30%; }

                .adm-l-top { position: relative; z-index: 1; }

                .adm-badge {
                    display: flex; align-items: center; gap: 12px; margin-bottom: 32px;
                }
                .adm-badge-logo {
                    width: 44px; height: 44px; border-radius: 50%;
                    border: 1.5px solid var(--gold);
                    overflow: hidden; flex-shrink: 0;
                    background: rgba(201,168,76,0.08);
                    display: flex; align-items: center; justify-content: center;
                }
                .adm-badge-logo img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
                .adm-badge-text {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--gold); line-height: 1.5;
                }

                .adm-headline {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(32px, 3.5vw, 44px);
                    font-weight: 600; line-height: 1.1;
                    color: var(--cream); margin-bottom: 16px;
                }
                .adm-headline em { font-style: italic; color: var(--gold); }

                .adm-sub {
                    font-size: 13px; font-weight: 300; line-height: 1.85;
                    color: var(--muted); max-width: 280px;
                }

                .adm-divider {
                    width: 40px; height: 1px;
                    background: var(--gold); margin: 28px 0; opacity: 0.5;
                }

                /* Access info items */
                .adm-info { position: relative; z-index: 1; }
                .adm-info-label {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.2em; text-transform: uppercase;
                    color: var(--gold); margin-bottom: 14px;
                }
                .adm-info-item {
                    display: flex; align-items: flex-start;
                    gap: 12px; margin-bottom: 11px;
                }
                .adm-dot {
                    width: 5px; height: 5px; border-radius: 50%;
                    background: var(--gold); margin-top: 6px;
                    flex-shrink: 0; opacity: 0.7;
                }
                .adm-info-text {
                    font-size: 13px; font-weight: 300;
                    color: rgba(248,245,239,0.5); line-height: 1.6;
                }

                .adm-verse-wrap {
                    position: relative; z-index: 1;
                    padding-top: 24px;
                    border-top: 1px solid var(--border);
                }
                .adm-verse {
                    font-family: 'Cormorant Garamond', serif;
                    font-style: italic; font-size: 13.5px;
                    color: rgba(248,245,239,0.3); line-height: 1.7;
                }
                .adm-verse cite {
                    display: block; font-style: normal;
                    font-family: 'Jost', sans-serif;
                    font-size: 10px; font-weight: 500;
                    letter-spacing: 0.15em; color: var(--gold);
                    margin-top: 5px; opacity: 0.7;
                }

                /* ── RIGHT PANEL ── */
                .adm-right {
                    width: 55%;
                    background: var(--cream);
                    padding: 52px 52px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                }
                .adm-right::before {
                    content: ''; position: absolute; inset: 0;
                    background-image: radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px);
                    background-size: 22px 22px; pointer-events: none;
                }

                /* Alert */
                .adm-alert {
                    position: relative; z-index: 1;
                    padding: 12px 16px; border-radius: 3px;
                    font-size: 13px; font-weight: 400;
                    margin-bottom: 20px; line-height: 1.5;
                }
                .adm-alert.danger {
                    background: rgba(200,50,50,0.08);
                    border: 1px solid rgba(200,50,50,0.25);
                    color: #c04040;
                }
                .adm-alert.success {
                    background: rgba(46,160,67,0.1);
                    border: 1px solid rgba(46,160,67,0.3);
                    color: #1a7f37;
                }

                /* Form header */
                .adm-form-header { position: relative; z-index: 1; margin-bottom: 30px; }
                .adm-eyebrow {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.25em; text-transform: uppercase;
                    color: #9a7b2e; margin-bottom: 8px;
                }
                .adm-form-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 28px; font-weight: 700;
                    color: var(--deep); line-height: 1.2; margin-bottom: 7px;
                }
                .adm-form-desc {
                    font-size: 13px; font-weight: 300;
                    color: #6b6e80; line-height: 1.7;
                }

                /* Secure badge */
                .adm-secure {
                    display: inline-flex; align-items: center; gap: 6px;
                    margin-top: 10px;
                    padding: 5px 10px;
                    border: 1px solid rgba(201,168,76,0.3);
                    border-radius: 100px;
                    font-size: 10px; font-weight: 500;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    color: #9a7b2e;
                    background: rgba(201,168,76,0.06);
                }
                .adm-secure-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #9a7b2e; animation: adm-pulse 2s infinite;
                }
                @keyframes adm-pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.3; }
                }

                /* Form fields */
                .adm-form { position: relative; z-index: 1; }
                .adm-field { margin-bottom: 18px; }

                .adm-label {
                    display: block; font-size: 10px; font-weight: 600;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: #8a8fa8; margin-bottom: 6px;
                }

                .adm-input {
                    width: 100%; padding: 13px 16px;
                    border: 1px solid rgba(11,13,26,0.14);
                    background: rgba(255,255,255,0.8);
                    border-radius: 3px;
                    font-family: 'Jost', sans-serif;
                    font-size: 14px; font-weight: 400;
                    color: var(--deep); outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .adm-input::placeholder { color: rgba(11,13,26,0.22); }
                .adm-input:focus {
                    border-color: var(--gold);
                    box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
                    background: #fff;
                }

                /* Submit */
                .adm-submit {
                    width: 100%; padding: 15px;
                    background: var(--deep); color: var(--cream);
                    border: none; border-radius: 3px;
                    font-family: 'Jost', sans-serif;
                    font-size: 12px; font-weight: 600;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    cursor: pointer; position: relative; overflow: hidden;
                    transition: color 0.3s; margin-top: 6px;
                }
                .adm-submit::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, #9a7b2e, var(--gold2));
                    transform: translateX(-101%);
                    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
                }
                .adm-submit:hover::after { transform: translateX(0); }
                .adm-submit:hover:not(:disabled) { color: var(--deep); }
                .adm-submit:disabled { opacity: 0.65; cursor: not-allowed; }
                .adm-submit span { position: relative; z-index: 1; }

                /* Footer */
                .adm-footer {
                    position: relative; z-index: 1;
                    text-align: center; margin-top: 16px;
                    font-size: 11px; font-weight: 300;
                    color: rgba(11,13,26,0.3); line-height: 1.6;
                }

                /* Page footer */
                .adm-page-footer {
                    position: relative; z-index: 1;
                    text-align: center; margin-top: 24px;
                    color: rgba(255,255,255,0.4);
                    font-size: 11px; font-weight: 300;
                }

                /* Animations */
                .adm-badge, .adm-headline, .adm-sub, .adm-divider,
                .adm-info, .adm-verse-wrap {
                    opacity: 0; transform: translateY(16px);
                    animation: admRise 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
                }
                .adm-badge      { animation-delay: 0.10s; }
                .adm-headline   { animation-delay: 0.20s; }
                .adm-sub        { animation-delay: 0.28s; }
                .adm-divider    { animation-delay: 0.34s; }
                .adm-info       { animation-delay: 0.40s; }
                .adm-verse-wrap { animation-delay: 0.48s; }

                .adm-form-header, .adm-field, .adm-submit, .adm-footer {
                    opacity: 0; transform: translateY(12px);
                    animation: admRise 0.6s cubic-bezier(0.4,0,0.2,1) forwards;
                }
                .adm-form-header { animation-delay: 0.32s; }
                .adm-field:nth-of-type(1) { animation-delay: 0.40s; }
                .adm-field:nth-of-type(2) { animation-delay: 0.46s; }
                .adm-submit { animation-delay: 0.52s; }
                .adm-footer { animation-delay: 0.56s; }

                @keyframes admRise { to { opacity: 1; transform: translateY(0); } }

                /* Responsive */
                @media (max-width: 680px) {
                    .adm-page { align-items: flex-start; overflow-y: auto; }
                    .adm-card { flex-direction: column; min-height: unset; }
                    .adm-left, .adm-right { width: 100%; }
                    .adm-left  { padding: 40px 28px; }
                    .adm-right { padding: 40px 28px; }
                }
            `}</style>

            <div className="adm-page">
                <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <div className="adm-card">

                        {/* ── LEFT PANEL ── */}
                        <div className="adm-left">
                            <div className="adm-cross" />

                            <div className="adm-l-top">
                                <div className="adm-badge">
                                    <div className="adm-badge-logo">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Rccg_logo.png/1280px-Rccg_logo.png"
                                            alt="RCCG Logo"
                                        />
                                    </div>
                                    <div className="adm-badge-text">RCCG<br />Breakthrough Cathedral</div>
                                </div>

                                <h1 className="adm-headline">
                                    Admin<br /><em>Portal</em><br />Access.
                                </h1>
                                <p className="adm-sub">
                                    Secure sign-in for authorised church administrators and newsletter managers.
                                </p>
                            </div>

                            <div className="adm-divider" />

                            <div className="adm-info">
                                <div className="adm-info-label">Portal capabilities</div>
                                {[
                                    'Manage & view all newsletter subscribers',
                                    'Compose & send broadcast messages',
                                    'Monitor delivery reports & analytics',
                                    'Manage church events & announcements',
                                ].map((item, i) => (
                                    <div className="adm-info-item" key={i}>
                                        <div className="adm-dot" />
                                        <div className="adm-info-text">{item}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="adm-verse-wrap">
                                <p className="adm-verse">
                                    "A faithful person will be richly blessed."
                                    <cite>— Proverbs 28:20</cite>
                                </p>
                            </div>
                        </div>

                        {/* ── RIGHT PANEL ── */}
                        <div className="adm-right">

                            <div className="adm-form-header">
                                <div className="adm-eyebrow">Restricted Access</div>
                                <h2 className="adm-form-title">Sign in to<br />Dashboard.</h2>
                                <p className="adm-form-desc">Authorised personnel only. All activity is logged.</p>
                                <div className="adm-secure">
                                    <div className="adm-secure-dot" />
                                    Secured connection
                                </div>
                            </div>

                            {message && (
                                <div className={`adm-alert ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <form className="adm-form" onSubmit={handleLogin}>

                                <div className="adm-field">
                                    <label className="adm-label" htmlFor="adminEmail">Admin Email</label>
                                    <input
                                        className="adm-input"
                                        id="adminEmail"
                                        type="email"
                                        placeholder="admin@breakthroughcathedral.org"
                                        value={loginData.email}
                                        onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="adm-field">
                                    <label className="adm-label" htmlFor="adminPassword">Password</label>
                                    <input
                                        className="adm-input"
                                        id="adminPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={loginData.password}
                                        onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="adm-submit"
                                    disabled={loading}
                                >
                                    <span>{loading ? 'Signing in...' : 'Sign In to Dashboard →'}</span>
                                </button>
                            </form>

                            <p className="adm-footer">
                                © {new Date().getFullYear()} RCCG Breakthrough Cathedral Admin Portal.
                                Unauthorised access is strictly prohibited.
                            </p>
                        </div>

                    </div>

                    <div className="adm-page-footer">
                        © {new Date().getFullYear()} RCCG Breakthrough Admin Portal
                    </div>

                </div>
            </div>
        </>
    )
}

export default Login