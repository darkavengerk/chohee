// app.jsx — Chohee design system showcase
// Assembles tokens, components, and screens into the DesignCanvas.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "mustard",
  "showGrid": false,
  "lyricsScale": 1.0
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent to all .chohee roots in the page
  useEffect(() => {
    document.documentElement.style.setProperty("--lyrics-scale", t.lyricsScale);
    document.querySelectorAll(".chohee").forEach(el => {
      el.setAttribute("data-accent", t.accent);
    });
  }, [t.accent, t.lyricsScale]);

  return (
    <>
      <DesignCanvas>

        {/* ── Section 1: Concept & Identity ── */}
        <DCSection id="concept" title="콘셉트" subtitle="가사가 음악이 되는 공간 — 디자인 정체성과 다섯 가지 출발점">
          <DCArtboard id="concept-summary" label="Concept Summary" width={1280} height={760}>
            <ConceptCard/>
          </DCArtboard>
        </DCSection>

        {/* ── Section 2: Design Tokens ── */}
        <DCSection id="tokens" title="디자인 토큰" subtitle="컬러 · 타이포그래피 · 간격 · 모서리 · 그림자 · 모션">
          <DCArtboard id="color"    label="Color · 따뜻한 차콜 + 앰버"     width={1280} height={1180}>
            <ColorCard/>
          </DCArtboard>
          <DCArtboard id="type"     label="Typography · Pretendard × 본명조" width={1280} height={1320}>
            <TypeCard/>
          </DCArtboard>
          <DCArtboard id="system"   label="Spacing · Radius · Shadow · Motion" width={1280} height={1280}>
            <SystemCard/>
          </DCArtboard>
        </DCSection>

        {/* ── Section 3: Components ── */}
        <DCSection id="components" title="핵심 컴포넌트" subtitle="버튼 · 상태 배지 · 칩 · 폼 · 플레이어 · 댓글 · 토스트">
          <DCArtboard id="components-all" label="Component Library" width={1280} height={1620}>
            <ComponentsCard/>
          </DCArtboard>
        </DCSection>

        {/* ── Section 4: Discovery Screens ── */}
        <DCSection id="screens-discover" title="화면 · 탐색" subtitle="홈/랜딩 · 앨범 (완성곡과 가사가 공존)">
          <DCArtboard id="home"  label="홈 · 랜딩"               width={1440} height={1980}>
            <HomeScreen/>
          </DCArtboard>
          <DCArtboard id="album" label="앨범 · 정거장 가까이 (실험)" width={1440} height={2120}>
            <AlbumScreen/>
          </DCArtboard>
        </DCSection>

        {/* ── Section 5: Content Detail ── */}
        <DCSection id="screens-detail" title="화면 · 콘텐츠 상세" subtitle="곡 상세 (파형 + 가사) · 가사 상세 (시집 메타포, 실험적 타이포)">
          <DCArtboard id="song-detail"   label="곡 상세 · 파형 + 가사"        width={1440} height={1820}>
            <SongDetailScreen/>
          </DCArtboard>
          <DCArtboard id="lyrics-detail" label="가사 상세 · 음악 대기 (실험)" width={1440} height={2080}>
            <LyricsDetailScreen/>
          </DCArtboard>
        </DCSection>

        {/* ── Section 6: Creator ── */}
        <DCSection id="screens-creator" title="화면 · 창작자" subtitle="곡 업로드 플로우 · 가사 작성 에디터 · 크리에이터 대시보드">
          <DCArtboard id="upload"    label="곡 업로드 · 2단계 정보 작성"      width={1440} height={1860}>
            <UploadScreen/>
          </DCArtboard>
          <DCArtboard id="write"     label="가사 작성 · 시집 에디터 + 음악 요청 패널" width={1440} height={1700}>
            <WriteScreen/>
          </DCArtboard>
          <DCArtboard id="dashboard" label="크리에이터 대시보드 · 유진의 작업실" width={1440} height={1560}>
            <DashboardScreen/>
          </DCArtboard>
        </DCSection>

        {/* ── Section 7: Discovery + Auth ── */}
        <DCSection id="screens-misc" title="화면 · 검색 · 인증" subtitle="통합 검색 결과 · 카카오 로그인">
          <DCArtboard id="search"  label="검색 결과 · '새벽'에 관한 87개의 작품" width={1440} height={1820}>
            <SearchScreen/>
          </DCArtboard>
          <DCArtboard id="login"   label="로그인 · 카카오" width={1280} height={900}>
            <LoginScreen/>
          </DCArtboard>
        </DCSection>

      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="액센트 컬러"/>
        <TweakRadio
          label="warm tone"
          value={t.accent}
          options={["amber", "terracotta", "mustard", "coral"]}
          onChange={v => setTweak("accent", v)}
        />
        <TweakSection label="가사 타이포"/>
        <TweakSlider
          label="가사 스케일"
          value={t.lyricsScale}
          min={0.85} max={1.2} step={0.05}
          onChange={v => setTweak("lyricsScale", v)}
        />
        <div style={{ padding: "10px 14px", fontSize: 11, lineHeight: 1.55, color: "#5a4a2a", opacity: 0.7 }}>
          따뜻한 톤 4종을 토글해 전체 분위기를 비교해보세요.<br/>
          가사 스케일은 가사 페이지에서 가장 잘 체감됩니다.
        </div>
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
