import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ user, setUser, API_BASE_URL }) => {
    const [subscribers, setSubscribers] = useState([])
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/admin/login')
            return
        }
        fetchSubscribers()
    }, [user])

    const fetchSubscribers = async () => {
        try {
            const token = localStorage.getItem('adminToken')
            const resp = await fetch(`${API_BASE_URL}/admin/dashboard`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            })
            const data = await resp.json()
            if (data.success) {
                setSubscribers(data.users)
            }
        } catch (err) {
            console.error('Failed to fetch subscribers')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await fetch(`${API_BASE_URL}/admin/logout`)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        setUser(null)
        navigate('/admin/login')
    }

    const handleSendNewsletter = async (e) => {
        e.preventDefault()
        if (selectedUsers.length === 0) {
            alert('Please select at least one member.')
            return
        }
        try {
            const token = localStorage.getItem('adminToken')
            const resp = await fetch(`${API_BASE_URL}/admin/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ selectedUsers, subject, content })
            })
            const data = await resp.json()
            setStatus({ type: data.success ? 'success' : 'danger', message: data.message })
            if (data.success) {
                setSubject('')
                setContent('')
                setSelectedUsers([])
            }
        } catch (err) {
            setStatus({ type: 'danger', message: 'Failed to send newsletter.' })
        }
    }

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(subscribers.map(s => s.email))
        } else {
            setSelectedUsers([])
        }
    }

    const toggleUser = (email) => {
        if (selectedUsers.includes(email)) {
            setSelectedUsers(selectedUsers.filter(e => e !== email))
        } else {
            setSelectedUsers([...selectedUsers, email])
        }
    }

    if (!user) return null

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
                    align-items: stretch;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

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

                .adm-card {
                    position: relative; z-index: 1;
                    display: flex;
                    width: 100%;
                    min-height: 100vh;
                    border-radius: 0;
                    overflow: hidden;
                    box-shadow: 0 0 0 1px var(--border);
                }

                .adm-left {
                    width: 40%;
                    background: linear-gradient(160deg, #12172e 0%, #0b0d1a 60%, #0e1020 100%);
                    padding: 52px 44px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }

                .adm-left::before {
                    content: ''; position: absolute; inset: 0;
                    background-image:
                        linear-gradient(var(--border) 1px, transparent 1px),
                        linear-gradient(90deg, var(--border) 1px, transparent 1px);
                    background-size: 40px 40px; pointer-events: none;
                }

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

                .adm-right {
                    width: 60%;
                    background: var(--cream);
                    padding: 40px 44px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                .adm-right::before {
                    content: ''; position: absolute; inset: 0;
                    background-image: radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px);
                    background-size: 22px 22px; pointer-events: none;
                }

                .adm-form-header { position: relative; z-index: 1; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
                .adm-eyebrow {
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.25em; text-transform: uppercase;
                    color: #9a7b2e; margin-bottom: 8px;
                }
                .adm-form-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 26px; font-weight: 700;
                    color: var(--deep); line-height: 1.2; margin-bottom: 4px;
                }
                .adm-form-desc {
                    font-size: 13px; font-weight: 300;
                    color: #6b6e80; line-height: 1.7;
                }

                .adm-stats-pill {
                    padding: 10px 14px;
                    border-radius: 6px;
                    background: rgba(201,168,76,0.1);
                    border: 1px solid rgba(201,168,76,0.5);
                    font-size: 11px;
                    color: #9a7b2e;
                    min-width: 140px;
                    text-align: right;
                }
                .adm-stats-pill span {
                    display: block;
                }
                .adm-stats-pill .label {
                    text-transform: uppercase;
                    letter-spacing: 0.16em;
                    font-weight: 600;
                    font-size: 10px;
                    opacity: 0.8;
                }
                .adm-stats-pill .value {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--deep);
                }

                .adm-dashboard {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
                    gap: 20px;
                    margin-top: 10px;
                }

                .adm-panel {
                    background: rgba(255,255,255,0.9);
                    border-radius: 6px;
                    border: 1px solid rgba(11,13,26,0.08);
                    padding: 16px 18px;
                }

                .adm-panel h5 {
                    margin: 0 0 12px;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--deep);
                }

                .adm-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }
                .adm-table th,
                .adm-table td {
                    padding: 8px 6px;
                    border-bottom: 1px solid rgba(11,13,26,0.06);
                    text-align: left;
                }
                .adm-table thead th {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #8a8fa8;
                    font-weight: 600;
                }
                .adm-table tbody tr:hover {
                    background: rgba(11,13,26,0.02);
                }
                .adm-avatar {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: rgba(11,13,26,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--deep);
                    margin-right: 8px;
                }

                .adm-form {
                    margin-top: 4px;
                }
                .adm-field {
                    margin-bottom: 12px;
                }
                .adm-label {
                    display: block;
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.15em; text-transform: uppercase;
                    color: #8a8fa8; margin-bottom: 4px;
                }
                .adm-input, .adm-textarea {
                    width: 100%; padding: 10px 12px;
                    border: 1px solid rgba(11,13,26,0.14);
                    background: rgba(255,255,255,0.95);
                    border-radius: 3px;
                    font-family: 'Jost', sans-serif;
                    font-size: 13px; font-weight: 400;
                    color: var(--deep); outline: none;
                }
                .adm-textarea {
                    resize: vertical;
                    min-height: 120px;
                }
                .adm-input:focus, .adm-textarea:focus {
                    border-color: var(--gold);
                    box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
                    background: #fff;
                }

                .adm-submit {
                    width: 100%; padding: 12px;
                    background: var(--deep); color: var(--cream);
                    border: none; border-radius: 3px;
                    font-family: 'Jost', sans-serif;
                    font-size: 11px; font-weight: 600;
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

                .adm-footer {
                    position: relative; z-index: 1;
                    text-align: center; margin-top: 16px;
                    font-size: 11px; font-weight: 300;
                    color: rgba(11,13,26,0.3); line-height: 1.6;
                }

                .adm-page-footer {
                    position: relative; z-index: 1;
                    text-align: center; margin-top: 24px;
                    color: rgba(255,255,255,0.4);
                    font-size: 11px; font-weight: 300;
                }

                @media (max-width: 900px) {
                    .adm-card { flex-direction: column; }
                    .adm-left, .adm-right { width: 100%; }
                    .adm-right { padding: 32px 24px; }
                    .adm-dashboard {
                        grid-template-columns: minmax(0,1fr);
                    }
                }
            `}</style>

            <div className="adm-page">
                <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="adm-card">
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
                                    Admin<br /><em>Dashboard</em><br />Overview.
                                </h1>
                                <p className="adm-sub">
                                    View your subscriber family at a glance and send faith-filled updates in just a few clicks.
                                </p>
                            </div>

                            <div className="adm-divider" />

                            <div className="adm-info">
                                <div className="adm-info-label">Quick snapshot</div>
                                <div className="adm-info-item">
                                    <div className="adm-dot" />
                                    <div className="adm-info-text">Total subscribers: <strong>{subscribers.length}</strong></div>
                                </div>
                                <div className="adm-info-item">
                                    <div className="adm-dot" />
                                    <div className="adm-info-text">Select specific members and send tailored newsletters.</div>
                                </div>
                                <div className="adm-info-item">
                                    <div className="adm-dot" />
                                    <div className="adm-info-text">Every message is an opportunity to bless someone&apos;s week.</div>
                                </div>
                            </div>

                            <div className="adm-verse-wrap">
                                <p className="adm-verse">
                                    "How beautiful are the feet of those who bring good news."
                                    <cite>— Romans 10:15</cite>
                                </p>
                            </div>
                        </div>

                        <div className="adm-right">
                            <div className="adm-form-header">
                                <div>
                                    <div className="adm-eyebrow">Welcome, {user.firstName || 'Pastor'}</div>
                                    <h2 className="adm-form-title">Subscriber Management</h2>
                                    <p className="adm-form-desc">
                                        View, manage, and engage with your church community from a single, elegant dashboard.
                                    </p>
                                </div>
                                <div className="adm-stats-pill">
                                    <span className="label">Total Subscribers</span>
                                    <span className="value">{subscribers.length}</span>
                                </div>
                            </div>

                            <div style={{ position: 'relative', zIndex: 1, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#6b6e80' }}>
                                <div>Signed in as <strong>{user.email}</strong></div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="button" onClick={() => navigate('/')} style={{ border: 'none', background: 'transparent', fontSize: 11, textDecoration: 'underline', cursor: 'pointer', color: '#6b6e80' }}>
                                        View site
                                    </button>
                                    <button type="button" onClick={handleLogout} style={{ border: 'none', background: 'transparent', fontSize: 11, textDecoration: 'underline', cursor: 'pointer', color: '#c04040' }}>
                                        Logout
                                    </button>
                                </div>
                            </div>

                            {status && (
                                <div className="adm-panel" style={{ marginBottom: 12, padding: '10px 12px', background: status.type === 'success' ? 'rgba(46,160,67,0.06)' : 'rgba(200,50,50,0.06)', borderColor: status.type === 'success' ? 'rgba(46,160,67,0.3)' : 'rgba(200,50,50,0.3)' }}>
                                    <div style={{ fontSize: 12, color: status.type === 'success' ? '#1a7f37' : '#c04040' }}>
                                        {status.message}
                                    </div>
                                </div>
                            )}

                            <div className="adm-dashboard">
                                <div className="adm-panel">
                                    <h5>Active Subscribers</h5>
                                    {loading ? (
                                        <div style={{ fontSize: 12, color: '#6b6e80', padding: '10px 0' }}>Loading subscribers...</div>
                                    ) : subscribers.length === 0 ? (
                                        <div style={{ fontSize: 12, color: '#6b6e80', padding: '10px 0' }}>No subscribers found.</div>
                                    ) : (
                                        <table className="adm-table">
                                            <thead>
                                                <tr>
                                                    <th width="32">
                                                        <input
                                                            type="checkbox"
                                                            onChange={toggleSelectAll}
                                                            checked={selectedUsers.length === subscribers.length && subscribers.length > 0}
                                                        />
                                                    </th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Joined</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {subscribers.map(sub => (
                                                    <tr key={sub._id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsers.includes(sub.email)}
                                                                onChange={() => toggleUser(sub.email)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div className="adm-avatar">
                                                                    {sub.firstName?.[0]}
                                                                    {sub.lastName?.[0]}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontSize: 12, fontWeight: 600 }}>{sub.firstName} {sub.lastName}</div>
                                                                    <div style={{ fontSize: 11, color: '#8a8fa8' }}>{sub.phoneNumber}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontSize: 12 }}>{sub.email}</td>
                                                        <td style={{ fontSize: 12 }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                <div className="adm-panel">
                                    <h5>Compose Newsletter</h5>
                                    <form className="adm-form" onSubmit={handleSendNewsletter}>
                                        <div className="adm-field">
                                            <label className="adm-label">Newsletter Subject</label>
                                            <input
                                                type="text"
                                                className="adm-input"
                                                placeholder="e.g. Weekly Faith Update"
                                                value={subject}
                                                onChange={e => setSubject(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="adm-field">
                                            <label className="adm-label">Message Content</label>
                                            <textarea
                                                className="adm-textarea"
                                                placeholder="Type your message here..."
                                                value={content}
                                                onChange={e => setContent(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="adm-submit" disabled={selectedUsers.length === 0}>
                                            <span>
                                                {selectedUsers.length === 0
                                                    ? 'Select members to send'
                                                    : `Send to ${selectedUsers.length} member${selectedUsers.length > 1 ? 's' : ''}`}
                                            </span>
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <p className="adm-footer">
                                © {new Date().getFullYear()} RCCG Breakthrough Cathedral Admin Dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="adm-page-footer">
                        © {new Date().getFullYear()} RCCG BTC Admin Portal
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
