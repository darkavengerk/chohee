// screens/search-write-login.jsx — 검색 결과 · 가사 작성 에디터 · 로그인(카카오)

/* ═════════════════════════════════════════════════════════════
   Search Results — 통합 검색 (곡/가사/앨범/창작자)
   카테고리별 결과를 한 페이지에 섹션화. 상단에 결과 요약.
   ═════════════════════════════════════════════════════════════ */

function SearchScreen() {
  const [tab, setTab] = useState("all");
  const query = "새벽";

  const tabs = [
    { id: "all",     label: "전체",   count: 87 },
    { id: "songs",   label: "곡",     count: 24 },
    { id: "lyrics",  label: "가사",   count: 38 },
    { id: "albums",  label: "앨범",   count: 11 },
    { id: "people",  label: "창작자", count: 14 },
  ];

  const topSongs = [
    { id: "ts1", title: "새벽 세 시의 라디오", artist: "유진",   duration: 228, plays: 3247 },
    { id: "ts2", title: "새벽 두 시 반",       artist: "한솔",   duration: 192, plays: 1280 },
    { id: "ts3", title: "새벽의 파동",         artist: "민서",   duration: 213, plays: 942 },
  ];

  const topLyrics = [
    { id: "tl1", title: "새벽 우체국",  author: "수민",   status: "generating", lines: 22,
      preview: "당신에게 부치지 못한 편지가\n책상 위에서 다시 잠이 든다" },
    { id: "tl2", title: "새벽 다섯 시", author: "예린",   status: "waiting",    lines: 16,
      preview: "새벽 다섯 시의 거리에는\n잠들지 못한 사람들의 그림자만 남는다" },
    { id: "tl3", title: "새벽의 약속",  author: "도윤",   status: "complete",   lines: 28,
      preview: "다시 새벽이 오면 너에게 갈게\n그 약속을 한 사람은 이미 잊었다" },
  ];

  const topPeople = [
    { id: "p1", name: "유진",  hue: 40,  followers: 1243, songs: 14, bio: "새벽과 비를 자주 쓰는 사람" },
    { id: "p2", name: "한솔",  hue: 70,  followers: 982,  songs: 9,  bio: "도시의 정거장을 기록합니다" },
    { id: "p3", name: "수민",  hue: 80,  followers: 342,  songs: 0,  bio: "가사만 씁니다", lyricsOnly: true },
  ];

  const albums = [
    { id: "sa1", title: "새벽의 다섯 가지", artist: "유진",   tracks: 5, concept: "잠들지 못한 다섯 개의 새벽" },
    { id: "sa2", title: "라디오 시리즈",    artist: "민서 외",  tracks: 6, concept: "새벽에 들리는 라디오들" },
    { id: "sa3", title: "긴 밤",           artist: "한솔",     tracks: 4, concept: "새벽까지 이어진 도시 풍경" },
  ];

  return (
    <div className="chohee" style={{ display: "flex", height: "100%", background: "var(--bg-0)" }}>
      <Sidebar active="search"/>
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <TopBar/>

        <div style={{ padding: "32px 40px 120px" }}>

          {/* Result header */}
          <header style={{ marginBottom: 32 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em",
              textTransform: "uppercase", marginBottom: 14 }}>검색 결과 · 87건</div>
            <h1 className="serif" style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.2, letterSpacing: "0.005em",
              wordBreak: "keep-all" }}>
              "<span style={{ color: "var(--accent)" }}>{query}</span>" 에 관한 87개의 작품
            </h1>
            <p className="serif" style={{ fontSize: 15, color: "var(--fg-3)", marginTop: 14, fontStyle: "italic",
              letterSpacing: "0.005em" }}>
              곡 24 · 가사 38 · 앨범 11 · 창작자 14
            </p>
          </header>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid var(--bd-1)" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: "12px 18px", background: "transparent", border: "none",
                  borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`,
                  color: tab === t.id ? "var(--fg-1)" : "var(--fg-3)",
                  fontWeight: tab === t.id ? 600 : 500, fontSize: 13.5,
                  cursor: "pointer", fontFamily: "var(--font-sans)",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  transition: "all var(--t-fast)",
                }}>
                {t.label}
                <span className="mono" style={{ fontSize: 10.5,
                  color: tab === t.id ? "var(--accent)" : "var(--fg-4)" }}>{t.count}</span>
              </button>
            ))}
            <div style={{ flex: 1 }}/>
            <div style={{ display: "flex", gap: 8, alignItems: "center", paddingBottom: 8 }}>
              <span style={{ fontSize: 11.5, color: "var(--fg-3)" }}>정렬:</span>
              <Chip size="sm" active>관련도</Chip>
              <Chip size="sm">최신순</Chip>
              <Chip size="sm">인기순</Chip>
            </div>
          </div>

          {/* Top match — single highlighted result */}
          <section style={{ marginBottom: 48 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em",
              textTransform: "uppercase", marginBottom: 16 }}>TOP MATCH</div>
            <div style={{
              padding: "28px 32px",
              background: "linear-gradient(135deg, color-mix(in oklch, var(--accent) 14%, var(--bg-1)) 0%, var(--bg-1) 80%)",
              border: "1px solid color-mix(in oklch, var(--accent) 24%, transparent)",
              borderRadius: "var(--r-xl)",
              display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center",
            }}>
              <Cover id="search-top" title="새벽 세 시의 라디오" size={128} radius="var(--r-md)"/>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <StatusBadge status="complete" size="sm"/>
                  <span style={{ fontSize: 11.5, color: "var(--fg-3)" }}>곡 · 발라드 · 3:48</span>
                </div>
                <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, marginBottom: 6, letterSpacing: "0.005em" }}>
                  새<span style={{ background: "color-mix(in oklch, var(--accent) 36%, transparent)",
                    padding: "0 2px", borderRadius: 3 }}>벽</span> 세 시의 라디오
                </h2>
                <div style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 14 }}>유진 · 3,247회 재생 · 342 ♡</div>
                <div className="serif" style={{ fontSize: 13.5, color: "var(--fg-2)", fontStyle: "italic",
                  letterSpacing: "0.005em", lineHeight: 1.65, maxWidth: 540, wordBreak: "keep-all" }}>
                  "새<span style={{ background: "color-mix(in oklch, var(--accent) 36%, transparent)", padding: "0 2px", borderRadius: 3 }}>벽</span> 세 시의 라디오, 낯선 목소리가 흘러나와…"
                </div>
              </div>
              <PlayButton size={56}/>
            </div>
          </section>

          {/* Songs */}
          <section style={{ marginBottom: 48 }}>
            <SectionHead kicker="SONGS · 24" title="곡"
              action={<Btn variant="ghost" size="sm" iconRight={Ico.chevron}>전체 보기</Btn>}/>
            <div style={{ background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)",
              padding: 12 }}>
              {topSongs.map((s, i) => (
                <div key={s.id} style={{
                  display: "grid", gridTemplateColumns: "44px 1fr 100px 80px auto", alignItems: "center", gap: 16,
                  padding: "10px 12px", borderBottom: i < 2 ? "1px solid var(--bd-1)" : "none",
                }}>
                  <Cover id={`ss-${s.id}`} title={s.title} size={44} radius="var(--r-sm)"/>
                  <div>
                    <div className="serif" style={{ fontSize: 14.5, fontWeight: 500 }}>
                      <HighlightedTitle text={s.title} q={query}/>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{s.artist}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-2)" }}>{s.plays.toLocaleString()} 재생</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{fmtTime(s.duration)}</span>
                  <PlayButton size={32} accent={false}/>
                </div>
              ))}
            </div>
          </section>

          {/* Lyrics — show with preview lines so search context is visible */}
          <section style={{ marginBottom: 48 }}>
            <SectionHead kicker="LYRICS · 38" title="가사"
              action={<Btn variant="ghost" size="sm" iconRight={Ico.chevron}>전체 보기</Btn>}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {topLyrics.map(l => (
                <div key={l.id} style={{
                  padding: 22, background: "var(--bg-1)", border: "1px solid var(--bd-1)",
                  borderRadius: "var(--r-lg)", display: "flex", flexDirection: "column", gap: 14, minHeight: 220,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <StatusBadge status={l.status} size="sm"/>
                    <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>{l.lines} lines</span>
                  </div>
                  <div className="serif" style={{ fontSize: 14, lineHeight: 1.85, color: "var(--fg-2)",
                    letterSpacing: "0.01em", flex: 1, wordBreak: "keep-all", whiteSpace: "pre-wrap" }}>
                    <HighlightedTitle text={l.preview} q={query}/>
                  </div>
                  <div>
                    <div className="serif" style={{ fontSize: 17, fontWeight: 500 }}>
                      <HighlightedTitle text={l.title} q={query}/>
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 4 }}>{l.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Creators */}
          <section style={{ marginBottom: 48 }}>
            <SectionHead kicker="PEOPLE · 14" title="창작자"
              action={<Btn variant="ghost" size="sm" iconRight={Ico.chevron}>전체 보기</Btn>}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {topPeople.map(p => (
                <div key={p.id} style={{
                  padding: 22, background: "var(--bg-1)", border: "1px solid var(--bd-1)",
                  borderRadius: "var(--r-lg)", display: "flex", gap: 16, alignItems: "center",
                }}>
                  <Avatar name={p.name[0]} size={56} hue={p.hue}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 2 }}>
                      <HighlightedTitle text={p.name} q={query}/>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--fg-3)", marginBottom: 8 }}>
                      {p.followers.toLocaleString()} 팔로워 · {p.lyricsOnly ? "가사" : "곡"} {p.lyricsOnly ? 14 : p.songs}편
                    </div>
                    <div className="serif" style={{ fontSize: 12.5, color: "var(--fg-2)", fontStyle: "italic",
                      letterSpacing: "0.005em" }}>"{p.bio}"</div>
                  </div>
                  <FollowButton size="sm"/>
                </div>
              ))}
            </div>
          </section>

          {/* Albums */}
          <section>
            <SectionHead kicker="ALBUMS · 11" title="앨범"
              action={<Btn variant="ghost" size="sm" iconRight={Ico.chevron}>전체 보기</Btn>}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {albums.map(a => <AlbumCard key={a.id} album={a}/>)}
            </div>
          </section>

        </div>
        <FooterPlayer track={{ id: "s1", title: "새벽 세 시의 라디오", artist: "유진", duration: 228 }}/>
      </main>
    </div>
  );
}

function HighlightedTitle({ text, q }) {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q})`, "g"));
  return parts.map((p, i) => p === q
    ? <span key={i} style={{ background: "color-mix(in oklch, var(--accent) 30%, transparent)",
        padding: "0 2px", borderRadius: 3, color: "var(--fg-1)" }}>{p}</span>
    : <span key={i}>{p}</span>);
}


/* ═════════════════════════════════════════════════════════════
   Lyrics Writer — 가사 작성 에디터
   왼쪽: 시집 같은 에디터 (큰 명조, 행간 넓게)
   오른쪽: 음악 생성 요청 옵션 패널 (장르, 무드, 참고곡)
   ═════════════════════════════════════════════════════════════ */

function WriteScreen() {
  const [title, setTitle] = useState("겨울 우체국");
  const [body, setBody] = useState(`당신에게 부치지 못한 편지가
책상 위에서 다시 잠이 든다
계절을 두 번 보내고도
아직 우표를 사지 못한 채

나는 매일 아침 우체국 앞을 지나고
매일 저녁 빈 손으로 돌아온다
창구의 사람은 나를 알아보고
나는 그것이 부끄러워 길을 돌아간다

내가 부치지 않은 편지가
당신에게 닿지 않는 것은
계절 때문이 아니라
내 손이 멈춰 있기 때문이라고
나는 이제 안다`);

  const lines  = body.split("\n").length;
  const chars  = body.replace(/\s/g, "").length;
  const stanzas = body.split(/\n\s*\n/).filter(s => s.trim()).length;

  return (
    <div className="chohee" style={{ display: "flex", height: "100%", background: "var(--bg-0)" }}>
      <Sidebar active="write-lyrics"/>
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {/* Lean topbar — writing mode minimal chrome */}
        <div style={{
          display: "flex", alignItems: "center", padding: "16px 28px",
          borderBottom: "1px solid var(--bd-1)",
          background: "color-mix(in oklch, var(--bg-0) 88%, transparent)",
          backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 4,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconBtn icon={<path d="m15 6-6 6 6 6"/>} size={32}/>
            <span style={{ fontSize: 13, color: "var(--fg-3)" }}>가사 쓰기</span>
            <span style={{ fontSize: 13, color: "var(--fg-4)" }}>·</span>
            <span style={{ fontSize: 13, color: "var(--fg-3)" }}>임시 저장됨 · 방금 전</span>
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" icon={Ico.heart}>미리보기</Btn>
            <Btn variant="outline">초안으로 저장</Btn>
            <Btn variant="primary" icon={Ico.sparkle}>발행 · 음악 요청</Btn>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", height: "calc(100% - 65px)", minHeight: 1700 }}>

          {/* Editor — left, generous */}
          <section style={{ padding: "56px 80px", overflow: "auto", borderRight: "1px solid var(--bd-1)" }}>

            {/* Title input — large serif, no chrome */}
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목"
              style={{
                width: "100%", padding: "0 0 20px", border: "none", outline: "none",
                background: "transparent", color: "var(--fg-1)",
                fontFamily: "var(--font-serif)", fontSize: 56, fontWeight: 400,
                letterSpacing: "0.005em", lineHeight: 1.1, marginBottom: 8,
                borderBottom: "1px solid var(--bd-1)",
              }}/>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36,
              fontSize: 11.5, color: "var(--fg-3)" }}>
              <Avatar name="유" size={24} hue={40}/>
              <span>유진</span>
              <span>·</span>
              <span className="mono">{lines}행 · {chars}자 · {stanzas}연</span>
              <span>·</span>
              <span>마지막 수정: 방금 전</span>
            </div>

            {/* Formatting toolbar — floating */}
            <div style={{ display: "flex", gap: 4, marginBottom: 28, padding: "8px 12px",
              background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)",
              alignSelf: "flex-start", width: "fit-content" }}>
              <ToolBtn label="Bold" icon={<text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor" stroke="none">B</text>}/>
              <ToolBtn label="Italic" icon={<text x="12" y="17" textAnchor="middle" fontSize="14" fontStyle="italic" fill="currentColor" stroke="none">I</text>}/>
              <Divider/>
              <ToolBtn label="강조" icon={<g><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></g>}/>
              <ToolBtn label="후렴" icon={<g><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h6"/></g>}/>
              <ToolBtn label="연 구분" icon={<g><path d="M4 8h16"/><path d="M4 16h16"/></g>}/>
              <Divider/>
              <ToolBtn label="AI 도우미" icon={Ico.sparkle} accent/>
            </div>

            {/* Lyrics textarea — generous serif */}
            <textarea value={body} onChange={e => setBody(e.target.value)}
              style={{
                width: "100%", minHeight: 720, padding: 0, border: "none", outline: "none",
                background: "transparent", color: "var(--fg-1)",
                fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400,
                lineHeight: 1.95, letterSpacing: "0.01em",
                resize: "vertical", wordBreak: "keep-all",
              }}/>

            {/* AI hint footer — gentle suggestions inline */}
            <div style={{ marginTop: 32, padding: "16px 20px",
              background: "color-mix(in oklch, var(--accent) 10%, var(--bg-1))",
              border: "1px solid color-mix(in oklch, var(--accent) 22%, transparent)",
              borderRadius: "var(--r-md)", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Icon d={Ico.sparkle} size={18} style={{ color: "var(--accent)", marginTop: 2 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.7, wordBreak: "keep-all" }}>
                  "내 손이 멈춰 있기 때문이라고" — 이 행이 곡 전체의 무게중심이 될 것 같습니다.
                  후렴으로 한 번 더 등장시키면 어떨까요?
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Btn variant="ghost" size="sm">적용</Btn>
                  <Btn variant="ghost" size="sm">건너뛰기</Btn>
                </div>
              </div>
            </div>
          </section>

          {/* Right panel — music request options */}
          <aside style={{ padding: "32px 28px", overflow: "auto", display: "flex", flexDirection: "column", gap: 28,
            background: "var(--bg-0)" }}>

            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em",
                textTransform: "uppercase", marginBottom: 12 }}>음악 요청</div>
              <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3, letterSpacing: "0.005em",
                marginBottom: 8 }}>
                어떤 곡으로 만들어졌으면 하나요?
              </h2>
              <p style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.65, wordBreak: "keep-all" }}>
                힌트는 음악가에게 전달되지만, 결과를 강제하지는 않습니다.
              </p>
            </div>

            <Card label="장르 힌트" hint="최대 2개">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["발라드", "포크", "재즈", "어쿠스틱", "엠비언트", "보사노바", "신스팝", "인디"].map((g, i) => (
                  <Chip key={g} active={[0, 3].includes(i)} size="sm">{g}</Chip>
                ))}
              </div>
            </Card>

            <Card label="무드" hint="최대 3개">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["슬로우", "고요함", "겨울", "그리움", "혼자", "위로", "비 오는 날", "새벽"].map((m, i) => (
                  <Chip key={m} active={[0, 1, 2].includes(i)} size="sm">{m}</Chip>
                ))}
              </div>
            </Card>

            <Card label="템포" hint="BPM">
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {["느리게 (60-80)", "보통 (80-110)", "빠르게 (110+)"].map((s, i) => (
                  <Chip key={s} active={i === 0} size="sm">{s}</Chip>
                ))}
              </div>
            </Card>

            <Card label="중심 악기">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["피아노", "어쿠스틱 기타", "현악기", "전자음", "신시사이저", "퍼커션"].map((m, i) => (
                  <Chip key={m} active={[0, 1].includes(i)} size="sm">{m}</Chip>
                ))}
              </div>
            </Card>

            <Card label="참고하고 싶은 곡" hint="선택">
              <Input value="" placeholder="제목으로 검색…" icon={Ico.search} onChange={() => {}}/>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, padding: 8,
                background: "var(--bg-2)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)" }}>
                <Cover id="ref-song" title="새벽 세 시의 라디오" size={36} radius="var(--r-sm)"/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="serif" style={{ fontSize: 12.5, fontWeight: 500 }}>새벽 세 시의 라디오</div>
                  <div style={{ fontSize: 10.5, color: "var(--fg-3)" }}>유진</div>
                </div>
                <IconBtn icon={Ico.x} size={24}/>
              </div>
            </Card>

            <Card label="자유로운 한마디" hint="음악가에게">
              <Textarea rows={3} placeholder="예: 후렴이 너무 화려해지지 않았으면 합니다."
                value="" onChange={() => {}}/>
            </Card>

            <Card label="누가 만들 수 있나요?">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <RadioRow active label="모든 음악가"      sub="누구나 작업할 수 있습니다"/>
                <RadioRow       label="팔로워만"          sub="당신을 팔로우한 사람만"/>
                <RadioRow       label="운영자에게 부탁"   sub="초희 운영팀이 우선 작업"/>
              </div>
            </Card>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8,
              padding: 16, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)" }}>
              <div style={{ fontSize: 11.5, color: "var(--fg-3)" }}>예상 작업 의향</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="serif" style={{ fontSize: 26, fontWeight: 500, color: "var(--accent)" }}>4-6명</span>
                <span style={{ fontSize: 11, color: "var(--fg-3)", flex: 1, lineHeight: 1.5 }}>
                  비슷한 가사 · 무드의 평균<br/>3일 이내 작업 시작
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ToolBtn({ icon, label, accent }) {
  return (
    <button title={label}
      style={{
        width: 32, height: 32, padding: 0, background: "transparent",
        border: "none", borderRadius: "var(--r-sm)", cursor: "pointer",
        color: accent ? "var(--accent)" : "var(--fg-2)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "background var(--t-fast)",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-2)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <Icon d={icon} size={16}/>
    </button>
  );
}
function Divider() { return <div style={{ width: 1, alignSelf: "stretch", background: "var(--bd-1)", margin: "0 4px" }}/>; }

function Card({ label, hint, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.05em", color: "var(--fg-2)" }}>{label}</span>
        {hint && <span style={{ fontSize: 10.5, color: "var(--fg-4)" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function RadioRow({ active, label, sub }) {
  return (
    <label style={{
      display: "flex", gap: 12, padding: "10px 12px", alignItems: "flex-start",
      background: active ? "color-mix(in oklch, var(--accent) 10%, transparent)" : "var(--bg-1)",
      border: `1px solid ${active ? "color-mix(in oklch, var(--accent) 30%, transparent)" : "var(--bd-1)"}`,
      borderRadius: "var(--r-md)", cursor: "pointer",
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%", marginTop: 1,
        border: `1.5px solid ${active ? "var(--accent)" : "var(--bd-2)"}`,
        background: active ? "var(--accent)" : "transparent",
        boxShadow: active ? "inset 0 0 0 3px var(--bg-1)" : "none",
        flexShrink: 0,
      }}/>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg-1)" }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{sub}</div>
      </div>
    </label>
  );
}


/* ═════════════════════════════════════════════════════════════
   Login — 카카오 로그인
   왼쪽: 큰 가사 인용 패널 (브랜드의 정체성을 곧장 보여줌)
   오른쪽: 미니멀한 로그인 카드
   ═════════════════════════════════════════════════════════════ */

function LoginScreen() {
  return (
    <div className="chohee" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr",
      height: "100%", background: "var(--bg-0)" }}>

      {/* Left — typographic identity */}
      <section style={{
        position: "relative",
        padding: "56px 64px",
        background: "linear-gradient(160deg, color-mix(in oklch, var(--accent) 18%, var(--bg-1)) 0%, var(--bg-0) 80%)",
        borderRight: "1px solid var(--bd-1)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        overflow: "hidden",
      }} className="grain">

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 2 }}>
          <Logo size={32}/>
          <span className="serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: "0.01em" }}>초희</span>
          <span style={{ fontSize: 12, color: "var(--fg-3)", marginLeft: 4 }}>· chohee</span>
        </div>

        {/* Centered quote */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 540 }}>
          <div className="serif" style={{ fontSize: 13, color: "var(--accent)",
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 24, fontStyle: "italic" }}>
            가사가 음악이 되는 공간
          </div>
          <div className="lyrics lyrics--xl" style={{ fontSize: 40, lineHeight: 1.85,
            color: "var(--fg-1)", letterSpacing: "0.005em" }}>
            새벽 세 시의 라디오{"\n"}
            낯선 목소리가 흘러나와{"\n"}
            <span style={{ color: "var(--accent)" }}>나는 깨어 있는 채로 듣는다</span>
          </div>
          <div style={{ marginTop: 32, fontFamily: "var(--font-sans)", fontSize: 12,
            color: "var(--fg-3)", letterSpacing: 0 }}>
            — 유진, 「새벽 세 시의 라디오」 中
          </div>
        </div>

        {/* Bottom footnote */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between",
          alignItems: "center", fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>
          <span>2,341명의 창작자 · 8,742편의 가사 · 4,108곡</span>
          <span>v 0.4.0</span>
        </div>

        {/* Decorative blur */}
        <div style={{ position: "absolute", left: -120, top: -120, width: 480, height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in oklch, var(--accent) 30%, transparent) 0%, transparent 60%)",
          filter: "blur(40px)", opacity: 0.5 }}/>
      </section>

      {/* Right — login card */}
      <section style={{
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: 64,
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          <h1 className="serif" style={{ fontSize: 36, fontWeight: 500, lineHeight: 1.2,
            letterSpacing: "0.005em", marginBottom: 12, wordBreak: "keep-all" }}>
            초희에 오신 걸 환영합니다
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--fg-3)", lineHeight: 1.7, marginBottom: 44,
            wordBreak: "keep-all" }}>
            카카오 계정으로 간편하게 시작하세요. 가사를 쓰고, 음악을 만들고, 함께 작품을 엮어갑니다.
          </p>

          {/* Kakao button — original-style branding */}
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", padding: "14px 20px",
            background: "#FEE500", color: "rgba(0, 0, 0, 0.85)",
            border: "none", borderRadius: "var(--r-md)", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600,
            letterSpacing: "-0.005em",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.04) inset, 0 4px 14px oklch(0 0 0 / 0.32)",
            transition: "transform var(--t-fast), filter var(--t-fast)",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            {/* Kakao bubble icon — simple original mark */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 4C6.5 4 2 7.6 2 12c0 2.8 1.9 5.3 4.8 6.7l-1 3.6c-.1.3.3.6.6.4l4.3-2.8c.4 0 .8.1 1.3.1 5.5 0 10-3.6 10-8S17.5 4 12 4Z"/>
            </svg>
            카카오로 시작하기
          </button>

          {/* Secondary — guest browse */}
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", marginTop: 12, padding: "12px 20px",
            background: "transparent", color: "var(--fg-2)",
            border: "1px solid var(--bd-2)", borderRadius: "var(--r-md)", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500,
          }}>
            로그인 없이 둘러보기
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "32px 0",
            fontSize: 11, color: "var(--fg-4)", letterSpacing: "0.06em" }}>
            <div style={{ flex: 1, height: 1, background: "var(--bd-1)" }}/>
            <span>다른 방법으로</span>
            <div style={{ flex: 1, height: 1, background: "var(--bd-1)" }}/>
          </div>

          {/* Future methods — disabled placeholders, soft */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <SocialBtn label="이메일" disabled
              icon={<g><rect x="3" y="6" width="18" height="12" rx="2"/><path d="m3 7 9 6 9-6"/></g>}/>
            <SocialBtn label="Apple" disabled
              icon={<g><path d="M16 4c.5 1.5-.5 3-2 3.5C12 6 13 4.5 14.5 4Z" fill="currentColor"/><path d="M19 17c-.8 1.5-2 3-3.5 3-1 0-1.5-.5-2.5-.5s-1.5.5-2.5.5c-1.5 0-2.7-1.5-3.5-3-1.5-2.6-1.8-7 .5-9 1-.9 2.3-1.2 3.5-.5 1 .6 1.5.6 2.5 0 1.2-.7 2.5-.4 3.5.5-2.6 1.5-2.2 5.5 1.5 6.5-.4 1-1 1.7-1.5 2.5Z" fill="currentColor"/></g>}/>
          </div>

          <div style={{ marginTop: 36, fontSize: 11.5, color: "var(--fg-3)", lineHeight: 1.7, textAlign: "center",
            wordBreak: "keep-all" }}>
            가입은 <a style={{ color: "var(--fg-1)", borderBottom: "1px solid var(--bd-2)" }}>이용약관</a>과 <a style={{ color: "var(--fg-1)", borderBottom: "1px solid var(--bd-2)" }}>개인정보 처리방침</a>에 동의하는 것으로 간주합니다.
          </div>
        </div>
      </section>
    </div>
  );
}

function SocialBtn({ icon, label, disabled }) {
  return (
    <button disabled={disabled} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: "10px 14px", background: "var(--bg-1)", color: "var(--fg-3)",
      border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500,
    }}>
      <Icon d={icon} size={15}/>
      {label}
      {disabled && <span style={{ fontSize: 9.5, color: "var(--fg-4)", marginLeft: 2 }}>곧</span>}
    </button>
  );
}

Object.assign(window, { SearchScreen, WriteScreen, LoginScreen });
