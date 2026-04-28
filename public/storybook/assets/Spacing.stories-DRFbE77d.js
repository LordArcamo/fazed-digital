import{j as e}from"./iframe-DPjQQZx3.js";import"./preload-helper-4_59RN96.js";function a({name:r,value:o,description:n}){return e.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},children:[e.jsx("td",{style:{padding:"0.875rem 1rem",fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"var(--accent)",whiteSpace:"nowrap"},children:r}),e.jsx("td",{style:{padding:"0.875rem 1rem",fontFamily:"var(--font-mono)",fontSize:"0.72rem",color:"var(--white)"},children:o}),e.jsx("td",{style:{padding:"0.875rem 1rem",fontFamily:"var(--font-body)",fontSize:"0.8rem",color:"var(--gray-500)"},children:n})]})}function v({label:r,value:o,widthPx:n}){return e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"0.75rem"},children:[e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--gray-600)",width:80,textAlign:"right",flexShrink:0},children:r}),e.jsx("div",{style:{height:24,width:n,background:"var(--accent)",opacity:.6,borderRadius:2,minWidth:4}}),e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--gray-500)"},children:o})]})}function x(){return e.jsxs("div",{style:{padding:"2rem",maxWidth:800,fontFamily:"var(--font-body)"},children:[e.jsx("h1",{style:{fontFamily:"var(--font-display)",fontSize:"2rem",fontWeight:700,marginBottom:"0.5rem",color:"var(--white)"},children:"Spacing & Layout"}),e.jsx("p",{style:{color:"var(--gray-500)",fontSize:"0.875rem",marginBottom:"3rem"},children:"Design tokens for spacing, typography sizing, and layout constraints."}),e.jsxs("div",{style:{marginBottom:"3rem"},children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"1rem"},children:"Layout Tokens"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"},children:[e.jsx("thead",{children:e.jsx("tr",{style:{background:"var(--gray-900)"},children:["Token","Value","Usage"].map(r=>e.jsx("th",{style:{padding:"0.75rem 1rem",textAlign:"left",fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--gray-600)",letterSpacing:"0.12em",textTransform:"uppercase",borderBottom:"1px solid var(--border)"},children:r},r))})}),e.jsxs("tbody",{children:[e.jsx(a,{name:"--container",value:"1340px",description:"Max content width, centered with auto margins"}),e.jsx(a,{name:"--gutter",value:"clamp(1.5rem, 5vw, 4rem)",description:"Horizontal page padding, fluid 24–64px"}),e.jsx(a,{name:"--radius",value:"0.875rem",description:"Default border-radius for cards and inputs"}),e.jsx(a,{name:"section",value:"clamp(5rem, 10vw, 10rem)",description:".section padding-top/bottom — 80–160px"}),e.jsx(a,{name:"section-sm",value:"clamp(3rem, 6vw, 6rem)",description:".section-sm padding — 48–96px"})]})]})]}),e.jsxs("div",{style:{marginBottom:"3rem"},children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"1rem"},children:"Easing Tokens"}),e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"},children:[e.jsx("thead",{children:e.jsx("tr",{style:{background:"var(--gray-900)"},children:["Token","cubic-bezier","Character"].map(r=>e.jsx("th",{style:{padding:"0.75rem 1rem",textAlign:"left",fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--gray-600)",letterSpacing:"0.12em",textTransform:"uppercase",borderBottom:"1px solid var(--border)"},children:r},r))})}),e.jsxs("tbody",{children:[e.jsx(a,{name:"--ease-expo",value:"cubic-bezier(0.19, 1, 0.22, 1)",description:"Dramatic decelerate — nav overlays, page transitions"}),e.jsx(a,{name:"--ease-bounce",value:"cubic-bezier(0.34, 1.56, 0.64, 1)",description:"Spring overshoot — button hover, scale effects"}),e.jsx(a,{name:"--ease-in",value:"cubic-bezier(0.76, 0, 0.24, 1)",description:"Smooth accelerate-decelerate — most UI motion"})]})]})]}),e.jsxs("div",{style:{marginBottom:"3rem"},children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"1rem"},children:"Visual Spacing Scale (px)"}),e.jsx("div",{style:{padding:"1.5rem",background:"var(--gray-900)",borderRadius:8,border:"1px solid var(--border)"},children:[{label:"4px",value:"0.25rem",widthPx:4},{label:"8px",value:"0.5rem",widthPx:8},{label:"12px",value:"0.75rem",widthPx:12},{label:"16px",value:"1rem",widthPx:16},{label:"24px",value:"1.5rem",widthPx:24},{label:"32px",value:"2rem",widthPx:32},{label:"48px",value:"3rem",widthPx:48},{label:"64px",value:"4rem",widthPx:64},{label:"96px",value:"6rem",widthPx:96},{label:"128px",value:"8rem",widthPx:128},{label:"160px",value:"10rem",widthPx:160}].map(r=>e.jsx(v,{...r},r.label))})]}),e.jsxs("div",{style:{marginBottom:"3rem"},children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.65rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:"1rem"},children:"Grid Helpers"}),[2,3,4].map(r=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsxs("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--gray-600)",marginBottom:"0.5rem"},children:[".grid-",r]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${r}, 1fr)`,gap:"1.5rem"},children:Array.from({length:r}).map((o,n)=>e.jsx("div",{style:{height:40,background:"var(--gray-800)",borderRadius:4,border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.55rem",color:"var(--gray-600)"},children:["col ",n+1]})},n))})]},r))]})]})}const h={title:"Design System/Spacing & Layout",parameters:{layout:"fullscreen",backgrounds:{default:"dark"},docs:{description:{component:"Spacing scale, layout tokens, easing curves, and grid helpers."}}}},t={name:"All Tokens",render:()=>e.jsx(x,{})},i={name:"Grid Helpers",render:()=>e.jsx("div",{style:{padding:"2rem",maxWidth:900},children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"2rem"},children:[{cls:"grid-2",label:".grid-2 — 2 columns",cols:2},{cls:"grid-3",label:".grid-3 — 3 columns",cols:3},{cls:"grid-4",label:".grid-4 — 4 columns",cols:4}].map(({cls:r,label:o,cols:n})=>e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"var(--accent)",marginBottom:"0.75rem",letterSpacing:"0.1em"},children:o}),e.jsx("div",{className:r,children:Array.from({length:n}).map((y,l)=>e.jsx("div",{style:{height:60,background:"var(--gray-900)",border:"1px solid var(--border)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"var(--gray-500)"},children:["Column ",l+1]})},l))})]},r))})})};var s,d,m;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  name: 'All Tokens',
  render: () => <AllSpacing />
}`,...(m=(d=t.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var c,p,g;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'Grid Helpers',
  render: () => <div style={{
    padding: '2rem',
    maxWidth: 900
  }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
        {[{
        cls: 'grid-2',
        label: '.grid-2 — 2 columns',
        cols: 2
      }, {
        cls: 'grid-3',
        label: '.grid-3 — 3 columns',
        cols: 3
      }, {
        cls: 'grid-4',
        label: '.grid-4 — 4 columns',
        cols: 4
      }].map(({
        cls,
        label,
        cols
      }) => <div key={cls}>
            <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--accent)',
          marginBottom: '0.75rem',
          letterSpacing: '0.1em'
        }}>{label}</div>
            <div className={cls}>
              {Array.from({
            length: cols
          }).map((_, i) => <div key={i} style={{
            height: 60,
            background: 'var(--gray-900)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
                  <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--gray-500)'
            }}>Column {i + 1}</span>
                </div>)}
            </div>
          </div>)}
      </div>
    </div>
}`,...(g=(p=i.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};const b=["All","GridHelpers"];export{t as All,i as GridHelpers,b as __namedExportsOrder,h as default};
