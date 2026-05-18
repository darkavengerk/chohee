// screens/upload-dashboard.jsx — 곡 업로드 플로우 + 크리에이터 대시보드

/* ─────────────────────────────────────────────────────────────
   Upload Flow — 곡 업로드 (3 step) 
   왼쪽에 단계 표시, 오른쪽에 폼
   ───────────────────────────────────────────────────────────── */

function UploadScreen() {
  const [step, setStep] = useState(2);  // showing step 2 visually
  const [encoding, setEncoding] = useState(72);

  // Animate encoding progress
  useEffect(() => {
    const id = setInterval(() => {
      setEncoding(e => e >= 100 ? 0 : Math.min(100, e + 2));
    }, 300);
    return () => clearInterval(id);
  }, []);

  const steps = [
    { id: 1, label: "파일 업로드",   sub: "오디오 + 커버" },
    { id: 2, label: "정보 작성",     sub: "제목 · 가사 · 메타" },
    { id: 3, label: "공개 설정",     sub: "공개 범위 · 라이선스" },
  ];

  return (
    <div className="chohee" style={{ display: "flex", height: "100%", background: "var(--bg-0)" }}>
      <Sidebar active="upload-song"/>
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <TopBar/>

        <div style={{ padding: "32px 40px 80px" }}>

          {/* Page header — what & branching */}
          <header style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em",
                textTransform: "uppercase", marginBottom: 12 }}>업로드</div>
              <h1 className="serif" style={{ fontSize: 40, fontWeight: 500, letterSpacing: "0.005em" }}>
                완성된 곡을 올립니다
              </h1>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost">임시 저장</Btn>
              <Btn variant="outline">취소</Btn>
            </div>
          </header>

          {/* What type — branching tabs (currently 곡) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 40 }}>
            {[
              { id: "song",   label: "곡",   sub: "오디오 + 가사", icon: Ico.music, active: true },
              { id: "lyrics", label: "가사", sub: "음악 없이 가사만", icon: Ico.pen },
              { id: "album",  label: "앨범", sub: "여러 곡/가사 묶기", icon: Ico.album },
            ].map(t => (
              <button key={t.id}
                style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 14,
                  padding: "16px 20px", textAlign: "left",
                  background: t.active ? "color-mix(in oklch, var(--accent) 14%, var(--bg-1))" : "var(--bg-1)",
                  border: `1px solid ${t.active ? "color-mix(in oklch, var(--accent) 36%, transparent)" : "var(--bd-1)"}`,
                  color: t.active ? "var(--fg-1)" : "var(--fg-2)",
                  borderRadius: "var(--r-lg)", cursor: "pointer", fontFamily: "var(--font-sans)",
                  transition: "all var(--t-fast)",
                }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--r-md)",
                  background: t.active ? "var(--accent)" : "var(--bg-3)",
                  color: t.active ? "var(--accent-fg)" : "var(--fg-2)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon d={t.icon} size={18}/>
                </div>
                <div>
                  <div className="serif" style={{ fontSize: 18, fontWeight: 500, color: "var(--fg-1)" }}>{t.label}</div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 2 }}>{t.sub}</div>
                </div>
                {t.active && <Icon d={Ico.check} size={18} style={{ color: "var(--accent)" }}/>}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 56 }}>

            {/* Step rail */}
            <aside style={{ position: "sticky", top: 100, alignSelf: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {steps.map((s, i) => {
                  const done = s.id < step;
                  const active = s.id === step;
                  return (
                    <div key={s.id} style={{ display: "flex", gap: 14, padding: "12px 12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: done ? "var(--accent)" : active ? "transparent" : "transparent",
                          border: `1.5px solid ${done || active ? "var(--accent)" : "var(--bd-2)"}`,
                          color: done ? "var(--accent-fg)" : active ? "var(--accent)" : "var(--fg-3)",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 600,
                        }}>
                          {done ? <Icon d={Ico.check} size={12}/> : s.id}
                        </div>
                        {i < steps.length - 1 && (
                          <div style={{ width: 1.5, height: 40, background: done ? "var(--accent)" : "var(--bd-1)" }}/>
                        )}
                      </div>
                      <div style={{ paddingTop: 2 }}>
                        <div style={{ fontSize: 13, fontWeight: active ? 600 : 500,
                          color: active ? "var(--fg-1)" : "var(--fg-3)" }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 2 }}>{s.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* File side — already uploaded card */}
              <div style={{ marginTop: 28, padding: 18, background: "var(--bg-1)",
                border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--fg-3)", marginBottom: 14 }}>업로드한 파일</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "var(--r-md)",
                    background: "var(--bg-3)", color: "var(--accent)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={Ico.music} size={16}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>새벽-라디오-final.wav</div>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 2 }}>32.4 MB · 3:48</div>
                  </div>
                </div>
                <Progress value={encoding} label={encoding < 100 ? "인코딩 중…" : "인코딩 완료"}/>
              </div>
            </aside>

            {/* Form area */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

              <Section title="기본 정보">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input label="곡 제목" value="새벽 세 시의 라디오" onChange={() => {}}/>
                  <Input label="아티스트명" value="유진" onChange={() => {}}/>
                  <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 6, fontWeight: 500 }}>커버 아트</div>
                      <Cover id="upload-cover" title="새벽 세 시의 라디오" size={184} radius="var(--r-md)"/>
                    </div>
                    <Textarea label="곡 소개 (선택)" rows={4} value={"새벽 세 시, 라디오에서 흘러나오는 낯선 목소리에 관한 곡.\n어쿠스틱 기타와 피아노가 중심이 되는 슬로우 발라드."} onChange={() => {}}/>
                  </div>
                </div>
              </Section>

              <Section title="가사" sub="가사가 노래의 무게중심입니다. 줄바꿈은 그대로 보존됩니다.">
                <Textarea rows={10} serif value={`새벽 세 시의 라디오\n낯선 목소리가 흘러나와\n나는 깨어 있는 채로 듣는다\n\n창문 너머에는 비가 오고\n비는 아무에게도 닿지 않는다\n나는 그것을 약속이라고 부르기로 했다`} onChange={() => {}}/>
                <div style={{ display: "flex", gap: 6, marginTop: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--fg-3)", marginRight: 6 }}>제안:</span>
                  <Chip size="sm" icon={Ico.sparkle}>맞춤법 검사</Chip>
                  <Chip size="sm" icon={Ico.sparkle}>줄바꿈 다듬기</Chip>
                </div>
              </Section>

              <Section title="장르 · 무드">
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 10, fontWeight: 500 }}>장르 (최대 3개)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["발라드", "어쿠스틱", "재즈", "포크", "신스팝", "인디", "보사노바", "엠비언트"].map((g, i) => (
                      <Chip key={g} active={i < 2}>{g}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 10, fontWeight: 500 }}>무드</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["새벽", "고요함", "서정", "비 오는 날", "혼자", "위로", "차분함", "그리움"].map((m, i) => (
                      <Chip key={m} active={[0, 2, 6].includes(i)}>{m}</Chip>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="기술 정보 (자동 감지)" sub="잘못된 항목은 직접 수정할 수 있습니다.">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                  <Input label="BPM" value="72" onChange={() => {}}/>
                  <Input label="키" value="F# minor" onChange={() => {}}/>
                  <Input label="길이" value="3:48" onChange={() => {}}/>
                  <Input label="샘플레이트" value="44.1kHz" onChange={() => {}}/>
                </div>
                <div style={{ marginTop: 14 }}>
                  <Input label="AI 생성 도구 (선택)" value="Suno v4" placeholder="Suno, Udio 등" onChange={() => {}} hint="AI 도구로 생성한 곡이라면 어떤 도구를 사용했는지 표기해주세요."/>
                </div>
              </Section>

              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--bd-1)" }}>
                <Btn variant="ghost" icon={<path d="m15 6-6 6 6 6"/>}>이전</Btn>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn variant="outline">미리보기</Btn>
                  <Btn variant="primary" iconRight={Ico.arrow}>공개 설정으로</Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <div style={{ padding: 28, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
      <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: sub ? 6 : 18, letterSpacing: "0.005em" }}>{title}</h3>
      {sub && <p style={{ fontSize: 12.5, color: "var(--fg-3)", marginBottom: 18, wordBreak: "keep-all" }}>{sub}</p>}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Creator Dashboard — 본인 콘텐츠 통합 관리
   ───────────────────────────────────────────────────────────── */

function DashboardScreen() {
  const [tab, setTab] = useState("requests");
  return (
    <div className="chohee" style={{ display: "flex", height: "100%", background: "var(--bg-0)" }}>
      <Sidebar active="library"/>
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <TopBar/>

        <div style={{ padding: "32px 40px 80px" }}>
          <header style={{ marginBottom: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em",
                textTransform: "uppercase", marginBottom: 12 }}>대시보드</div>
              <h1 className="serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: "0.005em" }}>유진의 작업실</h1>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="outline" icon={Ico.album}>앨범 엮기</Btn>
              <Btn variant="outline" icon={Ico.pen}>가사 쓰기</Btn>
              <Btn variant="primary" icon={Ico.plus}>곡 올리기</Btn>
            </div>
          </header>

          {/* Stat strip */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 36 }}>
            <Stat label="이번 달 재생" value="12,847" delta="+18%"/>
            <Stat label="팔로워" value="1,243" delta="+24"/>
            <Stat label="공개 곡" value="14"/>
            <Stat label="공개 가사" value="6" hint="3개 음악 대기 중"/>
            <Stat label="좋아요" value="2,108" delta="+142"/>
          </section>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--bd-1)" }}>
            {[
              { id: "requests", label: "음악 생성 요청", count: 3 },
              { id: "songs",    label: "내 곡",        count: 14 },
              { id: "lyrics",   label: "내 가사",      count: 6 },
              { id: "albums",   label: "내 앨범",      count: 2 },
              { id: "stats",    label: "통계",        count: null },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: "12px 16px", background: "transparent", border: "none",
                  borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`,
                  color: tab === t.id ? "var(--fg-1)" : "var(--fg-3)",
                  fontWeight: tab === t.id ? 600 : 500, fontSize: 13.5,
                  cursor: "pointer", fontFamily: "var(--font-sans)",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  transition: "all var(--t-fast)",
                }}>
                {t.label}
                {t.count !== null && (
                  <span className="mono" style={{
                    fontSize: 10, padding: "1px 6px", borderRadius: "var(--r-pill)",
                    background: tab === t.id ? "var(--accent-soft)" : "var(--bg-2)",
                    color: tab === t.id ? "var(--accent)" : "var(--fg-3)",
                  }}>{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Music generation requests — primary content */}
          <section style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Active generating request */}
              <RequestCard
                status="generating"
                title="겨울 우체국"
                author="수민"
                hue={80}
                progress={64}
                snippet="당신에게 부치지 못한 편지가 책상 위에서 다시 잠이 든다…"
                meta="발라드 · 슬로우 · 피아노"
                eta="3분 후 완성"
              />

              <RequestCard
                status="waiting"
                title="흰 손수건"
                author="예린"
                hue={260}
                snippet="주머니 속에 손수건을 잊은 지 오래되었다…"
                meta="포크 · 어쿠스틱"
                action="시작하기"
              />

              <RequestCard
                status="revision"
                title="느린 도시"
                author="준영"
                hue={140}
                snippet="이 도시의 모든 신호등은 빨강에서 시작한다…"
                meta="재즈 · 슬로우"
                note="작가가 새벽 무드를 더 강하게 요청했어요."
                action="수정하기"
              />

            </div>
          </section>

          {/* My recent songs */}
          <section>
            <SectionHead kicker="MY SONGS" title="최근 곡"
              action={<Btn variant="ghost" size="sm" iconRight={Ico.chevron}>전체 보기</Btn>}/>
            <div style={{ background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)",
              padding: 12 }}>
              {[
                { id: "m1", title: "새벽 세 시의 라디오",  plays: 3247, likes: 342, date: "11.14", status: "complete" },
                { id: "m2", title: "비가 내릴 줄 알았어",  plays: 1822, likes: 218, date: "10.28", status: "complete" },
                { id: "m3", title: "여름의 끝",            plays: 1140, likes: 156, date: "09.12", status: "complete" },
                { id: "m4", title: "마지막 라일락",        plays: 988,  likes: 94,  date: "08.30", status: "complete" },
              ].map((s, i) => (
                <div key={s.id} style={{
                  display: "grid", gridTemplateColumns: "44px 1fr 100px 100px 80px auto", alignItems: "center", gap: 16,
                  padding: "10px 12px", borderRadius: "var(--r-md)",
                  borderBottom: i < 3 ? "1px solid var(--bd-1)" : "none",
                }}>
                  <Cover id={`my-${s.id}`} title={s.title} size={44} radius="var(--r-sm)"/>
                  <div className="serif" style={{ fontSize: 14.5, fontWeight: 500 }}>{s.title}</div>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-2)" }}>{s.plays.toLocaleString()} 재생</span>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-2)" }}>♡ {s.likes}</span>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{s.date}</span>
                  <IconBtn icon={Ico.more}/>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, delta, hint }) {
  const positive = delta && delta.startsWith("+");
  return (
    <div style={{ padding: 20, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
      <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span className="serif" style={{ fontSize: 30, fontWeight: 500, letterSpacing: "0.005em" }}>{value}</span>
        {delta && <span className="mono" style={{ fontSize: 11, color: positive ? "var(--success)" : "var(--danger)" }}>{delta}</span>}
      </div>
      {hint && <div style={{ fontSize: 11, color: "var(--st-progress)", marginTop: 8 }}>· {hint}</div>}
    </div>
  );
}

function RequestCard({ status, title, author, hue, snippet, meta, progress, eta, note, action }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "auto 1fr 240px",
      gap: 24, alignItems: "center",
      padding: 24,
      background: "var(--bg-1)",
      border: `1px solid ${status === "generating" ? "color-mix(in oklch, var(--accent) 30%, transparent)" : "var(--bd-1)"}`,
      borderRadius: "var(--r-lg)",
      position: "relative",
      overflow: "hidden",
    }}>
      {status === "generating" && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
          background: "var(--accent)",
        }}/>
      )}
      <Avatar name={author?.[0]} size={48} hue={hue}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <StatusBadge status={status}/>
          <span style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{meta}</span>
        </div>
        <div className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 4, letterSpacing: "0.005em" }}>{title}</div>
        <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginBottom: 10 }}>by {author}</div>
        <div className="serif" style={{ fontSize: 13, color: "var(--fg-2)", fontStyle: "italic", lineHeight: 1.65,
          overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical",
          letterSpacing: "0.005em", wordBreak: "keep-all", maxWidth: 600 }}>"{snippet}"</div>
        {note && (
          <div style={{ marginTop: 12, padding: "8px 12px", background: "color-mix(in oklch, var(--st-revision) 12%, transparent)",
            border: "1px solid color-mix(in oklch, var(--st-revision) 28%, transparent)",
            borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--fg-2)", maxWidth: 600 }}>
            <span style={{ color: "var(--st-revision)", fontWeight: 600 }}>피드백:</span> {note}
          </div>
        )}
      </div>
      <div>
        {status === "generating" && progress != null && (
          <>
            <Progress value={progress} label="음악 생성 중"/>
            {eta && <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8, textAlign: "right" }}>{eta}</div>}
          </>
        )}
        {status !== "generating" && action && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn variant="primary" icon={Ico.sparkle}>{action}</Btn>
            <Btn variant="ghost" size="sm">가사 보기</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { UploadScreen, DashboardScreen });
