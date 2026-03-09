import dynamic from 'next/dynamic'

const App = dynamic(() => import('@/components/app-shell'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      minHeight: '100vh', 
      background: '#ffffff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        width: 48, 
        height: 48, 
        border: '4px solid #d4af37', 
        borderTopColor: 'transparent', 
        borderRadius: '50%', 
        animation: 'spin 0.8s linear infinite' 
      }} />
    </div>
  )
})

export default function Home() {
  return <App />
}
