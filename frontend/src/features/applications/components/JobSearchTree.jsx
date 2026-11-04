export default function JobSearchTree({ applications = [] }) {
    // Calculate live numbers
    const total = applications.length;
    
    // Group status
    let noResponseCount = 0;
    let rejectedCount = 0;
    let interviewCount = 0;
    let acceptedCount = 0;
    let declinedCount = 0;

    if (total > 0) {
        applications.forEach(app => {
            const st = (app.status || '').toLowerCase();
            if (st === 'no response') {
                noResponseCount++;
            } else if (st === 'rejected') {
                rejectedCount++;
            } else if (st === 'accepted' || st === 'offer') {
                interviewCount++;
                acceptedCount++;
            } else if (st === 'declined') {
                interviewCount++;
                declinedCount++;
            } else if (st === 'interviewing') {
                interviewCount++;
            } else {
                // 'Applied' or 'Reviewing'
                // Pending applications
            }
        });

        // Ensure interview count matches sub-branches if any
        const subSum = acceptedCount + declinedCount;
        if (interviewCount < subSum) {
            interviewCount = subSum;
        }
    }

    // Default or demo values if zero applications so user can preview the tree layout
    const isDemo = total === 0;
    const appliedVal = isDemo ? 50 : total;
    const noResponseVal = isDemo ? 25 : noResponseCount;
    const interviewVal = isDemo ? 8 : interviewCount;
    const rejectedVal = isDemo ? 15 : rejectedCount;
    const acceptedVal = isDemo ? 2 : acceptedCount;
    const declinedVal = isDemo ? 6 : declinedCount;

    return (
        <div className="job-search-tree-card bento-card bento-card--3d">
            <div className="tree-card-header">
                <div className="tree-title-group">
                    <h3 className="tree-heading">
                        Job Search Summary <span className="sparkle-icon">✨</span>
                    </h3>
                    <p className="tree-subtitle">
                        {isDemo
                            ? 'Sample pipeline view — add real applications to populate your live conversion tree.'
                            : `Visualizing pipeline conversion for ${total} active applications.`}
                    </p>
                </div>
                {isDemo && (
                    <span className="demo-indicator-pill">Preview Mode</span>
                )}
            </div>

            <div className="tree-svg-canvas-wrap">
                <svg
                    viewBox="0 0 850 440"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="sankey-tree-svg"
                >
                    <defs>
                        {/* Soft Drop Shadow for Node Pills */}
                        <filter id="pillShadow" x="-10%" y="-20%" width="125%" height="150%">
                            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.08" />
                            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.04" />
                        </filter>
                    </defs>

                    {/* ── FLOW 1: Applied -> No Response (Top Branch) ── */}
                    <path
                        d="M 170 215 C 270 215, 340 100, 520 100 L 520 145 C 340 145, 270 235, 170 235 Z"
                        fill="#dbe4ee"
                        opacity="0.85"
                    />

                    {/* ── FLOW 2: Applied -> Interview (Middle Branch) ── */}
                    <path
                        d="M 170 235 C 260 235, 300 240, 395 240 L 395 285 C 300 285, 260 270, 170 270 Z"
                        fill="#fef0cd"
                        opacity="0.9"
                    />

                    {/* ── FLOW 3: Applied -> Rejected (Bottom Branch) ── */}
                    <path
                        d="M 170 270 C 260 270, 310 345, 415 345 L 415 390 C 310 390, 260 290, 170 290 Z"
                        fill="#fcdede"
                        opacity="0.85"
                    />

                    {/* ── FLOW 4: Interview -> Accepted (Top-Right Branch) ── */}
                    <path
                        d="M 445 245 C 510 245, 570 195, 665 195 L 665 225 C 570 225, 510 265, 445 265 Z"
                        fill="#d7f6e6"
                        opacity="0.9"
                    />

                    {/* ── FLOW 5: Interview -> Declined (Bottom-Right Branch) ── */}
                    <path
                        d="M 445 265 C 515 265, 565 305, 665 305 L 665 345 C 565 345, 515 285, 445 285 Z"
                        fill="#fed6da"
                        opacity="0.9"
                    />

                    {/* ── VERTICAL COLOR END CAPS / ANCHORS ── */}
                    {/* Applied Cap (Blue) */}
                    <rect x="150" y="215" width="16" height="75" rx="3" fill="#6ba6ff" />

                    {/* No Response Cap (Slate/Blue-Grey) */}
                    <rect x="520" y="100" width="16" height="45" rx="3" fill="#9bb3cb" />

                    {/* Interview Junction Accent (Gold) */}
                    <rect x="382" y="240" width="16" height="45" rx="3" fill="#facc15" />

                    {/* Rejected Cap (Coral Red) */}
                    <rect x="415" y="345" width="16" height="45" rx="3" fill="#f87171" />

                    {/* Accepted Cap (Vibrant Green) */}
                    <rect x="665" y="195" width="16" height="30" rx="3" fill="#22c55e" />

                    {/* Declined Cap (Rose Red) */}
                    <rect x="665" y="305" width="16" height="40" rx="3" fill="#fb7185" />

                    {/* ── 3D PILL BADGES WITH NUMBERS & LABELS ── */}

                    {/* 1. APPLIED PILL */}
                    <g transform="translate(170, 230)" filter="url(#pillShadow)">
                        <rect x="0" y="0" width="130" height="46" rx="10" fill="#ffffff" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                        <text x="65" y="28" textAnchor="middle" fill="#14171d" fontSize="15" fontWeight="750" fontFamily="Plus Jakarta Sans, sans-serif">
                            Applied {appliedVal}
                        </text>
                    </g>

                    {/* 2. NO RESPONSE PILL */}
                    <g transform="translate(365, 100)" filter="url(#pillShadow)">
                        <rect x="0" y="0" width="160" height="44" rx="10" fill="#ffffff" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                        <text x="80" y="27" textAnchor="middle" fill="#14171d" fontSize="14" fontWeight="750" fontFamily="Plus Jakarta Sans, sans-serif">
                            No Response {noResponseVal}
                        </text>
                    </g>

                    {/* 3. INTERVIEW PILL */}
                    <g transform="translate(400, 240)" filter="url(#pillShadow)">
                        <rect x="0" y="0" width="135" height="44" rx="10" fill="#ffffff" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                        <text x="67" y="27" textAnchor="middle" fill="#14171d" fontSize="14" fontWeight="750" fontFamily="Plus Jakarta Sans, sans-serif">
                            Interview {interviewVal}
                        </text>
                    </g>

                    {/* 4. REJECTED PILL */}
                    <g transform="translate(290, 345)" filter="url(#pillShadow)">
                        <rect x="0" y="0" width="135" height="44" rx="10" fill="#ffffff" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                        <text x="67" y="27" textAnchor="middle" fill="#14171d" fontSize="14" fontWeight="750" fontFamily="Plus Jakarta Sans, sans-serif">
                            Rejected {rejectedVal}
                        </text>
                    </g>

                    {/* 5. ACCEPTED PILL */}
                    <g transform="translate(545, 188)" filter="url(#pillShadow)">
                        <rect x="0" y="0" width="135" height="44" rx="10" fill="#ffffff" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                        <text x="67" y="27" textAnchor="middle" fill="#14171d" fontSize="14" fontWeight="750" fontFamily="Plus Jakarta Sans, sans-serif">
                            Accepted {acceptedVal}
                        </text>
                    </g>

                    {/* 6. DECLINED PILL */}
                    <g transform="translate(555, 303)" filter="url(#pillShadow)">
                        <rect x="0" y="0" width="130" height="44" rx="10" fill="#ffffff" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                        <text x="65" y="27" textAnchor="middle" fill="#14171d" fontSize="14" fontWeight="750" fontFamily="Plus Jakarta Sans, sans-serif">
                            Declined {declinedVal}
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
