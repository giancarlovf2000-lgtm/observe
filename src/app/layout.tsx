import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'OBSERVE — Global Intelligence Platform',
    template: '%s | OBSERVE',
  },
  description:
    'Advanced global situational awareness platform. Monitor conflicts, weather events, shipping, flights, markets, and breaking news in real time on an interactive world map.',
  keywords: [
    'global intelligence', 'world map', 'situational awareness',
    'geopolitical monitoring', 'conflict tracking', 'weather monitoring',
  ],
  openGraph: {
    type: 'website',
    title: 'OBSERVE — Global Intelligence Platform',
    description: 'Monitor the world in real time. Intelligence-grade situational awareness for every domain.',
    siteName: 'OBSERVE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OBSERVE — Global Intelligence Platform',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      
        <script id="siteforge-companion" dangerouslySetInnerHTML={{ __html: `(function(){if(window.top===window.self)return;var active=false;function activate(){if(active)return;active=true;var style=document.createElement('style');style.textContent='.sf-hover{outline:2px solid #3b82f6!important;outline-offset:2px!important;cursor:crosshair!important;}.sf-selected{outline:3px solid #f59e0b!important;outline-offset:2px!important;}';document.head.appendChild(style);var hovered=null,selected=null;function getSelector(el){var path=[];var cur=el;while(cur&&cur.nodeType===1&&path.length<5){var seg=cur.tagName.toLowerCase();if(cur.id){seg+='#'+cur.id;path.unshift(seg);break;}if(cur.className&&typeof cur.className==='string'){var cls=cur.className.trim().split(' ').filter(Boolean).slice(0,2).join('.');if(cls)seg+='.'+cls;}path.unshift(seg);cur=cur.parentElement;}return path.join(' > ');}function getInfo(el){return{tag:el.tagName,text:(el.innerText||el.textContent||'').trim().slice(0,200),selector:getSelector(el),outerHTML:el.outerHTML.slice(0,600),path:window.location.pathname};}document.addEventListener('mouseover',function(e){var t=e.target;if(hovered&&hovered!==selected)hovered.classList.remove('sf-hover');hovered=t;if(t!==selected)t.classList.add('sf-hover');});document.addEventListener('mouseout',function(e){if(e.target!==selected)e.target.classList.remove('sf-hover');});document.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(selected)selected.classList.remove('sf-selected');selected=e.target;selected.classList.remove('sf-hover');selected.classList.add('sf-selected');window.parent.postMessage({type:'siteforge_selection',payload:getInfo(selected)},'*');},true);}window.addEventListener('message',function(e){if(e.data&&e.data.type==='siteforge_activate')activate();});if(window.location.search.includes('siteforge=true'))activate();})();` }} />
      </body>
    </html>
  )
}
