// screens/song-lyrics.jsx — 곡 상세 + 가사 상세 (실험적 타이포)

/* ─────────────────────────────────────────────────────────────
   Song Detail — 큰 커버 + 파형 플레이어 + 가사 영역
   ───────────────────────────────────────────────────────────── */

function SongDetailScreen() {
  return (
    <div className="chohee" style={{ display: "flex", height: "100%", background: "var(--bg-0)" }}>
      <Sidebar active="library"/>
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <TopBar/>

        {/* Hero: cover + meta + waveform */}
        <section style={{
          padding: "48px 40px 32px",
          background: "linear-gradient(180deg, color-mix(in oklch, var(--accent) 12%, var(--bg-1)) 0%, var(--bg-0) 100%)",
          borderBottom: "1px solid var(--bd-1)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40 }}>
            <Cover id="song-detail-hero" title="새벽 세 시의 라디오" size={280} radius="var(--r-lg)"/>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em",
                textTransform: "uppercase", marginBottom: 14 }}>SONG · 3:48</div>
              <h1 className="serif" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.08, marginBottom: 18, letterSpacing: "0.005em" }}>
                새벽 세 시의 라디오
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <Avatar name="유" size={32} hue={40}/>
                <span style={{ fontSize: 14, fontWeight: 600 }}>유진</span>
                <span style={{ fontSize: 12, color: "var(--fg-3)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--fg-3)" }}>앨범 「비의 다섯 가지」 中 2번 곡</span>
                <span style={{ fontSize: 12, color: "var(--fg-3)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--fg-3)" }}>3,247회 재생</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 14, marginBottom: 24 }}>
                <Chip size="sm">발라드</Chip>
                <Chip size="sm">새벽</Chip>
                <Chip size="sm">어쿠스틱</Chip>
                <Chip size="sm">서정</Chip>
              </div>

              {/* Waveform */}
              <div style={{ marginTop: "auto", padding: "20px 24px", background: "var(--bg-2)",
                border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
                <WaveformPlayer duration={228} height={56}/>
                <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost" size="sm" icon={Ico.heart}>342</Btn>
                    <Btn variant="ghost" size="sm" icon={Ico.comment}>28</Btn>
                    <Btn variant="ghost" size="sm" icon={Ico.share}>공유</Btn>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn variant="outline" size="sm" icon={Ico.download}>다운로드</Btn>
                    <IconBtn icon={Ico.more}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ padding: "40px 40px 140px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48 }}>

          {/* Lyrics area — primary */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "0.005em" }}>가사</h2>
              <div style={{ display: "flex", gap: 6 }}>
                <Chip size="sm" active>큰 글씨</Chip>
                <Chip size="sm">중간</Chip>
                <Chip size="sm">작게</Chip>
              </div>
            </div>
            <div style={{
              padding: "48px 56px",
              background: "var(--bg-1)",
              border: "1px solid var(--bd-1)",
              borderRadius: "var(--r-xl)",
            }} className="grain">
              <div className="lyrics lyrics--lg" style={{ fontSize: 24, lineHeight: 2.05 }}>
                <div className="stanza">
                  새벽 세 시의 라디오{"\n"}
                  낯선 목소리가 흘러나와{"\n"}
                  나는 깨어 있는 채로 듣는다
                </div>
                <div className="stanza">
                  창문 너머에는 비가 오고{"\n"}
                  비는 아무에게도 닿지 않는다{"\n"}
                  나는 그것을 약속이라고 부르기로 했다
                </div>
                <div className="stanza" style={{ color: "var(--accent)" }}>
                  세상에서 가장 작은 라디오 주파수가{"\n"}
                  내 방의 어둠을 데우고 있다
                </div>
                <div className="stanza">
                  잠들 수 없는 사람에게만{"\n"}
                  들리는 노래가 있다고{"\n"}
                  나는 오늘 그것을 믿게 되었다
                </div>
              </div>
              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--bd-1)",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>
                  작사 · 유진 · 2024.11
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="ghost" size="sm" icon={Ico.heart}>가사 좋아요</Btn>
                  <Btn variant="ghost" size="sm" icon={Ico.share}>공유</Btn>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar — meta + related */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            <div style={{ padding: 24, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--fg-3)", marginBottom: 16 }}>이 곡에 대하여</div>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "10px 16px", fontSize: 12.5 }}>
                <span style={{ color: "var(--fg-3)" }}>장르</span>
                <span>발라드 · 어쿠스틱</span>
                <span style={{ color: "var(--fg-3)" }}>무드</span>
                <span>새벽, 고요함, 서정</span>
                <span style={{ color: "var(--fg-3)" }}>BPM</span>
                <span className="mono" style={{ fontSize: 12 }}>72</span>
                <span style={{ color: "var(--fg-3)" }}>키</span>
                <span className="mono" style={{ fontSize: 12 }}>F# minor</span>
                <span style={{ color: "var(--fg-3)" }}>생성 도구</span>
                <span>Suno v4</span>
                <span style={{ color: "var(--fg-3)" }}>발매</span>
                <span>2024년 11월 14일</span>
              </div>
            </div>

            <div style={{ padding: 24, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <Cover id="related-album" title="비의 다섯 가지" size={64} radius="var(--r-sm)"/>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 15, fontWeight: 500 }}>비의 다섯 가지</div>
                  <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>5곡 · 유진</div>
                </div>
              </div>
              <div className="serif" style={{ fontSize: 13, color: "var(--fg-2)", fontStyle: "italic",
                lineHeight: 1.65, letterSpacing: "0.005em" }}>
                "비가 내리는 다섯 개의 풍경"
              </div>
              <Btn variant="outline" size="sm" style={{ marginTop: 16, width: "100%" }} iconRight={Ico.chevron}>앨범 페이지로</Btn>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--fg-3)", marginBottom: 14 }}>비슷한 곡</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { id: "r1", title: "두 정거장 후", artist: "한솔", duration: 192 },
                  { id: "r2", title: "비가 내릴 줄 알았어", artist: "민서", duration: 201 },
                  { id: "r3", title: "여름의 끝", artist: "유진", duration: 213 },
                ].map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, borderRadius: "var(--r-md)" }}>
                    <Cover id={`rel-${s.id}`} title={s.title} size={44} radius="var(--r-sm)"/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="serif" style={{ fontSize: 13.5, fontWeight: 500,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{s.artist}</div>
                    </div>
                    <PlayButton size={32} accent={false}/>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Comments */}
        <section style={{ padding: "0 40px 140px" }}>
          <div style={{ borderTop: "1px solid var(--bd-1)", paddingTop: 40 }}>
            <SectionHead title="감상 · 28" kicker="COMMENTS"/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
              <Comment author="민지" time="3시간 전" hue={20}
                lyricsAnchor="비는 아무에게도 닿지 않는다"
                body="이 한 줄에 너무 오래 머물렀어요. 한 호흡 더 두고 다음 연으로 넘어가도 좋을 것 같습니다."/>
              <Comment author="도윤" time="어제" hue={140}
                body="새벽에 들으면 더 좋네요. F# 마이너의 차분함이 가사랑 잘 맞아요."/>
              <Comment author="예린" time="2일 전" hue={260}
                lyricsAnchor="잠들 수 없는 사람에게만 들리는 노래가 있다고"
                body="라디오 잡음을 한 번만 더 깔아주시면 좋겠어요. 실제 라디오 같은 느낌으로요."/>
              <Comment author="수민" time="3일 전" hue={60}
                body="다음 곡도 기다리고 있어요."/>
            </div>
          </div>
        </section>

        <FooterPlayer track={{ id: "s1", title: "새벽 세 시의 라디오", artist: "유진", duration: 228 }}/>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Lyrics Detail — 음악 없는 가사 페이지
   "실험적 레이아웃": 시집 페이지 메타포
   · 큰 여백, 들여쓰기, 본문 우선
   · 메타데이터는 각주처럼 페이지 가장자리로
   · "음악 만들어주세요" CTA가 페이지 하단
   ───────────────────────────────────────────────────────────── */

function LyricsDetailScreen() {
  return (
    <div className="chohee" style={{ display: "flex", height: "100%", background: "var(--bg-0)" }}>
      <Sidebar active="library"/>
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <TopBar/>

        <div style={{ padding: "32px 40px 140px", maxWidth: 1180, margin: "0 auto" }}>

          {/* Page header — newspaper-style masthead */}
          <header style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
            padding: "20px 0", borderBottom: "1px solid var(--bd-1)", marginBottom: 56 }}>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              CHOHEE · LYRICS
            </span>
            <span className="serif" style={{ fontSize: 13, color: "var(--fg-2)", fontStyle: "italic", letterSpacing: "0.005em" }}>
              · 가사가 음악이 되는 공간 ·
            </span>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.14em",
              textAlign: "right" }}>
              2025.11.14 · NO. 0034
            </span>
          </header>

          {/* Title block — typographic centerpiece */}
          <section style={{ textAlign: "center", marginBottom: 56 }}>
            <StatusBadge status="generating"/>
            <h1 className="serif" style={{ fontSize: 88, fontWeight: 400, lineHeight: 1.05,
              letterSpacing: "0.005em", marginTop: 28, marginBottom: 24 }}>
              겨울 우체국
            </h1>
            <div className="serif" style={{ fontSize: 18, fontStyle: "italic", color: "var(--fg-3)",
              letterSpacing: "0.005em" }}>
              — 수민, 22행
            </div>
          </section>

          {/* Two-column: lyrics centerstage + marginal notes */}
          <section style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 56, alignItems: "flex-start",
            paddingTop: 24, borderTop: "1px solid var(--bd-1)" }}>

            {/* Left margin: line numbers */}
            <div style={{ width: 32, paddingTop: 12,
              fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-4)",
              lineHeight: 2.05, textAlign: "right", letterSpacing: 0 }}>
              {Array.from({ length: 22 }).map((_, i) => <div key={i}>{String(i + 1).padStart(2, "0")}</div>)}
            </div>

            {/* Lyrics — the work itself */}
            <div className="lyrics lyrics--xl" style={{
              fontSize: 30, lineHeight: 2.0, paddingTop: 12,
              maxWidth: 620, margin: "0 auto",
            }}>
              <div className="stanza">
                당신에게 부치지 못한 편지가{"\n"}
                책상 위에서 다시 잠이 든다{"\n"}
                계절을 두 번 보내고도{"\n"}
                아직 우표를 사지 못한 채
              </div>
              <div className="stanza">
                나는 매일 아침 우체국 앞을 지나고{"\n"}
                매일 저녁 빈 손으로 돌아온다{"\n"}
                창구의 사람은 나를 알아보고{"\n"}
                나는 그것이 부끄러워 길을 돌아간다
              </div>
              <div className="stanza" style={{ color: "var(--accent)", fontStyle: "italic" }}>
                겨울에는 편지가 더 오래 걸린다고{"\n"}
                누군가 일러주었지만{"\n"}
                나는 그 말을 믿지 않기로 했다
              </div>
              <div className="stanza">
                내가 부치지 않은 편지가{"\n"}
                당신에게 닿지 않는 것은{"\n"}
                계절 때문이 아니라{"\n"}
                내 손이 멈춰 있기 때문이라고{"\n"}
                나는 이제 안다
              </div>
            </div>

            {/* Right margin: footnote-style metadata */}
            <aside style={{ width: 220, paddingTop: 12, position: "sticky", top: 100,
              fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--fg-3)" }}>
              <div style={{ paddingLeft: 18, borderLeft: "1px solid var(--bd-1)" }}>
                <div style={{ marginBottom: 22 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--accent)", marginBottom: 6 }}>창작자</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name="수" size={28} hue={80}/>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-1)" }}>수민</div>
                      <div style={{ fontSize: 11 }}>342 팔로워</div>
                    </div>
                  </div>
                  <FollowButton size="sm" style={{ marginTop: 10 }}/>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--accent)", marginBottom: 8 }}>제안된 무드</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <Chip size="sm">발라드</Chip>
                    <Chip size="sm">슬로우</Chip>
                    <Chip size="sm">피아노</Chip>
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--accent)", marginBottom: 8 }}>참여 의향</div>
                  <div style={{ display: "flex", alignItems: "center", gap: -6 }}>
                    {[20, 100, 220, 60].map((h, i) => (
                      <div key={i} style={{ marginLeft: i ? -8 : 0, border: "2px solid var(--bg-0)", borderRadius: "50%" }}>
                        <Avatar name={["민", "도", "예", "유"][i]} size={28} hue={h}/>
                      </div>
                    ))}
                    <span style={{ marginLeft: 8, fontSize: 11 }}>외 2명</span>
                  </div>
                </div>

                <div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--accent)", marginBottom: 8 }}>발행</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-2)" }}>2025.11.10</div>
                </div>
              </div>
            </aside>
          </section>

          {/* CTA block — 음악 만들어주세요 */}
          <section style={{
            marginTop: 80,
            padding: "48px 56px",
            background: "color-mix(in oklch, var(--accent) 14%, var(--bg-1))",
            border: "1px solid color-mix(in oklch, var(--accent) 26%, transparent)",
            borderRadius: "var(--r-xl)",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
          }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em",
                textTransform: "uppercase", marginBottom: 14 }}>이 가사에 음악을 붙여주세요</div>
              <h3 className="serif" style={{ fontSize: 30, fontWeight: 500, marginBottom: 14, letterSpacing: "0.005em",
                wordBreak: "keep-all" }}>
                지금 4명이 작업을 시작했어요.
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--fg-2)", lineHeight: 1.7, maxWidth: 540, wordBreak: "keep-all" }}>
                수민의 가사 「겨울 우체국」에 곡을 붙여주세요. 작업물은 가사 작가의 검토를 거쳐 페이지에 함께 올라갑니다.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
              <Btn variant="primary" size="lg" icon={Ico.sparkle}>음악 만들기</Btn>
              <Btn variant="outline" size="lg" icon={Ico.heart}>응원하기</Btn>
            </div>
          </section>

          {/* Comments — gentle, fewer */}
          <section style={{ marginTop: 56 }}>
            <SectionHead title="감상" kicker="6 COMMENTS"/>
            <div style={{ background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)", padding: "4px 24px" }}>
              <Comment author="도윤" time="2일 전" hue={140}
                lyricsAnchor="내 손이 멈춰 있기 때문이라고"
                body="이 마지막 연에 곡 전체의 무게가 다 모이는 것 같아요. 후렴을 따로 두지 않고 마지막 연을 그대로 후렴처럼 쓰면 어떨까요?"/>
              <Comment author="민지" time="3일 전" hue={20}
                body="피아노 한 대로만 가도 좋을 것 같아요. 너무 많이 더하지 말아주세요."/>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { SongDetailScreen, LyricsDetailScreen });
