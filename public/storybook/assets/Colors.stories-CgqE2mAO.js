import{j as e}from"./iframe-DPjQQZx3.js";import"./preload-helper-4_59RN96.js";function a({name:n,value:r,textDark:o=!1}){return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",minWidth:120},children:[e.jsx("div",{style:{width:"100%",height:80,borderRadius:8,background:r,border:"1px solid rgba(255,255,255,0.08)",position:"relative",overflow:"hidden"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.15rem"},children:[e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.68rem",color:"var(--white)",letterSpacing:"0.05em"},children:n}),e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--gray-500)",letterSpacing:"0.05em"},children:r})]})]})}function t({title:n,children:r}){return e.jsxs("div",{style:{marginBottom:"3rem"},children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.68rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"1.25rem"},children:n}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"1rem"},children:r})]})}function p(){return e.jsxs("div",{style:{padding:"2rem",maxWidth:900,fontFamily:"var(--font-body)"},children:[e.jsx("h1",{style:{fontFamily:"var(--font-display)",fontSize:"2rem",fontWeight:700,marginBottom:"0.5rem",color:"var(--white)"},children:"Color System"}),e.jsxs("p",{style:{color:"var(--gray-500)",fontSize:"0.875rem",marginBottom:"3rem"},children:["All design tokens from ",e.jsx("code",{style:{fontFamily:"var(--font-mono)",color:"var(--accent)"},children:"src/styles/global.css"})]}),e.jsxs(t,{title:"Core",children:[e.jsx(a,{name:"--black",value:"#090909"}),e.jsx(a,{name:"--white",value:"#F5F4F0",textDark:!0})]}),e.jsxs(t,{title:"Grayscale Ladder",children:[e.jsx(a,{name:"--gray-900",value:"#111111"}),e.jsx(a,{name:"--gray-800",value:"#1C1C1C"}),e.jsx(a,{name:"--gray-700",value:"#2A2A2A"}),e.jsx(a,{name:"--gray-600",value:"#404040"}),e.jsx(a,{name:"--gray-500",value:"#676767"}),e.jsx(a,{name:"--gray-400",value:"#939393"}),e.jsx(a,{name:"--gray-300",value:"#BCBCBC"}),e.jsx(a,{name:"--gray-200",value:"#DCDCDC"}),e.jsx(a,{name:"--gray-100",value:"#EFEFEB"})]}),e.jsxs(t,{title:"Accent — Electric Lime",children:[e.jsx(a,{name:"--accent",value:"#C9FF57",textDark:!0}),e.jsx(a,{name:"--accent-dark",value:"#9FCC2E",textDark:!0}),e.jsx(a,{name:"--accent-muted",value:"rgba(201,255,87,0.10)"}),e.jsx(a,{name:"--accent-border",value:"rgba(201,255,87,0.25)"})]}),e.jsxs(t,{title:"Semantic Aliases",children:[e.jsx(a,{name:"--bg",value:"#090909"}),e.jsx(a,{name:"--surface",value:"#111111"}),e.jsx(a,{name:"--border",value:"#2A2A2A"}),e.jsx(a,{name:"--text",value:"#F5F4F0",textDark:!0}),e.jsx(a,{name:"--muted",value:"#676767"})]})]})}const C={title:"Design System/Colors",parameters:{layout:"fullscreen",backgrounds:{default:"dark"},docs:{description:{component:"All color design tokens used across Fazed Digital."}}}},l={name:"All Colors",render:()=>e.jsx(p,{})},s={name:"Core Palette",render:()=>e.jsxs("div",{style:{padding:"2rem",display:"flex",gap:"1.5rem",flexWrap:"wrap"},children:[e.jsx(a,{name:"--black",value:"#090909"}),e.jsx(a,{name:"--white",value:"#F5F4F0",textDark:!0}),e.jsx(a,{name:"--accent",value:"#C9FF57",textDark:!0}),e.jsx(a,{name:"--accent-dark",value:"#9FCC2E",textDark:!0})]})},i={name:"Grayscale Ladder",render:()=>e.jsx("div",{style:{padding:"2rem",display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"flex-end"},children:[{name:"--gray-900",value:"#111111",height:120},{name:"--gray-800",value:"#1C1C1C",height:110},{name:"--gray-700",value:"#2A2A2A",height:100},{name:"--gray-600",value:"#404040",height:90},{name:"--gray-500",value:"#676767",height:80},{name:"--gray-400",value:"#939393",height:70},{name:"--gray-300",value:"#BCBCBC",height:60},{name:"--gray-200",value:"#DCDCDC",height:50},{name:"--gray-100",value:"#EFEFEB",height:40}].map(({name:n,value:r,height:o})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"0.5rem",alignItems:"center",minWidth:80},children:[e.jsx("div",{style:{width:80,height:o,background:r,borderRadius:4,border:"1px solid rgba(255,255,255,0.06)"}}),e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.55rem",color:"var(--gray-400)",letterSpacing:"0.05em",textAlign:"center"},children:n})]},n))})};var m,d,c;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'All Colors',
  render: () => <AllColors />
}`,...(c=(d=l.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var g,u,x;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'Core Palette',
  render: () => <div style={{
    padding: '2rem',
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  }}>
      <Swatch name="--black" value="#090909" />
      <Swatch name="--white" value="#F5F4F0" textDark />
      <Swatch name="--accent" value="#C9FF57" textDark />
      <Swatch name="--accent-dark" value="#9FCC2E" textDark />
    </div>
}`,...(x=(u=s.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var v,y,h;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'Grayscale Ladder',
  render: () => <div style={{
    padding: '2rem',
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'flex-end'
  }}>
      {[{
      name: '--gray-900',
      value: '#111111',
      height: 120
    }, {
      name: '--gray-800',
      value: '#1C1C1C',
      height: 110
    }, {
      name: '--gray-700',
      value: '#2A2A2A',
      height: 100
    }, {
      name: '--gray-600',
      value: '#404040',
      height: 90
    }, {
      name: '--gray-500',
      value: '#676767',
      height: 80
    }, {
      name: '--gray-400',
      value: '#939393',
      height: 70
    }, {
      name: '--gray-300',
      value: '#BCBCBC',
      height: 60
    }, {
      name: '--gray-200',
      value: '#DCDCDC',
      height: 50
    }, {
      name: '--gray-100',
      value: '#EFEFEB',
      height: 40
    }].map(({
      name,
      value,
      height
    }) => <div key={name} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      alignItems: 'center',
      minWidth: 80
    }}>
          <div style={{
        width: 80,
        height,
        background: value,
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.06)'
      }} />
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        color: 'var(--gray-400)',
        letterSpacing: '0.05em',
        textAlign: 'center'
      }}>{name}</span>
        </div>)}
    </div>
}`,...(h=(y=i.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};const F=["All","CorePalette","GrayscaleLadder"];export{l as All,s as CorePalette,i as GrayscaleLadder,F as __namedExportsOrder,C as default};
