// layouts/default from /_nuxt/vhtpTbsT.js
import{ak as U,an as V,E as k,c as F,ao as E,ap as K,r as c,h as w,K as z,i as H,aq as q,ar as J,o as C,b as G,u as Q,n as L,d as M,e as N,v as B,g as l,P as W,m as X,f as Y,l as Z}from"./DEvfgKQY.js";
import ee from"./B_txIJPP.js";
import ne from"./BhG1gsiG.js";
import{u as te}from"./udEw_3Sy.js";
import"./DlAUqK2U.js";
var oe;
function se(){return oe}function ae(e){return typeof e=="function"?e():w(e)}function _(e){if(e instanceof Promise||e instanceof Date||e instanceof RegExp)return e;
const n=ae(e);
if(!e||!n)return n;
if(Array.isArray(n))return n.map(t=>_(t));
if(typeof n=="object"){const t={};
for(const o in n)if(Object.prototype.hasOwnProperty.call(n,o)){if(o==="titleTemplate"||o[0]==="o"&&o[1]==="n"){t[o]=w(n[o]);
continue}t[o]=_(n[o])}return t}return n}var le="usehead",O=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},R="__unhead_injection_handler__";
function re(){return R in O?O[R]():U(le)||se()}function ie(e,n={}){const t=n.head||re();
if(t)return t.ssr?t.push(e,n):ce(t,e,n)}function ce(e,n,t={}){const o=c(!1),u=c({});
V(()=>{u.value=o.value?{}:_(n)});
const s=e.push(u.value,t);
return k(u,d=>{s.patch(d)}),z()&&(F(()=>{s.dispose()}),E(()=>{o.value=!0}),K(()=>{o.value=!1})),s}var ue=e=>typeof e=="function",de=(e,n)=>{if(!e)return;
const t=H(()=>ue(e)?e():e);
ie(()=>t.value?{script:[{type:"application/ld+json",innerHTML:JSON.stringify(t.value,null,"")}]}:{},n)};
const fe={id:"portfolioOverlay",class:"portfolio-overlay"},pe={class:"portfolio-overlay-wrapper"},me={class:"thumbnail-image"},ve=["src"],he={class:"terms-modal-main"},we={class:"terms-modal-title"},be={__name:"default",setup(e){q(),J();
const{injectSkinClasses:n}=te();
de({"@context":"https://schema.org","@type":"Organization",name:"주식회사 베스플러스",url:"https://www.vesplus.co.kr",address:"서울특별시 강남구 영동대로 602, 6층",contactPoint:{"@type":"ContactPoint",telephone:"1833-2622",contactType:"customer service",areaServed:"KR",availableLanguage:"ko"},sameAs:["https://www.instagram.com/vesplus_official","https://www.youtube.com/channel/UC0o2DS4b32mPu1l5NhAMB7Q/featured","https://accounts.kakao.com/login?continue=http%3A%2F%2Fpf.kakao.com%2F_GKcaj%2Fchat"]}),C(()=>{});
const{$gsap:t,$scrollTrigger:o,$scrollSmoother:u,$bus:s,$smoothScroll:I}=G(),d=c(null),g=c(null),p=Q();
let r=null,f=null;
const j=()=>p.name==="portfolios-type",T=()=>{f?.revert(),f=null,r=null},D=()=>{j()||(f=t.matchMedia(),f.add("(min-width: 1025px)",()=>(r=u.create({wrapper:d.value,content:g.value,ignoreMobileResize:!0,smooth:1.75,effects:!1,smoothTouch:!1}),()=>{r?.kill()})),f.add("(max-width: 1024px)",()=>{}))},b=()=>{L(()=>{!d.value||!g.value||(T(),D(),requestAnimationFrame(()=>o?.refresh()))})},S=c(null);
C(()=>{L(()=>{b(),s.listen("fixed-area:image:loaded",x),s.listen("scrollTo",y),s.listen("scrollTop",P),s.listen("scrollPause",h),s.listen("terms",v)})});
const m=c(!1),v=()=>{m.value=!m.value,h(m.value)},x=a=>{S.value=a},y=a=>{r?r.scrollTo(a.top,a.smooth):window.scrollTo(0,a.top)},P=(a=!1)=>{r?r.scrollTop(0):window.scrollTo({top:0,left:0,behavior:"instant"})},h=a=>{r?r.paused(a):a?document.body.classList.add("paused"):document.body.classList.remove("paused")};
k(()=>p.name,()=>{b()}),F(()=>{T(),s.off("fixed-area:image:loaded",x),s.off("scrollTo",y),s.off("scrollTop",P),s.off("scrollPause",h),s.off("terms",v)}),n();
const A=["pr-center-type","portfolios-type"],$=H(()=>{const a=A.indexOf(p.name);return a>-1?A[a]:p.fullPath});
return k(()=>$.value,()=>{h(!1),y({top:0,smooth:!1})}),(a,i)=>(M(),N("div",{class:"layout",ref_key:"refsLayout",ref:d},[B(ee),l("div",{ref_key:"refsContent",ref:g,class:"content"},[W(a.$slots,"default"),B(ne)],512),l("div",fe,[l("div",pe,[i[0]||(i[0]=l("div",{class:"portfolio-title-section"},null,-1)),l("div",me,[l("img",{src:w(S),alt:""},null,8,ve)])])]),l("div",{class:Z([{active:w(m)},"term-modal"])},[l("div",{class:"terms-modal-bg",onClick:v}),l("div",he,[l("div",we,[i[2]||(i[2]=X(" 개인정보처리방침 ",-1)),(M(),N("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 21 20",fill:"none",onClick:v},[...i[1]||(i[1]=[Y('<g clip-path="url(#clip0_425_256)"><path d="M1.51471 1.48535L18.4853 18.4559" stroke="white" stroke-width="1.33333"></path><path d="M18.4853 1.48535L1.51473 18.4559" stroke="white" stroke-width="1.33333"></path></g><defs><clipPath id="clip0_425_256"><rect width="21" height="20" fill="white"></rect></clipPath></defs>',2)])]))]),i[3]||(i[3]=l("div",{class:"terms-modal-content"},[l("pre",null,`개인정보처리방침

주식회사 베스플러스 고객님의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.

회사는 개인정보처리방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.

■ 수집하는 개인정보 항목 및 수집방법

1) 수집하는 개인정보의 항목

     회사는 상담, 서비스신청을 위해 아래와 같은 개인정보를 수집하고 있습니다.
     - 성명, 회사명, 연락처, 이메일, 문의내용
     서비스 이용 과정이나 사업 처리 과정에서 서비스이용기록, 접속로그, 쿠키, 접속 IP, 결제 기록, 불량이용 기록이 생성되어 수집될 수 있습니다.

2) 수집방법 - 홈페이지 내 대행문의, 제휴문의, 채용문의

■ 개인정보의 수집 및 이용목적
     회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
     - 성명: 정확한 상담 진행을 위한 기본적인 사용자 정보
     - 전화번호, 이메일: 문의 사항에 대한 답변 전달을 위한 연락처 정보

■ 개인정보의 보유 및 이용기간
     원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
     단, 관련 법령에 의한 정보 보유 사유 전자상거래 등에서의 소비자보호에 관한법률 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.

1) 계약 또는 청약철회 등에 관한 기록
     -보존이유 : 전자상거래등에서의 소비자보호에 관한법률
     -보존기간 : 5년

2) 대금 결제 및 재화 등의 공급에 관한 기록
     -보존이유: 전자상거래등에서의 소비자보호에 관한법률
     -보존기간 : 5년

3) 소비자 불만 또는 분쟁처리에 관한 기록
     -보존이유 : 전자상거래등에서의 소비자보호에 관한법률
     -보존기간 : 3년

4) 로그 기록
     -보존이유 : 통신비밀보호법
     -보존기간 : 3개월

■ 개인정보의 파기절차 및 방법
     회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.      파기절차 및 방법은 다음과 같습니다.

1) 파기절차회원님이 상담을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기되어집니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유되어지는 이외의 다른 목적으로 이용되지 않습니다.

2) 파기방법: 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.

■ 개인정보 제공
     회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.

1) 이용자들이 사전에 동의한 경우

2) 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

■ 이용자 및 법정대리인의 권리와 그 행사방법

1) 이용자의 개인정보를 최신의 상태로 정확하게 입력하여 불의의 사고를 예방해 주시기 바랍니다. 이용자가 입력한 부정확한 정보로 인해 발생하는 사고의 책임은 이용자 자신에게 있습니다.
2) 이용자는 개인정보를 보호받을 권리와 함께 스스로를 보호하고 타인의 정보를 침해하지 않을 의무도 가지고 있습니다. 비밀번호를 포함한 개인정보가 유출되지 않도록 조심하시고 게시물을 포함한 타인의 개인정보를 훼손하지 않도록 유의해 주십시오. 만약 이 같은 책임을 다하지 못하고 타인의 정보 및 존엄성을 훼손할 시에는 「정보통신망이용촉진및정보보호등에관한법률」 등에 의해 처벌받을 수 있습니다.
3) 이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있습니다. 혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.
4) 만14세미만 아동의 경우, 법정대리인이 아동의 개인정보를 조회하거나 수정할 권리, 수집 및 이용 동의를 철회할 권리를 가집니다.
5) 귀하가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록 하겠습니다.
6) 회사는 이용자의 요청에 의해 해지 또는 삭제된 개인정보는 "회사가 수집하는 개인정보의 보유 및 이용기간"에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
7) 만 14세 미만 아동의 경우 법정 대리인이 아동의 개인정보를 조회하거나 수정할 권리, 수집 및 이용 동의를 철회할 권리를 가집니다.

■ 개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항 회사는 귀하의 정보를 수시로 저장하고 찾아내는 "쿠키(cookie)" 등을 운용합니다. 쿠키란 웹사이트를 운영하는데 이용되는 서버가 귀하의 브라우저에 보내는 아주 작은 텍스트 파일로서 귀하의 컴퓨터 하드디스크에 저장됩니다. 회사는 다음과 같은 목적을 위해 쿠키를 사용합니다.

1) 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공
2) 귀하는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 귀하는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
3) 쿠키 설정을 거부하는 방법으로는 회원님이 사용하시는 웹 브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나 쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
4) 설정방법 예(인터넷 익스플로어의 경우) : 웹 브라우저 상단의 도구 > 인터넷 옵션 > 개인정보
5) 단, 귀하께서 쿠키 설치를 거부하였을 경우 서비스 제공에 어려움이 있을 수 있습니다.

■ 개인정보에 관한 민원서비스
회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보관리책임자를 지정하고 있습니다.

1) 개인정보관리담당자
     성명 : 이슬기
     소속 : 마케팅기획부
     전화번호 : 010-8402-8431

2) 개인정보관리책임자
     성명 : 류동우
     소속 : 마케팅기획부
     전화번호 : 010-4940-3180

3) 귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자 혹은 담당부서로 신고하실 수 있습니다.

4) 회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.

5) 기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.

개인정보침해신고센터 (privacy.kisa.or.kr / 국번 없이 118)
대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-2000)
경찰청 사이버안전국 (www.ctrc.go.kr/ 국번 없이 182)
`)],-1))])],2)],512))}};
export{be as default};

