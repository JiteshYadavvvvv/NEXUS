import Spline from '@splinetool/react-spline'

export default function SplineScene({
  scene = 'https://prod.spline.design/2GPfWT-jSek6D606/scene.splinecode',
  className = '',
  onLoad,
}) {
  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`.trim()}>
      <Spline scene={scene} className="w-full h-full" onLoad={onLoad} />
    </div>
  )
}
