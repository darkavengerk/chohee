// screens/home-album.jsx — 홈/랜딩 + 앨범 페이지

const homeAlbumSongs = [
  { id: "s1", title: "새벽 세 시의 라디오", artist: "유진", duration: 228 },
  { id: "s2", title: "두 정거장 후",       artist: "한솔",  duration: 192 },
  { id: "s3", title: "마지막 라일락",       artist: "유진 × 도윤", duration: 244 },
  { id: "s4", title: "비가 내릴 줄 알았어", artist: "민서",  duration: 201 },
  { id: "s5", title: "파주 가는 길",        artist: "지혁",  duration: 187 },
  { id: "s6", title: "여름의 끝",          artist: "유진",  duration: 213 },
];

const homeAlbumLyrics = [
  {
    id: "l1", title: "겨울 우체국", author: "수민", status: "generating", lines: 22,
    preview: "당신에게 부치지 못한 편지가 책상 위에서 다시 잠이 든다.\n계절을 두 번 보내고도 아직 우표를 사지 못한 채.",
  },
  {
    id: "l2", title: "느린 도시", author: "준영", status: "waiting", lines: 18,
    preview: "이 도시의 모든 신호등은 빨강에서 시작한다.\n나는 그것을 약속이라고 부르기로 했다.",
  },
  {
    id: "l3", title: "흰 손수건", author: "예린", status: "waiting", lines: 26,
    preview: "주머니 속에 손수건을 잊은 지 오래되었다.\n그 속에 접어둔 말도 함께 잊었다.",
  },
];

const homeAlbumAlbums = [
  { id: "a1", title: "정거장 가까이",   artist: "한솔",         tracks: 6, concept: "마지막 정거장에서 첫 정거장까지" },
  { id: "a2", title: "비의 다섯 가지",  artist: "유진",         tracks: 5, concept: "비가 내리는 다섯 개의 풍경" },
  { id: "a3", title: "도시의 낮잠",     artist: "민서 × 도윤",   tracks: 7, concept: "오후 두 시의 도시 소음과 침묵" },
  { id: "a4", title: "이름 없는 것들",   artist: "예린",         tracks: 4, concept: "이름을 잃어버린 것들에 대한 헌사" },
];

function HomeScreen() {
  const [filter, setFilter] = useState("전체");
  const filters = ["전체", "곡", "가사", "앨범"];
  return (
    <div className="chohee" style={{ display: "flex", height: "100%", background: "var(--bg-0)" }}>
      <Sidebar active="home"/>
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <TopBar/>
        <div style={{ padding: "32px 40px 140px" }}>

          {/* Hero — editorial banner */}
          <section style={{
            position: "relative",
            padding: "56px 56px 52px",
            borderRadius: "var(--r-xl)",
            background: "linear-gradient(135deg, color-mix(in oklch, var(--accent) 24%, var(--bg-1)) 0%, var(--bg-1) 70%)",
            border: "1px solid var(--bd-1)",
            overflow: "hidden",
            marginBottom: 48,
          }} className="grain">
            <div style={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--accent)", marginBottom: 18 }}>이번 주의 가사</div>
              <h1 className="serif" style={{ fontSize: 48, fontWeight: 400, lineHeight: 1.18, marginBottom: 20,
                letterSpacing: "0.005em", wordBreak: "keep-all" }}>
                겨울 우체국, 잊혀진 편지에<br/>
                음악을 붙여줄 분을 찾습니다.
              </h1>
              <p className="serif" style={{ fontSize: 16, lineHeight: 1.9, color: "var(--fg-2)",
                letterSpacing: "0.005em", marginBottom: 28, maxWidth: 520, wordBreak: "keep-all" }}>
                수민의 가사는 발라드와 시 사이에 있습니다. 6명의 음악가가 이미 작업 의향을 보였어요.
                먼저 가사를 천천히 읽어주세요.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="primary" size="lg" icon={Ico.sparkle}>가사 읽기</Btn>
                <Btn variant="outline" size="lg" iconRight={Ico.arrow}>음악 만들어주기</Btn>
              </div>
            </div>
            <div style={{ position: "absolute", right: -40, top: -40, width: 360, height: 360,
              borderRadius: "50%",
              background: "radial-gradient(circle, color-mix(in oklch, var(--accent) 50%, transparent) 0%, transparent 60%)",
              opacity: 0.6, filter: "blur(20px)" }}/>
            <div style={{ position: "absolute", right: 56, bottom: 32, fontFamily: "var(--font-serif)",
              fontSize: 13, color: "var(--fg-3)", fontStyle: "italic", letterSpacing: "0.01em" }}>
              — 수민, 「겨울 우체국」 中
            </div>
          </section>

          {/* Filter chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, alignItems: "center" }}>
            {filters.map(f => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>
            ))}
            <div style={{ flex: 1 }}/>
            <Chip icon={Ico.filter}>필터</Chip>
          </div>

          {/* New lyrics row — featured first */}
          <section style={{ marginBottom: 56 }}>
            <SectionHead kicker="LYRICS · 음악을 기다립니다" title="새 가사"
              action={<Btn variant="ghost" size="sm" iconRight={Ico.chevron}>전체 보기</Btn>}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {homeAlbumLyrics.map(l => <LyricsCard key={l.id} item={l}/>)}
            </div>
          </section>

          {/* New songs */}
          <section style={{ marginBottom: 56 }}>
            <SectionHead kicker="SONGS · 이번 주 완성" title="새 곡"
              action={<Btn variant="ghost" size="sm" iconRight={Ico.chevron}>전체 보기</Btn>}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 18 }}>
              {homeAlbumSongs.map(s => <SongCard key={s.id} song={s}/>)}
            </div>
          </section>

          {/* Albums */}
          <section style={{ marginBottom: 56 }}>
            <SectionHead kicker="ALBUMS · 한 호흡으로 묶인" title="새 앨범"
              action={<Btn variant="ghost" size="sm" iconRight={Ico.chevron}>전체 보기</Btn>}/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {homeAlbumAlbums.map(a => <AlbumCard key={a.id} album={a}/>)}
            </div>
          </section>

          {/* Editor's pick — quote block */}
          <section style={{
            padding: "48px 56px",
            background: "var(--bg-1)",
            border: "1px solid var(--bd-1)",
            borderRadius: "var(--r-xl)",
            display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "center",
          }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>EDITOR'S PICK</div>
              <h3 className="serif" style={{ fontSize: 30, fontWeight: 500, marginBottom: 18, letterSpacing: "0.005em", wordBreak: "keep-all" }}>
                "이 가사를 읽고서야, 비로소 음악을 시작했다."
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--fg-2)", lineHeight: 1.75, wordBreak: "keep-all" }}>
                매주 편집자가 한 편의 가사와 그 가사에 붙은 음악을 함께 소개합니다. 이번 주는 한솔의 「두 정거장 후」.
              </p>
            </div>
            <div className="lyrics" style={{ fontSize: 18, lineHeight: 2.0, color: "var(--fg-1)" }}>
              <div className="stanza">
                두 정거장 후에 내려야지{"\n"}
                생각하다가 종점까지 왔다{"\n"}
                바깥은 처음 보는 동네였다
              </div>
              <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 18, fontFamily: "var(--font-sans)", letterSpacing: 0 }}>
                — 한솔, 「두 정거장 후」
              </div>
            </div>
          </section>
        </div>

        <FooterPlayer track={{ id: "s1", title: "새벽 세 시의 라디오", artist: "유진", duration: 228 }}/>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Album Screen — 완성곡과 음악 대기 중인 가사가 한 페이지에 공존
   "실험적 레이아웃": 트랙리스트가 두 컬럼으로 나뉘어
   왼쪽은 완성된 곡, 오른쪽은 가사 대기 (수직 시간선 메타포)
   ───────────────────────────────────────────────────────────── */

const albumTracks = [
  { kind: "song",   index: 1, title: "정거장 하나",       artist: "한솔", duration: 192 },
  { kind: "song",   index: 2, title: "두 정거장 후",      artist: "한솔", duration: 218, current: true },
  { kind: "lyrics", index: 3, title: "세 번째 환승",      artist: "한솔", status: "generating" },
  { kind: "song",   index: 4, title: "막차의 좌석",       artist: "한솔", duration: 245 },
  { kind: "lyrics", index: 5, title: "종점에서",          artist: "한솔", status: "waiting" },
  { kind: "song",   index: 6, title: "처음 보는 동네",    artist: "한솔", duration: 201 },
];

function AlbumScreen() {
  return (
    <div className="chohee" style={{ display: "flex", height: "100%", background: "var(--bg-0)" }}>
      <Sidebar active="library"/>
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <TopBar/>

        {/* Album hero — large cover left, concept text right */}
        <section style={{
          padding: "48px 40px 36px",
          background: "linear-gradient(180deg, color-mix(in oklch, var(--accent) 14%, var(--bg-1)) 0%, var(--bg-0) 100%)",
          borderBottom: "1px solid var(--bd-1)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 40, alignItems: "flex-end" }}>
            <Cover id="album-hero" title="정거장 가까이" size={320} radius="var(--r-lg)"/>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
                ALBUM · 6곡 · 2025
              </div>
              <h1 className="serif" style={{ fontSize: 64, fontWeight: 400, lineHeight: 1.05, letterSpacing: "0.005em", marginBottom: 22 }}>
                정거장 가까이
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <Avatar name="한" size={36} hue={50}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>한솔</div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-3)" }}>1,243명 팔로워 · 2주 전 업데이트</div>
                </div>
                <FollowButton following size="sm"/>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="primary" size="lg" icon={Ico.play}>전체 재생</Btn>
                <Btn variant="secondary" size="lg" icon={Ico.shuffle}>섞어 듣기</Btn>
                <IconBtn icon={Ico.heart} size={44}/>
                <IconBtn icon={Ico.share} size={44}/>
              </div>
            </div>
          </div>
        </section>

        <div style={{ padding: "40px 40px 140px" }}>

          {/* Concept (literary intro) */}
          <section style={{ marginBottom: 48, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 56 }}>
            <div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>CONCEPT</div>
              <div className="serif" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.35, color: "var(--fg-1)", letterSpacing: "0.005em", wordBreak: "keep-all" }}>
                마지막 정거장에서<br/>첫 정거장까지
              </div>
            </div>
            <div className="serif" style={{ fontSize: 16, lineHeight: 2.0, color: "var(--fg-2)", letterSpacing: "0.005em", maxWidth: 640, wordBreak: "keep-all" }}>
              여섯 정거장을 지나며 쓴 글입니다. 어떤 정거장에서는 음악이 먼저 떠올랐고,
              어떤 정거장에서는 문장만 남았습니다. 음악이 붙지 않은 가사도 함께 두었습니다.
              누군가 같은 노선을 지나며 멜로디를 떠올려준다면, 그래서 가사가 비로소 노래가 된다면,
              앨범은 그때 다시 한 곡씩 늘어날 겁니다.
            </div>
          </section>

          {/* Track list — two-column with vertical timeline */}
          <section style={{ marginBottom: 48 }}>
            <SectionHead kicker="TRACKS" title="여섯 정거장"/>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              position: "relative",
              background: "var(--bg-1)",
              border: "1px solid var(--bd-1)",
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
            }}>
              {/* Left column — completed songs */}
              <div style={{ padding: 24, borderRight: "1px solid var(--bd-1)" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--accent)", marginBottom: 16 }}>완성된 곡</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {albumTracks.filter(t => t.kind === "song").map((t, i) => (
                    <TrackRow key={i} index={t.index - 1} track={t} current={t.current}/>
                  ))}
                </div>
              </div>
              {/* Right column — lyrics awaiting music */}
              <div style={{ padding: 24, background: "color-mix(in oklch, var(--bg-2) 30%, var(--bg-1))" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--st-waiting)", marginBottom: 16 }}>음악을 기다리는 가사</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {albumTracks.filter(t => t.kind === "lyrics").map((t, i) => (
                    <TrackRow key={i} index={t.index - 1} track={t}/>
                  ))}
                  <div style={{
                    marginTop: 14, padding: "14px 12px",
                    border: "1px dashed var(--bd-2)", borderRadius: "var(--r-md)",
                    fontSize: 12, color: "var(--fg-3)", textAlign: "center", lineHeight: 1.6,
                    wordBreak: "keep-all",
                  }}>
                    이 가사들 중 한 편에<br/>곡을 붙여보세요.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured lyric — large display, treats lyrics as artwork */}
          <section style={{ marginBottom: 48 }}>
            <SectionHead title="3번 — 세 번째 환승" kicker="LYRICS · 생성 중"/>
            <div style={{
              padding: "48px 64px",
              background: "var(--bg-1)",
              border: "1px solid var(--bd-1)",
              borderRadius: "var(--r-xl)",
              display: "grid", gridTemplateColumns: "auto 1fr", gap: 56,
            }}>
              <div style={{ borderRight: "1px solid var(--bd-1)", paddingRight: 56 }}>
                <div className="serif" style={{ fontSize: 80, fontWeight: 400, color: "var(--accent)", lineHeight: 1, letterSpacing: 0 }}>3</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>track three</div>
                <div style={{ marginTop: 24 }}>
                  <StatusBadge status="generating"/>
                </div>
                <div style={{ marginTop: 18, fontSize: 11.5, color: "var(--fg-3)" }}>
                  예상 완성<br/>
                  <span className="mono" style={{ color: "var(--fg-2)", fontSize: 13 }}>3분 후</span>
                </div>
              </div>
              <div>
                <div className="lyrics lyrics--lg" style={{ marginBottom: 32 }}>
                  <div className="stanza">
                    환승역에서 마주친 사람들은{"\n"}
                    서로의 행선지를 묻지 않는다{"\n"}
                    같은 방향이어도, 다른 정거장
                  </div>
                  <div className="stanza">
                    나는 세 번째 환승을 앞두고{"\n"}
                    한참을 의자에 앉아 있었다{"\n"}
                    누구도 나에게 어디로 가느냐고 묻지 않았다
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn variant="primary" icon={Ico.sparkle}>음악 미리듣기</Btn>
                  <Btn variant="outline" icon={Ico.heart}>응원하기</Btn>
                </div>
              </div>
            </div>
          </section>

          {/* Similar albums */}
          <section>
            <SectionHead kicker="비슷한 무드" title="이 앨범을 들은 사람들이"/>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {homeAlbumAlbums.slice(1).map(a => <AlbumCard key={a.id} album={a}/>)}
              <AlbumCard album={{ id: "a5", title: "정류장 너머", artist: "지혁", tracks: 5, concept: "다음 정거장으로" }}/>
            </div>
          </section>
        </div>
        <FooterPlayer track={{ id: "s2", title: "두 정거장 후", artist: "한솔", duration: 218 }}/>
      </main>
    </div>
  );
}

Object.assign(window, { HomeScreen, AlbumScreen });
