// token-cards.jsx — Design system documentation cards
// Concept · Color · Type · Spacing/Radius/Shadow/Motion

const TC = window;

/* ───────────────────── Concept card ───────────────────── */
function ConceptCard() {
  return (
    <div className="chohee" style={{ padding: 56, height: "100%", display: "flex", flexDirection: "column", gap: 36, background: "var(--bg-0)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Logo size={32}/>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
          초희 — Chohee
        </span>
      </div>

      <div>
        <h1 className="serif" style={{ fontSize: 64, fontWeight: 400, lineHeight: 1.08, letterSpacing: "0.005em",
          maxWidth: 880, wordBreak: "keep-all" }}>
          가사가 음악이 되는 공간.<br/>
          <span style={{ color: "var(--fg-3)" }}>창작자와 작품을 존중하는 따뜻한 다크 모드.</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginTop: 12 }}>
        <Pillar title="가사는 1급 콘텐츠"
          body="가사를 음악의 부속물이 아닌 독립된 작품으로 본다. 시집의 행간과 자간을 빌려 한글 명조로 다룬다. 음악이 없어도, 가사 그 자체가 페이지의 주인공."/>
        <Pillar title="디지털이지만 손으로 만든"
          body="순검정·순백·차가운 그라디언트 대신 따뜻한 차콜과 크림빛 오프화이트. 약한 그레인 텍스처, 절제된 앰버 액센트, 부드러운 모서리로 작가성과 손맛을 더한다."/>
        <Pillar title="공존하는 창작 단계"
          body="완성된 곡, 음악을 기다리는 가사, 한 호흡으로 묶인 앨범이 한 화면에 자연스럽게 공존한다. 상태 배지는 신호등이 아니라 작품의 단계를 안내하는 표식."/>
      </div>

      <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--bd-1)" }}>
        {[
          ["베이스", "warm charcoal · #1a1816"],
          ["타입", "Pretendard × Noto Serif KR"],
          ["액센트", "amber · terracotta · mustard · coral"],
          ["모션", "부드럽고 차분하게, 200–360ms"],
        ].map(([k, v], i) => (
          <div key={i} style={{ padding: "20px 24px", borderRight: i < 3 ? "1px solid var(--bd-1)" : "none" }}>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{k}</div>
            <div style={{ fontSize: 14, color: "var(--fg-1)", fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pillar({ title, body }) {
  return (
    <div>
      <div style={{ width: 24, height: 1, background: "var(--accent)", marginBottom: 16 }}/>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 10, letterSpacing: "0.005em" }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--fg-2)", maxWidth: 360, wordBreak: "keep-all", letterSpacing: "-0.005em" }}>{body}</p>
    </div>
  );
}

/* ───────────────────── Color card ───────────────────── */
function ColorCard() {
  const surfaces = [
    ["--bg-0", "#1a1816", "page"],
    ["--bg-1", "#21201d", "card · surface"],
    ["--bg-2", "#272623", "modal · hover"],
    ["--bg-3", "#2f2d2a", "input · chip"],
    ["--bg-4", "#3a3835", "divider"],
  ];
  const text = [
    ["--fg-1", "primary",   "오프화이트 본문"],
    ["--fg-2", "secondary", "보조 텍스트"],
    ["--fg-3", "muted",     "메타데이터"],
    ["--fg-4", "disabled",  "비활성"],
  ];
  const accents = [
    ["amber",      "oklch(0.78 0.14 70)",  "메인 — 기본"],
    ["terracotta", "oklch(0.66 0.13 38)",  "보조 / 가사 액센트"],
    ["mustard",    "oklch(0.82 0.14 92)",  "여름 톤 옵션"],
    ["coral",      "oklch(0.74 0.15 28)",  "겨울 톤 옵션"],
  ];
  const semantic = [
    ["--info",    "info",    "안내"],
    ["--success", "success", "완료"],
    ["--warn",    "warning", "주의"],
    ["--danger",  "danger",  "삭제 · 오류"],
  ];
  const status = [
    ["waiting",    "var(--st-waiting)",  "음악 대기 중"],
    ["generating", "var(--st-progress)", "생성 중"],
    ["complete",   "var(--st-complete)", "완성"],
    ["revision",   "var(--st-revision)", "보완 요청"],
  ];

  return (
    <div className="chohee" style={{ padding: 48, height: "100%", display: "flex", flexDirection: "column", gap: 32, background: "var(--bg-0)", overflow: "auto" }}>
      <CardHead kicker="01 · Color" title="Warm charcoal에 절제된 앰버"
        sub="순검정과 네온 그라디언트를 피하고, 따뜻한 차콜 베이스 위에 크림빛 텍스트를 얹습니다. 액센트는 따뜻한 톤 한 가지만 강하게."/>

      <Group label="Surfaces · 5단계 표면">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {surfaces.map(([token, hex, role]) => (
            <div key={token} style={{ background: `var(${token})`, padding: 18, borderRadius: "var(--r-md)", border: "1px solid var(--bd-1)", minHeight: 110 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--fg-1)", fontWeight: 600 }}>{token}</div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 4 }}>{hex}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 14 }}>{role}</div>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Foreground · 텍스트 4단계">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {text.map(([token, role, desc]) => (
            <div key={token} style={{ background: "var(--bg-1)", padding: 18, borderRadius: "var(--r-md)", border: "1px solid var(--bd-1)" }}>
              <div style={{ fontSize: 22, color: `var(${token})`, fontWeight: 500 }}>가나다 Aa</div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 10 }}>{token}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{role} · {desc}</div>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Accent · 따뜻한 톤 4종 (Tweaks로 토글)">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {accents.map(([name, val, desc]) => (
            <div key={name} style={{ background: "var(--bg-1)", padding: 18, borderRadius: "var(--r-md)", border: "1px solid var(--bd-1)" }}>
              <div style={{ width: "100%", height: 48, borderRadius: "var(--r-sm)", background: val, marginBottom: 12 }}/>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Group>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Group label="Semantic · 차가운 색은 시맨틱에만">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {semantic.map(([token, role, desc]) => (
              <div key={token} style={{ background: "var(--bg-1)", padding: 14, borderRadius: "var(--r-md)", border: "1px solid var(--bd-1)" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: `var(${token})`, marginBottom: 10 }}/>
                <div style={{ fontSize: 11.5, fontWeight: 600 }}>{role}</div>
                <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 2 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Group>

        <Group label="Status · 음악 생성 단계">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {status.map(([s, c, d]) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)" }}>
                <StatusBadge status={s}/>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)", flex: 1 }}>{c}</span>
                <span style={{ fontSize: 12, color: "var(--fg-2)" }}>{d}</span>
              </div>
            ))}
          </div>
        </Group>
      </div>
    </div>
  );
}

/* ───────────────────── Type card ───────────────────── */
function TypeCard() {
  return (
    <div className="chohee" style={{ padding: 48, height: "100%", display: "flex", flexDirection: "column", gap: 28, background: "var(--bg-0)", overflow: "auto" }}>
      <CardHead kicker="02 · Typography" title="작가성을 가진 두 글자체의 만남"
        sub="UI와 본문은 Pretendard, 가사와 디스플레이는 Noto Serif KR(본명조 계열). 가사는 시집의 호흡을 따라 행간 1.95, 자간 +0.01em으로 다룹니다."/>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <FamilyCard
          name="Pretendard"
          role="UI · 본문 · 메타데이터"
          font="var(--font-sans)"
          sample="가사가 음악이 되는 공간."
          english="The lyrics become music."
          meta="400 · 500 · 600"
        />
        <FamilyCard
          name="Noto Serif KR"
          role="가사 · 디스플레이 · 작품 텍스트"
          font="var(--font-serif)"
          sample="새벽 세 시의 라디오"
          english="A radio at three in the morning"
          meta="400 · 500"
          serif
        />
      </div>

      <Group label="Display & UI scale">
        <div style={{ display: "grid", gap: 14 }}>
          <ScaleRow size={56} weight={500} family="serif" label="Display · serif 56/1.1"   text="가사가 음악이 되는 공간"/>
          <ScaleRow size={36} weight={500} family="serif" label="Title · serif 36/1.2"     text="새벽 세 시의 라디오"/>
          <ScaleRow size={24} weight={500} family="serif" label="Subtitle · serif 24/1.35" text="음악을 기다리는 가사"/>
          <ScaleRow size={20} weight={600} family="sans"  label="Section · sans 20/1.35"   text="최근 올라온 가사"/>
          <ScaleRow size={14} weight={500} family="sans"  label="Body · sans 14/1.55"      text="이 가사에 곡을 붙여보세요. 운영자나 다른 창작자가 음악을 만들어줍니다."/>
          <ScaleRow size={12} weight={500} family="sans"  label="Caption · sans 12/1.4"    text="2분 47초 · 3일 전 · 432회 재생"/>
          <ScaleRow size={11} weight={500} family="mono"  label="Mono · 11/1.4"            text="04:32 / 03:48  ·  ID 8f2a91"/>
        </div>
      </Group>

      <Group label="Lyrics — 가사 표시 가이드라인">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 24 }}>
          <div style={{ padding: 28, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
            <div className="lyrics lyrics--lg" style={{ fontSize: 22 }}>
              <div className="stanza">
                새벽 세 시의 라디오{"\n"}
                낯선 목소리가 흘러나와{"\n"}
                나는 깨어 있는 채로 듣는다
              </div>
              <div className="stanza">
                창문 너머에는 비가 오고{"\n"}
                비는 아무에게도 닿지 않는다
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Rule k="font-family" v="var(--font-serif) — Noto Serif KR / 본명조"/>
            <Rule k="font-size"   v="22px · 28px(lg) · 36px(xl)"/>
            <Rule k="line-height" v="1.95 — 시집의 행간"/>
            <Rule k="letter-spacing" v="+0.01em — 한글 자간 살짝 벌림"/>
            <Rule k="word-break" v="keep-all — 한글 단어 잘리지 않게"/>
            <Rule k="white-space" v="pre-wrap — 작가의 줄바꿈 보존"/>
            <Rule k="stanza gap" v="1.4em — 연 사이 호흡"/>
            <Rule k="color" v="var(--fg-1) — 본문, 강조 시 var(--accent)"/>
          </div>
        </div>
      </Group>
    </div>
  );
}

function FamilyCard({ name, role, font, sample, english, meta, serif }) {
  return (
    <div style={{ padding: 28, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <span style={{ fontFamily: font, fontSize: 22, fontWeight: 500, letterSpacing: serif ? 0 : "-0.01em" }}>{name}</span>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)" }}>{meta}</span>
      </div>
      <div style={{ fontFamily: font, fontSize: 44, lineHeight: 1.2, marginBottom: 8, letterSpacing: serif ? "0.005em" : "-0.015em", fontWeight: serif ? 400 : 500 }}>
        {sample}
      </div>
      <div style={{ fontFamily: font, fontSize: 18, color: "var(--fg-3)", marginBottom: 18, letterSpacing: serif ? 0 : "-0.01em", fontStyle: serif ? "italic" : "normal" }}>
        {english}
      </div>
      <div style={{ paddingTop: 14, borderTop: "1px solid var(--bd-1)", fontSize: 11, color: "var(--fg-3)" }}>{role}</div>
    </div>
  );
}

function ScaleRow({ size, weight, family, label, text }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 24, padding: "12px 0", borderTop: "1px solid var(--bd-1)" }}>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)" }}>{label}</div>
      <div style={{
        fontFamily: family === "serif" ? "var(--font-serif)" : family === "mono" ? "var(--font-mono)" : "var(--font-sans)",
        fontSize: size, fontWeight: weight,
        letterSpacing: family === "serif" ? "0.005em" : family === "mono" ? 0 : "-0.01em",
        lineHeight: 1.3,
      }}>{text}</div>
    </div>
  );
}

function Rule({ k, v }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", alignItems: "baseline", gap: 16, padding: "8px 0", borderBottom: "1px solid var(--bd-1)" }}>
      <span className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>{k}</span>
      <span style={{ fontSize: 13, color: "var(--fg-2)" }}>{v}</span>
    </div>
  );
}

/* ───────────────────── Spacing / Radius / Shadow / Motion card ───────────────────── */
function SystemCard() {
  const space = [
    ["s-1", 4], ["s-2", 8], ["s-3", 12], ["s-4", 16], ["s-5", 20],
    ["s-6", 24], ["s-8", 32], ["s-10", 40], ["s-12", 48], ["s-16", 64],
  ];
  const radii = [
    ["xs", 4], ["sm", 6], ["md", 10], ["lg", 14], ["xl", 20], ["pill", 999],
  ];
  const shadows = [
    ["--sh-1", "subtle elevation · card"],
    ["--sh-2", "hover · modal"],
    ["--sh-3", "popover · drawer"],
  ];
  const motion = [
    ["--t-fast",   "120ms", "hover · focus · button press"],
    ["--t-base",   "200ms", "card hover · tab switch"],
    ["--t-slow",   "360ms", "panel open · progress fill"],
    ["--t-page",   "480ms", "page transition · skeleton fade"],
    ["--ease",     "cubic-bezier(0.2, 0.7, 0.3, 1)", "기본 곡선"],
  ];

  return (
    <div className="chohee" style={{ padding: 48, height: "100%", display: "flex", flexDirection: "column", gap: 32, background: "var(--bg-0)", overflow: "auto" }}>
      <CardHead kicker="03 · System" title="간격 · 모서리 · 그림자 · 모션"
        sub="4px 베이스 간격, 부드럽지만 너무 둥글지 않은 모서리, 다크 위에서는 약한 그림자만, 모션은 차분하게."/>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Group label="Spacing · 4px base">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {space.map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "60px 70px 1fr", alignItems: "center", gap: 16 }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{k}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-2)" }}>{v}px</span>
                <div style={{ height: 18, background: "color-mix(in oklch, var(--accent) 22%, transparent)", borderRadius: 2, width: `${(v / 64) * 100}%`, border: "1px solid color-mix(in oklch, var(--accent) 40%, transparent)" }}/>
              </div>
            ))}
          </div>
        </Group>

        <Group label="Radius · 부드럽게, 너무 둥글지 않게">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {radii.map(([k, v]) => (
              <div key={k} style={{ padding: 16, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 60, height: 60, background: "var(--bg-3)", border: "1px solid var(--bd-2)", borderRadius: v >= 999 ? "50%" : v }}/>
                <div style={{ textAlign: "center" }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>--r-{k}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)", marginTop: 2 }}>{v >= 999 ? "pill" : v + "px"}</div>
                </div>
              </div>
            ))}
          </div>
        </Group>
      </div>

      <Group label="Shadow · 다크에서는 약하게, 표면 단계가 깊이감을 만듭니다">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {shadows.map(([k, d]) => (
            <div key={k} style={{ padding: 36, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)" }}>
              <div style={{ height: 90, background: "var(--bg-2)", borderRadius: "var(--r-md)", boxShadow: `var(${k})` }}/>
              <div className="mono" style={{ fontSize: 11, color: "var(--accent)", marginTop: 14 }}>{k}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{d}</div>
            </div>
          ))}
        </div>
      </Group>

      <Group label="Motion · 차분하게, 빠르고 튀는 애니메이션 지양">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {motion.map(([k, v, d]) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "120px 280px 1fr", alignItems: "center", gap: 16, padding: "10px 14px", background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-md)" }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>{k}</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--fg-2)" }}>{v}</span>
              <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{d}</span>
            </div>
          ))}
        </div>
      </Group>
    </div>
  );
}

function CardHead({ kicker, title, sub }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>{kicker}</div>
      <h2 className="serif" style={{ fontSize: 36, fontWeight: 500, letterSpacing: "0.005em", marginBottom: 12 }}>{title}</h2>
      <p style={{ fontSize: 14, color: "var(--fg-2)", maxWidth: 720, lineHeight: 1.6, wordBreak: "keep-all", letterSpacing: "-0.005em" }}>{sub}</p>
    </div>
  );
}

function Group({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--fg-3)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>{label}</div>
      {children}
    </div>
  );
}

/* ───────────────────── Components showcase card ───────────────────── */
function ComponentsCard() {
  const [tab, setTab] = useState("songs");
  return (
    <div className="chohee" style={{ padding: 48, height: "100%", display: "flex", flexDirection: "column", gap: 28, background: "var(--bg-0)", overflow: "auto" }}>
      <CardHead kicker="04 · Components" title="핵심 컴포넌트 라이브러리"
        sub="카드, 플레이어, 상태 배지, 폼, 댓글 등 모든 화면에서 재사용되는 부품들."/>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Btn variant="primary">곡 올리기</Btn>
        <Btn variant="secondary">취소</Btn>
        <Btn variant="outline">더 보기</Btn>
        <Btn variant="primary" icon={Ico.upload}>업로드</Btn>
        <Btn variant="secondary" icon={Ico.heart}>좋아요</Btn>
        <Btn variant="ghost" iconRight={Ico.chevron}>창작자 보기</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <StatusBadge status="waiting"/>
        <StatusBadge status="generating"/>
        <StatusBadge status="complete"/>
        <StatusBadge status="revision"/>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {["서정", "재즈", "발라드", "새벽", "비 오는 날", "어쿠스틱", "재즈 보컬", "어쿠스틱 기타"].map((t, i) => (
          <Chip key={t} active={i === 2} accent={i === 5}>{t}</Chip>
        ))}
      </div>

      <Group label="Form 요소">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="곡 제목" value="새벽 세 시의 라디오" onChange={() => {}}/>
          <Input label="장르" value="" placeholder="발라드, 재즈…" onChange={() => {}} icon={Ico.search}/>
          <div style={{ gridColumn: "1 / -1" }}>
            <Textarea label="가사" rows={4} serif value={"새벽 세 시의 라디오\n낯선 목소리가 흘러나와\n나는 깨어 있는 채로 듣는다"} onChange={() => {}}/>
          </div>
          <Progress value={62} label="인코딩 중… new-song.wav"/>
          <Progress value={100} label="업로드 완료" accent="var(--success)"/>
        </div>
      </Group>

      <Group label="Player">
        <div style={{ padding: 24, background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)" }}>
          <WaveformPlayer duration={228}/>
        </div>
      </Group>

      <Group label="Comment · 가사 한 줄을 인용한 댓글">
        <div style={{ background: "var(--bg-1)", border: "1px solid var(--bd-1)", borderRadius: "var(--r-lg)", padding: "4px 20px" }}>
          <Comment author="민지" time="3시간 전" hue={20}
            lyricsAnchor="비는 아무에게도 닿지 않는다"
            body="이 한 줄에 너무 오래 머물렀어요. 한 호흡 더 두고 다음 연으로 넘어가도 좋을 것 같습니다."/>
          <Comment author="도윤" time="어제" hue={120}
            body="발라드보다는 슬로우 재즈가 어울릴 것 같아요. 색소폰 인트로 어떠세요?"/>
        </div>
      </Group>

      <Group label="Toast">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Toast kind="success" title="가사가 등록되었습니다">3명의 음악가가 작업 의향을 표시했어요.</Toast>
          <Toast kind="info" title="음악 생성을 시작했습니다">완성까지 약 3–5분 걸려요.</Toast>
        </div>
      </Group>
    </div>
  );
}

Object.assign(window, { ConceptCard, ColorCard, TypeCard, SystemCard, ComponentsCard });
