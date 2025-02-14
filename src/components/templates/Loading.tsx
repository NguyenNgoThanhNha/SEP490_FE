import Lottie from 'lottie-react'
import animation from '../../assets/animations/loading.json'
const Loading = () => {
  return (
    <div className={'fixed inset-0 flex justify-center items-center backdrop-brightness-95 z-40'}>
      <div className={'w-60'}>
        <Lottie animationData={animation} loop={true} autoPlay={true} />
      </div>
    </div>
  )
}

export default Loading
